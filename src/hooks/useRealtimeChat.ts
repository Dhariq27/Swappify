import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  barter_request_id?: string;
}

export interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_avatar: string;
  lastMessage?: string;
  lastMessageTime?: string;
  barter_request_id?: string;
}

export const useRealtimeChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Fetch conversations from barter requests
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;

    try {
      // Get all barter requests where user is involved (as requester or skill owner)
      const { data: barterRequests, error } = await supabase
        .from('barter_requests')
        .select(`
          id,
          requester_id,
          requested_skill_id,
          offered_skill_id,
          status,
          updated_at,
          skills!barter_requests_requested_skill_id_fkey(user_id)
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Build conversations list with other participants
      const convList: Conversation[] = [];
      
      for (const request of barterRequests || []) {
        // Determine if user is requester or skill owner
        const isRequester = request.requester_id === currentUserId;
        const isSkillOwner = request.skills?.user_id === currentUserId;
        
        // Skip if user is not involved
        if (!isRequester && !isSkillOwner) continue;
        
        const otherUserId = isRequester ? request.skills?.user_id : request.requester_id;

        if (!otherUserId) continue;

        // Get other user profile using profiles_public
        const { data: profile } = await supabase
          .from('profiles_public')
          .select('id, full_name, avatar_url')
          .eq('id', otherUserId)
          .single();

        // Get last message
        const { data: lastMsg } = await supabase
          .from('messages')
          .select('content, created_at')
          .eq('barter_request_id', request.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (profile) {
          convList.push({
            id: request.id,
            participant_id: profile.id,
            participant_name: profile.full_name || 'Unknown User',
            participant_avatar: profile.avatar_url || '',
            lastMessage: lastMsg?.content,
            lastMessageTime: lastMsg?.created_at,
            barter_request_id: request.id,
          });
        }
      }

      setConversations(convList);
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Fetch messages for a barter request
  const fetchMessages = useCallback(async (barterRequestId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('barter_request_id', barterRequestId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(prev => ({ ...prev, [barterRequestId]: data || [] }));
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  }, []);

  // Send a message
  const sendMessage = useCallback(async (barterRequestId: string, content: string) => {
    if (!currentUserId || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          barter_request_id: barterRequestId,
          sender_id: currentUserId,
          content: content.trim(),
        });

      if (error) throw error;

      // Update barter request's updated_at
      await supabase
        .from('barter_requests')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', barterRequestId);

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  }, [currentUserId]);

  // Create or get barter request conversation with a user
  const getOrCreateConversation = useCallback(async (otherUserId: string, offeredSkillId?: string): Promise<string | null> => {
    if (!currentUserId || currentUserId === otherUserId) return null;

    try {
      // For now, check if there's an existing barter request between users
      const { data: existing } = await supabase
        .from('barter_requests')
        .select('id')
        .eq('requester_id', currentUserId)
        .maybeSingle();

      if (existing) {
        await fetchConversations();
        return existing.id;
      }

      // Create a new barter request to enable messaging
      // This will need a skill to be offered - for demo purposes
      if (!offeredSkillId) {
        toast.error('Please select a skill to offer first');
        return null;
      }

      const { data: newRequest, error } = await supabase
        .from('barter_requests')
        .insert({
          requester_id: currentUserId,
          requested_skill_id: offeredSkillId,
          offered_skill_id: offeredSkillId, // Temporary - should be actual offered skill
          status: 'pending',
        })
        .select('id')
        .single();

      if (error) throw error;

      await fetchConversations();
      return newRequest.id;
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to start conversation');
      return null;
    }
  }, [currentUserId, fetchConversations]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!currentUserId) return;

    // Subscribe to new messages
    const messagesChannel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as any;
          const requestId = newMessage.barter_request_id;
          if (requestId) {
            // Add message to state if not already present
            setMessages(prev => {
              const existingMessages = prev[requestId] || [];
              const messageExists = existingMessages.some(m => m.id === newMessage.id);
              if (messageExists) return prev;
              
              return {
                ...prev,
                [requestId]: [...existingMessages, newMessage],
              };
            });
            
            // Refresh conversations to update last message
            fetchConversations();
          }
        }
      )
      .subscribe((status) => {
        console.log('Messages channel status:', status);
      });

    // Subscribe to barter request updates
    const barterChannel = supabase
      .channel('barter-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'barter_requests',
        },
        () => fetchConversations()
      )
      .subscribe((status) => {
        console.log('Barter channel status:', status);
      });

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(barterChannel);
    };
  }, [currentUserId, fetchConversations]);

  // Initial fetch
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId, fetchConversations]);

  return {
    conversations,
    messages,
    currentUserId,
    loading,
    fetchMessages,
    sendMessage,
    getOrCreateConversation,
    refreshConversations: fetchConversations,
  };
};