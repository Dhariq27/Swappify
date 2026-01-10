import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile, Image, Video, File } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
}

const ChatInput = ({ message, setMessage, onSendMessage }: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (type: 'image' | 'video' | 'file') => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 
        type === 'image' ? 'image/*' : 
        type === 'video' ? 'video/*' : 
        '*/*';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`Selected ${files[0].name}`);
      // In a real app, upload the file here
    }
  };

  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFileSelect('image')}>
              <Image className="h-4 w-4 mr-2" />
              Images
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileSelect('video')}>
              <Video className="h-4 w-4 mr-2" />
              Videos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileSelect('file')}>
              <File className="h-4 w-4 mr-2" />
              Files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex-1 relative">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            className="pr-10"
          />
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2"
            onClick={() => toast.success("Emoji picker coming soon!")}
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          onClick={onSendMessage}
          disabled={!message.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
