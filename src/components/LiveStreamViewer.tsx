import { useState, useEffect, useRef } from "react";
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
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from "@/config/api";

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
  const [sessionId, setSessionId] = useState<string>('');
  const [actionLog, setActionLog] = useState<Array<{id: string, message: string, type: string, timestamp: string}>>([]);
  const socketRef = useRef<Socket | null>(null);

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

  // Initialize WebSocket connection for real-time streaming
  useEffect(() => {
    if (isActive && selectedPlatforms.length > 0) {
      // Generate unique session ID
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      
      // Initialize stream data for selected platforms
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
      
      // Connect to WebSocket server
      const socket = io(API_CONFIG.websocketURL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        timeout: 20000,  // Longer timeout for Render cold starts
        reconnection: true,
        reconnectionAttempts: 3
      });
      
      socketRef.current = socket;
      
      // Join the specific streaming session
      socket.emit('join_stream', { session_id: newSessionId });
      
      // Listen for connection events
      socket.on('connect', () => {
        console.log('Connected to PostPrism real-time streaming');
        addToActionLog('Connected to live streaming server', 'info');
      });
      
      socket.on('joined_stream', (data) => {
        console.log('Joined streaming session:', data.session_id);
        addToActionLog(`Joined streaming session ${data.session_id}`, 'info');
      });
      
      // Listen for publishing events
      socket.on('publish_started', (data) => {
        console.log('Publishing started:', data);
        addToActionLog('AI content adaptation started...', 'info');
      });
      
      socket.on('adaptation_complete', (data) => {
        console.log('Adaptation complete:', data);
        addToActionLog('AI content adaptation complete. Starting AgentS2 automation...', 'info');
      });
      
      // Listen for platform events
      socket.on('platform_started', (data) => {
        console.log('Platform started:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            status: 'active',
            currentAction: `Starting ${data.platform} automation...`
          }
        }));
        addToActionLog(`Started ${data.platform} automation`, 'info');
      });
      
      socket.on('platform_completed', (data) => {
        console.log('Platform completed:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            status: 'completed',
            progress: 100,
            currentAction: 'Publishing completed!'
          }
        }));
        addToActionLog(`✅ ${data.platform} publishing completed`, 'success');
        updateOverallProgress();
      });
      
      // Listen for video frames
      socket.on('video_frame', (data) => {
        console.log('Received video frame for:', data.platform);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            videoFrame: data.data
          }
        }));
      });
      
      // Listen for agent actions
      socket.on('agent_action', (data) => {
        console.log('Agent action:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            currentAction: data.action
          }
        }));
        addToActionLog(`${data.platform}: ${data.action}`, 'action');
      });
      
      socket.on('agent_thinking', (data) => {
        console.log('Agent thinking:', data);
        addToActionLog(`${data.platform}: 💭 ${data.thinking}`, 'thinking');
      });
      
      socket.on('agent_success', (data) => {
        console.log('Agent success:', data);
        addToActionLog(`✅ ${data.platform}: ${data.message}`, 'success');
      });
      
      socket.on('agent_error', (data) => {
        console.log('Agent error:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            status: 'error',
            currentAction: `Error: ${data.error}`
          }
        }));
        addToActionLog(`❌ ${data.platform}: ${data.error}`, 'error');
      });
      
      // Listen for completion
      socket.on('all_platforms_completed', (data) => {
        console.log('All platforms completed:', data);
        addToActionLog('🎉 All platforms completed successfully!', 'success');
        setOverallProgress(100);
      });
      
      // Listen for errors
      socket.on('error_occurred', (data) => {
        console.log('Error occurred:', data);
        addToActionLog(`❌ Error: ${data.error}`, 'error');
      });
      
      socket.on('disconnect', () => {
        console.log('Disconnected from streaming server');
        addToActionLog('Disconnected from streaming server', 'info');
      });
      
      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.emit('leave_stream', { session_id: newSessionId });
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [isActive, selectedPlatforms]);
  
  const addToActionLog = (message: string, type: string) => {
    setActionLog(prev => [...prev, {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };
  
  const updateOverallProgress = () => {
    // Calculate overall progress based on completed platforms
    const platforms = Object.values(streamData);
    const completedCount = platforms.filter(p => p.status === 'completed').length;
    const totalCount = platforms.length;
    
    if (totalCount > 0) {
      setOverallProgress((completedCount / totalCount) * 100);
    }
  };

  if (!isActive) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-12">
      <Card className={`stream-container hover-lift ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
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
                      src={`data:image/png;base64,${data.videoFrame}`} 
                      alt={`${platform} stream`}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : (
                    <div className="text-center space-y-2">
                      <Monitor className="w-12 h-12 text-muted-foreground mx-auto animate-pulse" />
                      <p className="text-sm text-muted-foreground">
                        {data?.status === 'active' ? `Streaming ${platform} automation...` : `Waiting for ${platform} stream...`}
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

        {/* Action Log */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-4">Live Action Log</h3>
          <div className="glass rounded-lg p-4 max-h-64 overflow-y-auto">
            {actionLog.length > 0 ? (
              <div className="space-y-2">
                {actionLog.slice(-10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between text-sm">
                    <span className={`flex-1 ${
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'thinking' ? 'text-purple-400' :
                      log.type === 'action' ? 'text-blue-400' :
                      'text-white'
                    }`}>
                      {log.message}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center">Waiting for automation to start...</p>
            )}
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex justify-center mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              <Zap className="w-3 h-3 mr-1" />
              Session: {sessionId.split('_')[1] || 'Connecting...'}
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LiveStreamViewer;