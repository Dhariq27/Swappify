import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-skills.jpg";

const Hero = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 hero-gradient opacity-10"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Trade Skills, Not
                <span className="text-gradient block">Money</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Connect with people in your community to exchange knowledge and skills. 
                Learn guitar, teach coding, practice languages, or share any skill you have.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground group"
                onClick={() => navigate('/browse')}
              >
                Start Trading Skills
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/browse')}
              >
                Browse Skills
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold">5,000+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <div className="font-semibold">200+</div>
                  <div className="text-sm text-muted-foreground">Skills Available</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <MessageCircle className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="font-semibold">1,500+</div>
                  <div className="text-sm text-muted-foreground">Successful Swaps</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative">
              <img 
                src={heroImage} 
                alt="People exchanging skills" 
                className="rounded-2xl shadow-elegant w-full h-auto"
              />
              {/* Floating cards */}
              <div className="absolute -top-4 -left-4 bg-card rounded-xl p-4 shadow-card border border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-semibold">🎸</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Guitar Lessons</div>
                    <div className="text-xs text-muted-foreground">for Coding Help</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-card rounded-xl p-4 shadow-card border border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground text-sm font-semibold">💻</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Web Development</div>
                    <div className="text-xs text-muted-foreground">for Photography</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
