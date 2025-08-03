import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  ExternalLink, 
  Sparkles, 
  Copy, 
  RotateCcw,
  Linkedin, 
  Twitter, 
  Instagram,
  TrendingUp,
  Clock,
  Hash
} from "lucide-react";
import { useState } from "react";

interface PlatformResult {
  platform: string;
  adaptedContent: string;
  hashtags: string[];
  publishStatus: 'success' | 'failed';
  postUrl: string;
  aiInsights: string;
  stepsTaken: number;
  errorCount: number;
}

interface PublishResultsProps {
  isVisible: boolean;
  originalContent: string;
  results: PlatformResult[];
  totalTime: string;
  onNewPublish: () => void;
}

const PublishResults = ({ 
  isVisible, 
  originalContent, 
  results, 
  totalTime, 
  onNewPublish 
}: PublishResultsProps) => {
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const platformIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram
  };

  const platformColors = {
    linkedin: "border-blue-400 bg-blue-400/10",
    twitter: "border-sky-400 bg-sky-400/10",
    instagram: "border-pink-400 bg-pink-400/10"
  };

  const copyToClipboard = async (text: string, platform: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const successCount = results.filter(r => r.publishStatus === 'success').length;

  if (!isVisible) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-8">
      <Card className="glass-card p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Prism Publishing Complete!
          </h2>
          <p className="text-muted-foreground text-lg">
            Successfully published to {successCount} of {results.length} platforms in {totalTime}
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass rounded-lg p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-400">{successCount}</div>
            <div className="text-sm text-muted-foreground">Successful Posts</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-accent">{totalTime}</div>
            <div className="text-sm text-muted-foreground">Total Time</div>
          </div>
          <div className="glass rounded-lg p-4 text-center">
            <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-400">
              {results.reduce((sum, r) => sum + r.stepsTaken, 0)}
            </div>
            <div className="text-sm text-muted-foreground">AI Steps Executed</div>
          </div>
        </div>

        {/* Original vs Adapted Content */}
        <div className="space-y-6">
          {/* Original Content */}
          <div className="glass rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-accent" />
              Original Content
            </h3>
            <p className="text-muted-foreground leading-relaxed">{originalContent}</p>
          </div>

          {/* Platform Results */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Platform-Optimized Results</h3>
            
            {results.map((result) => {
              const PlatformIcon = platformIcons[result.platform as keyof typeof platformIcons];
              const colorClass = platformColors[result.platform as keyof typeof platformColors];
              
              return (
                <Card key={result.platform} className={`glass-card border-2 ${colorClass}`}>
                  <div className="p-6">
                    {/* Platform Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <PlatformIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold capitalize text-lg text-foreground">{result.platform}</h4>
                          <Badge 
                            variant={result.publishStatus === 'success' ? 'default' : 'destructive'}
                            className={result.publishStatus === 'success' ? 'bg-green-500/20 text-green-400' : ''}
                          >
                            {result.publishStatus === 'success' ? 'Published' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(result.adaptedContent, result.platform)}
                          className="text-muted-foreground hover:text-white"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          {copiedPlatform === result.platform ? 'Copied!' : 'Copy'}
                        </Button>
                        {result.publishStatus === 'success' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(result.postUrl, '_blank')}
                            className="text-muted-foreground hover:text-white"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Post
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Adapted Content */}
                    <div className="space-y-4">
                      <div className="glass rounded-lg p-4">
                        <h5 className="font-medium mb-2 text-foreground">Optimized Content</h5>
                        <p className="text-muted-foreground leading-relaxed">
                          {result.adaptedContent}
                        </p>
                      </div>

                      {/* Hashtags */}
                      {result.hashtags.length > 0 && (
                        <div className="glass rounded-lg p-4">
                          <h5 className="font-medium mb-2 flex items-center text-foreground">
                            <Hash className="w-4 h-4 mr-1" />
                            Hashtags
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {result.hashtags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="bg-white/10">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Insights */}
                      <div className="glass rounded-lg p-4">
                        <h5 className="font-medium mb-2 flex items-center text-foreground">
                          <Sparkles className="w-4 h-4 mr-1 text-purple-400" />
                          AI Optimization Insights
                        </h5>
                        <p className="text-sm text-muted-foreground">{result.aiInsights}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8 pt-6 border-t border-white/10">
          <Button
            onClick={onNewPublish}
            className="btn-prism px-8 py-3"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Create New Post
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PublishResults;