import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Upload, Video, FileText, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CreateSkillDialog = ({ onSkillCreated }: { onSkillCreated?: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skill_type: "offered",
    level: "",
    duration_hours: "",
    duration_description: "",
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [materialFiles, setMaterialFiles] = useState<File[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to create a skill");
        return;
      }

      let videoUrl = null;
      let certificateUrls: string[] = [];
      let materialUrls: string[] = [];

      // Upload video if provided
      if (videoFile) {
        const videoPath = `${user.id}/${Date.now()}_${videoFile.name}`;
        const { error: videoError } = await supabase.storage
          .from('skill-videos')
          .upload(videoPath, videoFile);

        if (videoError) throw videoError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('skill-videos')
          .getPublicUrl(videoPath);
        videoUrl = publicUrl;
      }

      // Upload certificates
      for (const file of certificateFiles) {
        const certPath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: certError } = await supabase.storage
          .from('skill-certificates')
          .upload(certPath, file);

        if (certError) throw certError;

        const { data: { publicUrl } } = supabase.storage
          .from('skill-certificates')
          .getPublicUrl(certPath);
        certificateUrls.push(publicUrl);
      }

      // Upload materials
      for (const file of materialFiles) {
        const matPath = `${user.id}/${Date.now()}_${file.name}`;
        const { error: matError } = await supabase.storage
          .from('skill-materials')
          .upload(matPath, file);

        if (matError) throw matError;

        const { data: { publicUrl } } = supabase.storage
          .from('skill-materials')
          .getPublicUrl(matPath);
        materialUrls.push(publicUrl);
      }

      // Create skill
      const { error: skillError } = await supabase
        .from('skills')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          skill_type: formData.skill_type,
          level: formData.level,
          tags: formData.tags,
          duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
          duration_description: formData.duration_description,
          video_url: videoUrl,
          certificate_urls: certificateUrls,
          material_urls: materialUrls,
          is_verified: !!(videoUrl || certificateUrls.length > 0),
        });

      if (skillError) throw skillError;

      toast.success("Skill created successfully!");
      setOpen(false);
      onSkillCreated?.();
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        skill_type: "offered",
        level: "",
        duration_hours: "",
        duration_description: "",
        tags: [],
      });
      setVideoFile(null);
      setCertificateFiles([]);
      setMaterialFiles([]);
    } catch (error: any) {
      console.error("Error creating skill:", error);
      toast.error(error.message || "Failed to create skill");
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Skill
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Skill</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Skill Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Guitar Lessons for Beginners"
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="Describe what you'll teach and what students will learn..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">💻 Technology</SelectItem>
                  <SelectItem value="Music">🎵 Music</SelectItem>
                  <SelectItem value="Languages">🗣️ Languages</SelectItem>
                  <SelectItem value="Art & Design">🎨 Art & Design</SelectItem>
                  <SelectItem value="Cooking">👨‍🍳 Cooking</SelectItem>
                  <SelectItem value="Sports & Fitness">⚽ Sports & Fitness</SelectItem>
                  <SelectItem value="Photography">📸 Photography</SelectItem>
                  <SelectItem value="Health & Wellness">🧘‍♀️ Health & Wellness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Skill Level *</Label>
              <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_hours">Duration (hours/week)</Label>
              <Input
                id="duration_hours"
                type="number"
                min="1"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                placeholder="e.g., 2"
              />
            </div>

            <div>
              <Label htmlFor="duration_description">Duration Description</Label>
              <Input
                id="duration_description"
                value={formData.duration_description}
                onChange={(e) => setFormData({ ...formData, duration_description: e.target.value })}
                placeholder="e.g., 2-3 hours/week"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags..."
              />
              <Button type="button" onClick={addTag} variant="outline">Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-sm">Verification Materials (Build Trust)</h3>
            
            <div>
              <Label htmlFor="video">Demo Video</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="video"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Video className="h-5 w-5 text-muted-foreground" />
              </div>
              {videoFile && <p className="text-xs text-muted-foreground mt-1">Selected: {videoFile.name}</p>}
            </div>

            <div>
              <Label htmlFor="certificates">Certificates/Credentials</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="certificates"
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={(e) => setCertificateFiles(Array.from(e.target.files || []))}
                  className="flex-1"
                />
                <Award className="h-5 w-5 text-muted-foreground" />
              </div>
              {certificateFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {certificateFiles.length} file(s) selected
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="materials">Additional Materials</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="materials"
                  type="file"
                  accept="image/*,application/pdf"
                  multiple
                  onChange={(e) => setMaterialFiles(Array.from(e.target.files || []))}
                  className="flex-1"
                />
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              {materialFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {materialFiles.length} file(s) selected
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Skill"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};