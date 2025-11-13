import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import SkillCard from "@/components/SkillCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockSkills, mockCategories } from "@/data/mockData";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Browse = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category.toLowerCase());
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data: skillsData, error } = await supabase
        .from('skills')
        .select(`
          *,
          profiles!skills_user_id_fkey (
            id,
            full_name,
            avatar_url,
            location
          )
        `)
        .eq('is_active', true);

      if (error) throw error;

      // Transform database skills to match SkillCard format
      const transformedSkills = skillsData?.map((skill: any) => ({
        id: skill.id,
        title: skill.title,
        description: skill.description,
        category: skill.category,
        teacher: {
          name: skill.profiles?.full_name || 'Anonymous',
          avatar: skill.profiles?.avatar_url || '',
          rating: 4.8, // TODO: Add ratings system
          location: skill.profiles?.location || 'Unknown'
        },
        wantedSkills: [], // TODO: Add wanted skills field
        duration: skill.duration_description || `${skill.duration_hours || 1} hours/week`,
        difficulty: (skill.level || 'Beginner') as 'Beginner' | 'Intermediate' | 'Advanced',
        isOnline: true,
        is_verified: skill.is_verified || false,
        video_url: skill.video_url || undefined,
        certificate_urls: skill.certificate_urls || [],
        material_urls: skill.material_urls || []
      })) || [];

      // Fallback to mock skills if no real skills exist
      setSkills(transformedSkills.length > 0 ? transformedSkills : mockSkills);
    } catch (error: any) {
      console.error('Error fetching skills:', error);
      toast.error('Failed to load skills');
      setSkills(mockSkills); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         skill.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || skill.category.toLowerCase().includes(selectedCategory);
    const matchesDifficulty = selectedDifficulty === "all" || skill.difficulty === selectedDifficulty;
    const matchesLocation = selectedLocation === "all" || skill.teacher.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Browse Skills
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing skills from our community of learners and teachers
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input 
                placeholder="Search for skills, technologies, hobbies..." 
                className="pl-12 h-12 text-lg bg-background border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <div className="lg:w-64 space-y-6">
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h3>
                
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All categories</SelectItem>
                        {mockCategories.map(category => (
                          <SelectItem key={category.id} value={category.name.toLowerCase()}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="All locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All locations</SelectItem>
                        <SelectItem value="San Francisco">San Francisco, CA</SelectItem>
                        <SelectItem value="New York">New York, NY</SelectItem>
                        <SelectItem value="Austin">Austin, TX</SelectItem>
                        <SelectItem value="Los Angeles">Los Angeles, CA</SelectItem>
                        <SelectItem value="Seattle">Seattle, WA</SelectItem>
                        <SelectItem value="Denver">Denver, CO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedDifficulty("all");
                      setSelectedLocation("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Popular Categories */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="font-semibold mb-4">Popular Categories</h3>
                <div className="space-y-2">
                  {mockCategories.slice(0, 6).map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.name.toLowerCase())}
                      className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <span className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">
                    {filteredSkills.length} Skills Found
                  </h2>
                  <p className="text-muted-foreground">
                    {searchTerm && `Results for "${searchTerm}"`}
                    {selectedCategory !== "all" && ` in ${selectedCategory}`}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>

              {/* Skills Grid */}
              {filteredSkills.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSkills.map(skill => (
                    <SkillCard key={skill.id} skill={skill} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No skills found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or explore different categories
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedDifficulty("all");
                      setSelectedLocation("all");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Browse;
