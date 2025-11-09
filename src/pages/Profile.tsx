import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import EditProfileDialog from "@/components/EditProfileDialog";
import { CreateSkillDialog } from "@/components/CreateSkillDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockUser, mockBarterRequests } from "@/data/mockData";
import { 
  MapPin, 
  Star, 
  Calendar, 
  Plus,
  MessageCircle,
  Trophy,
  Clock,
  Check,
  X
} from "lucide-react";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(mockUser);
  const [requests, setRequests] = useState(mockBarterRequests);

  useEffect(() => {
    // Load user profile from Supabase on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.id) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUser(prev => ({
                ...prev,
                name: data.full_name || prev.name,
                location: data.location || prev.location,
                bio: data.bio || prev.bio,
                avatar: data.avatar_url || prev.avatar,
              }));
            }
          });
      }
    });
  }, []);

  const handleSaveProfile = (updatedUser: any) => {
    setUser({ ...user, ...updatedUser });
  };

  const handleAcceptRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
    toast.success("Request accepted! Check your messages.");
    navigate('/chat');
  };

  const handleDeclineRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
    toast.success("Request declined.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Profile Header */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span>{user.rating} rating</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{user.totalSwaps} swaps completed</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.joinedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <CreateSkillDialog onSkillCreated={() => window.location.reload()} />
                    <Button variant="outline" onClick={() => navigate('/chat')}>
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <EditProfileDialog currentUser={user} onSave={handleSaveProfile} />
                  </div>
                </div>
                
                <p className="text-muted-foreground">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="skills" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Skills I Offer */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Skills I Offer</CardTitle>
                    <Button size="sm" onClick={() => {
                      toast.success("Add skill feature coming soon!");
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.skillsOffered.map(skill => (
                      <div key={skill.id} className="p-4 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{skill.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {skill.level}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{skill.description}</p>
                        <Badge variant="secondary" className="text-xs">
                          {skill.category}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Skills I Want to Learn */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">Skills I Want to Learn</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => {
                      toast.success("Add interest feature coming soon!");
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Interest
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsWanted.map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Barter Requests Tab */}
            <TabsContent value="requests" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">Pending Requests</h2>
                  <Badge variant="secondary">{requests.length} new</Badge>
                </div>
                
                {requests.map(request => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.from.avatar} alt={request.from.name} />
                          <AvatarFallback>{request.from.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{request.from.name}</h3>
                              <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(request.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="bg-success hover:bg-success/90 text-success-foreground"
                                onClick={() => handleAcceptRequest(request.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeclineRequest(request.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Decline
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-muted/50 p-3 rounded-lg mb-3">
                            <div className="text-sm font-medium mb-1">Skill Exchange Proposal:</div>
                            <div className="text-sm">
                              <span className="text-accent font-medium">{request.skillOffered}</span>
                              <span className="mx-2">↔</span>
                              <span className="text-primary font-medium">{request.skillWanted}</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm">{request.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Swap History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">Your swap history will appear here</h3>
                    <p className="text-muted-foreground">
                      Complete your first skill exchange to see your history
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews & Ratings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">⭐</div>
                    <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground">
                      Complete skill exchanges to receive reviews from other members
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
};

export default Profile;