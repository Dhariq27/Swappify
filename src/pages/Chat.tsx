import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import ChatInput from "@/components/ChatInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeChat } from "@/hooks/useRealtimeChat";
import { toast } from "sonner";
import { 
  Search, 
  MoreVertical,
  Phone,
  Video,
  Info,
  MessageSquare
} from "lucide-react";

const Chat = () => {
  const {
    conversations,
    messages,
    currentUserId,
    loading,
    fetchMessages,
    sendMessage: sendMsg,
  } = useRealtimeChat();

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Auto-select first conversation
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0].id);
    }
  }, [conversations, selectedConversation]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation);
    }
  }, [selectedConversation, fetchMessages]);

  const handleSendMessage = async () => {
    if (!selectedConversation || !message.trim()) return;

    const MAX_MESSAGE_LENGTH = 2000;
    if (message.trim().length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    try {
      await sendMsg(selectedConversation, message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : [];

  const filteredConversations = conversations.filter(conv => 
    conv.participant_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Chat List Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Messages</h2>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-340px)]">
                  {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-4">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No conversations yet</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Start chatting by proposing a skill swap!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1 p-4">
                      {filteredConversations.map(conv => (
                        <div
                          key={conv.id}
                          onClick={() => setSelectedConversation(conv.id)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                            selectedConversation === conv.id ? 'bg-muted' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={conv.participant_avatar} alt={conv.participant_name} />
                              <AvatarFallback>{conv.participant_name.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium truncate">{conv.participant_name}</span>
                                {conv.lastMessageTime && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(conv.lastMessageTime).toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit' 
                                    })}
                                  </span>
                                )}
                              </div>
                              {conv.lastMessage && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {conv.lastMessage}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-3">
            {selectedConv ? (
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={selectedConv.participant_avatar} 
                          alt={selectedConv.participant_name} 
                        />
                        <AvatarFallback>
                          {selectedConv.participant_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedConv.participant_name}</h3>
                        <p className="text-sm text-muted-foreground">Online</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Video className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <div className="flex-1 flex flex-col">
                  <ScrollArea className="flex-1 p-4">
                    {currentMessages.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentMessages.map(msg => {
                          const isOwn = msg.sender_id === currentUserId;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-[70%]`}>
                                <div
                                  className={`p-3 rounded-2xl ${
                                    isOwn
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{msg.content}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 px-3">
                                  {new Date(msg.created_at).toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <ChatInput 
                    message={message}
                    setMessage={setMessage}
                    onSendMessage={handleSendMessage}
                  />
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a conversation to start chatting</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;