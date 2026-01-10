import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SkillCard from "@/components/SkillCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSkills, mockCategories } from "@/data/mockData";
import { 
  ArrowRight, 
  Users, 
  Shield, 
  MessageCircle, 
  Star,
  CheckCircle,
  Zap
} from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      
      {/* Featured Skills Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Featured Skills
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing skills from our community members
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {mockSkills.slice(0, 6).map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
          
          <div className="text-center">
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/browse'}>
              View All Skills
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find skills in categories that interest you
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockCategories.map(category => (
              <div 
                key={category.id}
                className="bg-card p-6 rounded-xl border border-border card-hover cursor-pointer text-center group"
                onClick={() => window.location.href = `/browse?category=${encodeURIComponent(category.name)}`}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.count} skills
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How SkillSwap Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start trading skills in three simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Create Your Profile</h3>
              <p className="text-muted-foreground">
                List skills you can teach and skills you want to learn. 
                Build trust with reviews and verification.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <MessageCircle className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Connect & Negotiate</h3>
              <p className="text-muted-foreground">
                Browse skills, send barter requests, and chat with other members 
                to arrange fair skill exchanges.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-success/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-success/20 transition-colors">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Learn & Teach</h3>
              <p className="text-muted-foreground">
                Meet up (online or in-person) to exchange knowledge. 
                Rate your experience and build your reputation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose SkillSwap?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-3">Safe & Secure</h3>
              <p className="text-muted-foreground">
                Verified profiles, secure messaging, and community ratings ensure safe exchanges.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <Zap className="h-8 w-8 text-accent mb-4" />
              <h3 className="text-lg font-semibold mb-3">No Money Involved</h3>
              <p className="text-muted-foreground">
                Pure skill exchange - no payments, just knowledge sharing and community building.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <Star className="h-8 w-8 text-warning mb-4" />
              <h3 className="text-lg font-semibold mb-3">Quality Guaranteed</h3>
              <p className="text-muted-foreground">
                Rating system and reviews help you find the best teachers and maintain quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Trading Skills?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of learners and teachers in our growing community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => window.location.href = '/auth?mode=signup'}
            >
              Sign Up Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/browse'}
            >
              Browse Skills
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground/5 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-primary rounded-lg">
                  <Users className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg text-gradient">SkillSwap</span>
              </div>
              <p className="text-muted-foreground">
                Building communities through skill sharing and knowledge exchange.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Browse Skills</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Teach</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Learn</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Safety</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SkillSwap. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;