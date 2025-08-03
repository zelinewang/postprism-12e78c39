import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Linkedin, Twitter, Instagram, Sparkles, Send } from "lucide-react";

interface ContentInputProps {
  onPublish: (content: string, platforms: string[]) => void;
  isProcessing: boolean;
}

const ContentInput = ({ onPublish, isProcessing }: ContentInputProps) => {
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const platforms = [
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "linkedin",
      description: "Professional networking"
    },
    {
      id: "twitter", 
      name: "Twitter",
      icon: Twitter,
      color: "twitter",
      description: "Social microblogging"
    },
    {
      id: "instagram",
      name: "Instagram", 
      icon: Instagram,
      color: "instagram",
      description: "Visual storytelling"
    }
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = () => {
    if (content.trim() && selectedPlatforms.length > 0) {
      onPublish(content, selectedPlatforms);
    }
  };

  const canPublish = content.trim().length > 0 && selectedPlatforms.length > 0 && !isProcessing;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-8">
      <Card className="glass-card p-8">
        <div className="space-y-6">
          {/* Content Input */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-semibold">Create Your Content</h2>
            </div>
            <div className="relative">
              <Textarea
                placeholder="Enter your original content here... The AI will intelligently adapt it for each platform while maintaining your voice and message."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-32 glass text-base resize-none border-white/20 focus:border-accent/50 transition-colors"
                disabled={isProcessing}
              />
              <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                {content.length} characters
              </div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Target Platforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  onClick={() => !isProcessing && togglePlatform(platform.id)}
                  className={`
                    relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover-lift
                    ${selectedPlatforms.includes(platform.id) 
                      ? `platform-${platform.color} bg-white/5` 
                      : 'border-white/20 hover:border-white/40 glass'
                    }
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${selectedPlatforms.includes(platform.id) ? 'bg-white/20' : 'bg-white/10'}
                    `}>
                      <platform.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{platform.name}</h4>
                      <p className="text-xs text-muted-foreground">{platform.description}</p>
                    </div>
                    {selectedPlatforms.includes(platform.id) && (
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Publish Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handlePublish}
              disabled={!canPublish}
              className={`
                btn-prism px-12 py-4 text-lg font-semibold
                ${!canPublish ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <Send className="w-5 h-5 mr-3" />
              {isProcessing ? 'Processing...' : 'Start Prism Publishing'}
            </Button>
          </div>

          {/* Instructions */}
          {selectedPlatforms.length > 0 && (
            <div className="glass rounded-lg p-4 border border-accent/30">
              <p className="text-sm text-center text-accent">
                Ready to refract your content across {selectedPlatforms.length} platform{selectedPlatforms.length > 1 ? 's' : ''}. 
                Watch the AI agent work in real-time!
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ContentInput;