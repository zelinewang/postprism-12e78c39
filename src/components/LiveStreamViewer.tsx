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
    <div className="w-full max-w-7xl mx-auto px-6 mb-8">
      <Card className={`stream-container ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-prism rounded-lg flex items-center justify-center animate-pulse-glow">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">AI Agent Live Stream</h2>
              <p className="text-sm text-muted-foreground">
                Watch the AI publish your content in real-time
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              <Zap className="w-3 h-3 mr-1" />
              Live
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-muted-foreground hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Platform Streams Grid */}
        <div className={`grid gap-6 ${selectedPlatforms.length === 1 ? 'grid-cols-1' : 
          selectedPlatforms.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 
          'grid-cols-1 lg:grid-cols-3'}`}>
          {selectedPlatforms.map((platform) => {
            const data = streamData[platform];
            const PlatformIcon = platformIcons[platform as keyof typeof platformIcons];
            const colorClass = platformColors[platform as keyof typeof platformColors];
            
            return (
              <div key={platform} className="space-y-4">
                {/* Platform Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <PlatformIcon className={`w-5 h-5 ${colorClass}`} />
                    <span className="font-medium capitalize">{platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {data?.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-xs">
                      {data?.status === 'completed' ? 'Complete' : 'Publishing'}
                    </span>
                  </div>
                </div>

                {/* Stream Window */}
                <div className="stream-window aspect-video bg-black/50 flex items-center justify-center relative">
                  {data?.videoFrame ? (
                    <img 
                      src={data.videoFrame} 
                      alt={`${platform} stream`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <Monitor className="w-12 h-12 text-muted-foreground mx-auto animate-pulse" />
                      <p className="text-sm text-muted-foreground">
                        Streaming {platform} automation...
                      </p>
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white">{data?.currentAction}</span>
                      <span className="text-accent">{Math.round(data?.progress || 0)}%</span>
                    </div>
                    <Progress 
                      value={data?.progress || 0} 
                      className="h-1 mt-2" 
                    />
                  </div>
                </div>

                {/* Platform Status */}
                <div className="glass rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Status:</span>
                    <Badge 
                      variant={data?.status === 'completed' ? 'default' : 'secondary'}
                      className={
                        data?.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-400'
                      }
                    >
                      {data?.status === 'completed' ? 'Published' : 'In Progress'}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Controls */}
        <div className="flex justify-center mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Play className="w-4 h-4 mr-2" />
              Resume
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LiveStreamViewer;