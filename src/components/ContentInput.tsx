import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Linkedin, Twitter, Instagram, Sparkles, Send, AlertTriangle } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface ContentInputProps {
  onPublish: (content: string, platforms: string[]) => void;
  isProcessing: boolean;
}

const ContentInput = ({ onPublish, isProcessing }: ContentInputProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [publishCount, setPublishCount] = useState(0);
  const [lastPublishTime, setLastPublishTime] = useState<Date | null>(null);

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

  const validateContent = (text: string): string | null => {
    // Content length validation
    if (text.length === 0) {
      return 'Content cannot be empty';
    }
    if (text.length > 2000) {
      return 'Content exceeds maximum length of 2000 characters';
    }
    
    // Basic malicious content filtering
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(text))) {
      return 'Content contains potentially malicious code';
    }
    
    // Platform-specific validation
    if (selectedPlatforms.includes('twitter') && text.length > 280) {
      return 'Content is too long for Twitter (max 280 characters)';
    }
    
    return null;
  };

  const checkRateLimit = (): string | null => {
    const now = new Date();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
    
    if (lastPublishTime && (now.getTime() - lastPublishTime.getTime()) < oneHour) {
      if (publishCount >= 10) {
        return 'Rate limit exceeded. You can publish up to 10 posts per hour.';
      }
    } else {
      // Reset counter if more than an hour has passed
      setPublishCount(0);
    }
    
    return null;
  };

  const logContentPublish = async (content: string, platforms: string[]) => {
    if (!user) return;
    
    try {
      await supabase
        .from('content_logs')
        .insert({
          user_id: user.id,
          original_content: content,
          platforms: platforms,
          status: 'initiated'
        });
    } catch (error) {
      console.error('Failed to log content publish:', error);
    }
  };

  const handlePublish = async () => {
    setValidationError(null);
    
    // Validate content
    const contentError = validateContent(content);
    if (contentError) {
      setValidationError(contentError);
      return;
    }
    
    // Check rate limiting
    const rateLimitError = checkRateLimit();
    if (rateLimitError) {
      setValidationError(rateLimitError);
      return;
    }
    
    // Log the publish attempt
    await logContentPublish(content, selectedPlatforms);
    
    // Update rate limiting counters
    const now = new Date();
    if (!lastPublishTime || (now.getTime() - lastPublishTime.getTime()) >= 60 * 60 * 1000) {
      setPublishCount(1);
    } else {
      setPublishCount(prev => prev + 1);
    }
    setLastPublishTime(now);
    
    onPublish(content, selectedPlatforms);
  };

  const canPublish = content.trim().length > 0 && selectedPlatforms.length > 0 && !isProcessing;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 mb-12">
      <Card className="glass-card p-10 prism-light-effect hover-lift">
        <div className="space-y-8">
          {/* Content Input */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center animate-pulse-glow">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Create Your Content</h2>
            </div>
            <div className="relative group">
              <Textarea
                placeholder="Enter your original content here... The AI will intelligently adapt it for each platform while maintaining your voice and message."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setValidationError(null);
                }}
                className="min-h-40 glass text-lg resize-none border-white/20 focus:border-accent/60 focus:ring-2 focus:ring-accent/20 transition-all duration-300 group-hover:border-white/30"
                disabled={isProcessing}
                maxLength={2000}
              />
              <div className="absolute bottom-4 right-4 text-sm text-muted-foreground bg-black/30 rounded-lg px-2 py-1">
                {content.length}/2000 characters
              </div>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/5 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>

          {/* Platform Selection */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Select Target Platforms</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      <h4 className="font-medium text-foreground">{platform.name}</h4>
                      <p className="text-xs text-muted-foreground">{platform.description}</p>
                    </div>
                    {selectedPlatforms.includes(platform.id) && (
                      <Badge variant="secondary" className="bg-white/20 text-foreground">
                        Selected
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <Alert variant="destructive" className="glass border-red-500/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

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