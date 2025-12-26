import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowRightLeft, Loader2 } from "lucide-react";

interface ProposeSwapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestedSkillId: string;
  requestedSkillTitle: string;
}

interface UserSkill {
  id: string;
  title: string;
  category: string;
}

export const ProposeSwapDialog = ({ 
  open, 
  onOpenChange, 
  requestedSkillId, 
  requestedSkillTitle 
}: ProposeSwapDialogProps) => {
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSkills, setFetchingSkills] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchUserSkills();
    }
  }, [open]);

  const fetchUserSkills = async () => {
    try {
      setFetchingSkills(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to propose a swap");
        onOpenChange(false);
        return;
      }

      const { data, error } = await supabase
        .from('skills')
        .select('id, title, category')
        .eq('user_id', user.id)
        .eq('is_active', true);

      if (error) throw error;

      setUserSkills(data || []);
      
      if (data && data.length === 0) {
        toast.info("You need to create at least one skill to propose a swap");
      }
    } catch (error: any) {
      console.error('Error fetching user skills:', error);
      toast.error('Failed to load your skills');
    } finally {
      setFetchingSkills(false);
    }
  };

  const handleProposeSwap = async () => {
    if (!selectedSkillId) {
      toast.error("Please select a skill to offer");
      return;
    }

    const MAX_MESSAGE_LENGTH = 2000;
    if (message.trim().length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`);
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to propose a swap");
        return;
      }

      // Create barter request
      const { data: barterRequest, error: barterError } = await supabase
        .from('barter_requests')
        .insert({
          requester_id: user.id,
          requested_skill_id: requestedSkillId,
          offered_skill_id: selectedSkillId,
          message: message.trim() || null,
          status: 'pending'
        })
        .select('id')
        .single();

      if (barterError) throw barterError;

      // Send an initial message if provided
      if (message.trim()) {
        const { error: msgError } = await supabase
          .from('messages')
          .insert({
            barter_request_id: barterRequest.id,
            sender_id: user.id,
            content: message.trim()
          });
        
        if (msgError) {
          console.error('Error sending initial message:', msgError);
        }
      }

      toast.success("Swap proposal sent! Opening chat...");
      
      // Navigate to chat with the new conversation
      navigate('/chat');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error proposing swap:', error);
      toast.error('Failed to send swap proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Propose a Skill Swap
          </DialogTitle>
          <DialogDescription>
            Select one of your skills to offer in exchange for "{requestedSkillTitle}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {fetchingSkills ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : userSkills.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">You don't have any skills yet</p>
              <Button onClick={() => navigate('/profile')}>
                Create Your First Skill
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="skill-select">Your Skill to Offer</Label>
                <Select value={selectedSkillId} onValueChange={setSelectedSkillId}>
                  <SelectTrigger id="skill-select">
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {userSkills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        {skill.title} ({skill.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Introduction Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Introduce yourself and explain why you'd like to learn this skill..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleProposeSwap}
                  disabled={loading || !selectedSkillId}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Proposal"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
