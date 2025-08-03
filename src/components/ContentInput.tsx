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
    <div className="w-full max-w-6xl mx-auto px-6 mb-16">
      <Card className="glass-card p-14 prism-nexus hover-elevate">
        <div className="space-y-10">
          {/* Revolutionary Content Input */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-aurora rounded-2xl flex items-center justify-center animate-aurora">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gradient-aurora">Create Your Content</h2>
            </div>
            <div className="relative group">
              <Textarea
                placeholder="Enter your visionary content here... Our AI will intelligently refract it across platforms, optimizing engagement while preserving your unique voice and message authenticity."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-48 glass text-xl resize-none border-white/30 focus:border-accent/80 focus:ring-4 focus:ring-accent/30 transition-all duration-500 group-hover:border-white/40 backdrop-aurora"
                disabled={isProcessing}
              />
              <div className="absolute bottom-6 right-6 text-base text-muted-foreground bg-black/50 rounded-2xl px-4 py-2 backdrop-blur-xl">
                {content.length} characters
              </div>
              <div className="absolute inset-0 rounded-2xl bg-aurora opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-aurora opacity-0 group-focus-within:opacity-60 transition-opacity duration-300 rounded-t-2xl"></div>
            </div>
          </div>

          {/* Ultra-Premium Platform Selection */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-cosmic bg-clip-text text-transparent">Select Target Platforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  onClick={() => !isProcessing && togglePlatform(platform.id)}
                  className={`
                    relative p-8 rounded-3xl border-2 cursor-pointer transition-all duration-700 hover-elevate group
                    ${selectedPlatforms.includes(platform.id) 
                      ? `platform-${platform.color} bg-white/8 backdrop-aurora` 
                      : 'border-white/20 hover:border-white/50 glass group-hover:bg-white/5'
                    }
                    ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                      ${selectedPlatforms.includes(platform.id) 
                        ? 'bg-white/25 animate-aurora' 
                        : 'bg-white/15 group-hover:bg-white/20'
                      }
                    `}>
                      <platform.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{platform.name}</h4>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </div>
                    {selectedPlatforms.includes(platform.id) && (
                      <Badge variant="secondary" className="bg-white/20 text-white backdrop-blur-xl animate-aurora">
                        ✓ Selected
                      </Badge>
                    )}
                  </div>
                  
                  {/* Selection glow effect */}
                  {selectedPlatforms.includes(platform.id) && (
                    <div className="absolute inset-0 rounded-3xl bg-aurora opacity-10 animate-aurora pointer-events-none"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Revolutionary Publish Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handlePublish}
              disabled={!canPublish}
              className={`
                btn-aurora px-16 py-8 text-xl font-black rounded-3xl
                ${!canPublish ? 'opacity-50 cursor-not-allowed' : 'hover-elevate'}
              `}
            >
              <Send className="w-6 h-6 mr-4" />
              {isProcessing ? 'Neural Processing...' : 'Initiate Prismatic Publishing'}
            </Button>
          </div>

          {/* Premium Status Display */}
          {selectedPlatforms.length > 0 && (
            <div className="glass rounded-2xl p-6 border border-aurora/40 bg-aurora/5 backdrop-aurora">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-aurora animate-aurora"></div>
                <p className="text-lg text-center text-cosmic font-semibold">
                  Ready to refract across {selectedPlatforms.length} dimension{selectedPlatforms.length > 1 ? 's' : ''}. 
                  <span className="block text-sm text-muted-foreground mt-1">
                    Experience the future of AI automation in real-time.
                  </span>
                </p>
                <div className="w-3 h-3 rounded-full bg-cosmic animate-cosmic-drift"></div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ContentInput;