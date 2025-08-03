import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Monitor, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  Linkedin, 
  Twitter, 
  Instagram,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

interface StreamData {
  platform: string;
  progress: number;
  status: 'idle' | 'starting' | 'active' | 'completed' | 'error';
  currentAction: string;
  videoFrame?: string;
}

interface LiveStreamViewerProps {
  isActive: boolean;
  selectedPlatforms: string[];
}

const LiveStreamViewer = ({ isActive, selectedPlatforms }: LiveStreamViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamData, setStreamData] = useState<Record<string, StreamData>>({});
  const [overallProgress, setOverallProgress] = useState(0);

  const platformIcons = {
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram
  };

  const platformColors = {
    linkedin: "text-blue-400",
    twitter: "text-sky-400", 
    instagram: "text-pink-400"
  };

  // Initialize stream data for selected platforms
  useEffect(() => {
    if (isActive) {
      const initialData: Record<string, StreamData> = {};
      selectedPlatforms.forEach(platform => {
        initialData[platform] = {
          platform,
          progress: 0,
          status: 'starting',
          currentAction: 'Initializing...'
        };
      });
      setStreamData(initialData);
      
      // Simulate streaming progress
      simulateStreaming(initialData);
    }
  }, [isActive, selectedPlatforms]);

  const simulateStreaming = (initialData: Record<string, StreamData>) => {
    const platforms = Object.keys(initialData);
    let completedCount = 0;

    platforms.forEach((platform, index) => {
      // Simulate realistic publishing steps
      const steps = [
        'Opening browser...',
        'Navigating to platform...',
        'Logging in...',
        'Creating new post...',
        'Adapting content...',
        'Adding hashtags...',
        'Uploading media...',
        'Reviewing post...',
        'Publishing...',
        'Confirming success...'
      ];

      let currentStep = 0;
      const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
          setStreamData(prev => ({
            ...prev,
            [platform]: {
              ...prev[platform],
              progress: ((currentStep + 1) / steps.length) * 100,
              status: currentStep === steps.length - 1 ? 'completed' : 'active',
              currentAction: steps[currentStep]
            }
          }));

          if (currentStep === steps.length - 1) {
            completedCount++;
            if (completedCount === platforms.length) {
              setOverallProgress(100);
            } else {
              setOverallProgress((completedCount / platforms.length) * 100);
            }
            clearInterval(stepInterval);
          }
          currentStep++;
        }
      }, 1000 + Math.random() * 1000); // Vary timing for realism
    });
  };

  if (!isActive) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-16">
      <Card className={`stream-container hover-elevate prism-nexus ${isFullscreen ? 'fixed inset-6 z-50' : ''}`}>
        {/* Revolutionary Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-cosmic rounded-2xl flex items-center justify-center animate-aurora">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold text-gradient-aurora">Neural AI Agent Live Stream</h2>
              <p className="text-lg text-muted-foreground">
                Witness the future of artificial intelligence in motion
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 px-4 py-2 text-base backdrop-aurora">
              <Zap className="w-4 h-4 mr-2 animate-pulse" />
              Neural Active
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-muted-foreground hover:text-white hover-elevate bg-white/10 rounded-2xl px-4 py-2"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Ultra-Premium Progress Display */}
        <div className="mb-10 space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-cosmic">Neural Processing Progress</span>
            <span className="text-aurora">{Math.round(overallProgress)}%</span>
          </div>
          <div className="relative">
            <Progress value={overallProgress} className="h-4 bg-black/30 rounded-full overflow-hidden" />
            <div className="absolute inset-0 bg-aurora opacity-20 rounded-full animate-aurora pointer-events-none"></div>
          </div>
        </div>

        {/* Revolutionary Platform Streams Grid */}
        <div className={`grid gap-8 ${selectedPlatforms.length === 1 ? 'grid-cols-1' : 
          selectedPlatforms.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 
          'grid-cols-1 lg:grid-cols-3'}`}>
          {selectedPlatforms.map((platform) => {
            const data = streamData[platform];
            const PlatformIcon = platformIcons[platform as keyof typeof platformIcons];
            const colorClass = platformColors[platform as keyof typeof platformColors];
            
            return (
              <div key={platform} className="space-y-6 group">
                {/* Premium Platform Header */}
                <div className="flex items-center justify-between p-4 glass rounded-2xl hover-elevate">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-aurora rounded-xl flex items-center justify-center animate-aurora">
                      <PlatformIcon className={`w-6 h-6 ${colorClass}`} />
                    </div>
                    <span className="font-bold text-xl capitalize text-gradient-aurora">{platform}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {data?.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400 animate-pulse" />
                    ) : (
                      <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                    )}
                    <span className="text-sm font-semibold">
                      {data?.status === 'completed' ? 'Neural Complete' : 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Ultra-Advanced Stream Window */}
                <div className="stream-window aspect-video bg-black/60 flex items-center justify-center relative group-hover:scale-[1.02] transition-all duration-500">
                  {data?.videoFrame ? (
                    <img 
                      src={data.videoFrame} 
                      alt={`${platform} neural stream`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-4">
                      <Monitor className="w-20 h-20 text-muted-foreground mx-auto animate-cosmic-float" />
                      <p className="text-lg text-muted-foreground font-medium">
                        Neural streaming {platform} automation...
                      </p>
                      <div className="flex space-x-2 justify-center">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-aurora animate-aurora" style={{ animationDelay: `${i * 0.2}s` }}></div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Advanced Status Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-4 backdrop-blur-xl">
                    <div className="flex items-center justify-between text-base">
                      <span className="text-white font-medium">{data?.currentAction}</span>
                      <span className="text-aurora font-bold">{Math.round(data?.progress || 0)}%</span>
                    </div>
                    <div className="relative mt-2">
                      <Progress 
                        value={data?.progress || 0} 
                        className="h-2 bg-black/50" 
                      />
                      <div className="absolute inset-0 bg-aurora opacity-30 rounded-full animate-aurora pointer-events-none"></div>
                    </div>
                  </div>
                  
                  {/* Neural activity indicator */}
                  <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-emerald-400 animate-pulse"></div>
                </div>

                {/* Premium Platform Status */}
                <div className="glass rounded-2xl p-4 hover-elevate">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-semibold">Neural Status:</span>
                    <Badge 
                      variant={data?.status === 'completed' ? 'default' : 'secondary'}
                      className={`px-4 py-2 text-sm font-bold ${
                        data?.status === 'completed' 
                          ? 'bg-emerald-500/20 text-emerald-400 animate-pulse' 
                          : 'bg-amber-500/20 text-amber-400 animate-aurora'
                      }`}
                    >
                      {data?.status === 'completed' ? '✓ Neural Published' : '⚡ Processing'}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Revolutionary Live Controls */}
        <div className="flex justify-center mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-white hover-elevate bg-white/10 rounded-2xl px-6 py-3">
              <Play className="w-5 h-5 mr-3" />
              Neural Resume
            </Button>
            <Button variant="ghost" size="lg" className="text-muted-foreground hover:text-white hover-elevate bg-white/10 rounded-2xl px-6 py-3">
              <Pause className="w-5 h-5 mr-3" />
              Neural Pause
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LiveStreamViewer;