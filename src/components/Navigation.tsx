import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  MessageCircle, 
  Bell, 
  User, 
  Menu,
  X,
  Handshake,
  LogOut
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <Handshake className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-gradient">SkillSwap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/browse" className="text-foreground hover:text-primary transition-colors">
              Browse Skills
            </Link>
            <button 
              onClick={() => {
                navigate('/');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-foreground hover:text-primary transition-colors"
            >
              How it Works
            </button>
            {user && (
              <Link to="/profile" className="text-foreground hover:text-primary transition-colors">
                Profile
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search skills..." 
                className="pl-10 bg-muted/50 border-border"
                onFocus={() => navigate('/browse')}
              />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/chat')}>
                  <MessageCircle className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </Button>
                <Button variant="ghost" size="sm" className="relative" onClick={() => navigate('/notifications')}>
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate('/auth')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search skills..." 
                  className="pl-10 bg-muted/50 border-border"
                  onFocus={() => navigate('/browse')}
                />
              </div>
              <Link to="/browse" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                Browse Skills
              </Link>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/');
                  setTimeout(() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="text-foreground hover:text-primary transition-colors py-2 text-left"
              >
                How it Works
              </button>
              {user && (
                <Link to="/profile" className="text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                  Profile
                </Link>
              )}
              <div className="flex space-x-4 pt-4 border-t border-border">
                {user ? (
                  <Button variant="outline" className="flex-1" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => navigate('/auth')}>
                      Sign In
                    </Button>
                    <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => navigate('/auth')}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
