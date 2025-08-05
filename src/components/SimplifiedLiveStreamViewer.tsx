import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Monitor, 
  Maximize2, 
  Minimize2,
  CheckCircle,
  Clock,
  Zap,
  Linkedin,
  Twitter,
  Instagram
} from "lucide-react";
import { io, Socket } from 'socket.io-client';
import { API_CONFIG, DEMO_MODE, DEMO_CONFIG } from "@/config/api";
import { secureDemoService, DemoProgress, isDemoModeRecommended } from "@/services/demoService";

interface SimplifiedStreamData {
  platform: string;
  progress: number;
  status: 'idle' | 'active' | 'completed' | 'error';
  currentAction: string;
  videoFrame?: string;
}

interface SimplifiedLiveStreamViewerProps {
  isActive: boolean;
  selectedPlatforms: string[];
  sessionId?: string;
  onWorkflowCompleted?: (results?: any) => void;
}

const SimplifiedLiveStreamViewer = ({ isActive, selectedPlatforms, sessionId: externalSessionId, onWorkflowCompleted }: SimplifiedLiveStreamViewerProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamData, setStreamData] = useState<Record<string, SimplifiedStreamData>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [sessionId, setSessionId] = useState<string>(externalSessionId || '');
  const [actionLog, setActionLog] = useState<Array<{id: string, message: string, type: string, timestamp: string}>>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const socketRef = useRef<Socket | null>(null);

  // Platform icons and colors
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

  // Update internal sessionId when external sessionId changes
  useEffect(() => {
    if (externalSessionId) {
      setSessionId(externalSessionId);
    }
  }, [externalSessionId]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isActive && selectedPlatforms.length > 0 && sessionId) {
      
      // Initialize stream data
      const initialData: Record<string, SimplifiedStreamData> = {};
      selectedPlatforms.forEach(platform => {
        initialData[platform] = {
          platform,
          progress: 0,
          status: 'idle',
          currentAction: 'Waiting to start...'
        };
      });
      setStreamData(initialData);
      
      if (DEMO_MODE || isDemoModeRecommended()) {
        // Enhanced secure demo mode with backend integration
        console.log('🎮 Starting secure demo mode...');
        setConnectionStatus('connected');
        addToActionLog('🎮 Safe Demo Mode: Simulating AI automation', 'info');
        
        // Set up demo service listeners
        const progressUnsubscribe = secureDemoService.onProgress((progress: DemoProgress) => {
          setStreamData(prev => ({
            ...prev,
            [progress.platform]: {
              ...prev[progress.platform],
              progress: (progress.step / progress.maxSteps) * 100,
              currentAction: progress.action,
              status: 'active'
            }
          }));
          
          addToActionLog(`${progress.platform}: ${progress.action}`, 'action');
          
          if (progress.thinking) {
            addToActionLog(`${progress.platform}: ${progress.thinking}`, 'thinking');
          }
          
          updateOverallProgress();
        });
        
        const resultsUnsubscribe = secureDemoService.onResults((results) => {
          console.log('📊 Secure demo results:', results);
          addToActionLog('🎉 All demo platforms completed successfully!', 'success');
          setOverallProgress(100);
          
          // Mark all platforms as completed
          results.forEach(result => {
            setStreamData(prev => ({
              ...prev,
              [result.platform]: {
                ...prev[result.platform],
                status: 'completed',
                progress: 100,
                currentAction: '✅ Publishing completed!'
              }
            }));
          });
          
          // Trigger completion callback
          setTimeout(() => {
            if (onWorkflowCompleted) {
              onWorkflowCompleted(results);
            }
          }, 1500);
        });
        
        // Cleanup function for demo subscriptions
        const cleanup = () => {
          progressUnsubscribe();
          resultsUnsubscribe();
        };
        
        // Store cleanup in ref for later use
        socketRef.current = { disconnect: cleanup } as any;
        
        return cleanup;
      }
      
      // Production mode - Connect to real WebSocket server
      console.log('🔌 Connecting to WebSocket server...');
      setConnectionStatus('connecting');
      
      const socket = io(API_CONFIG.websocketURL, {
        transports: ['websocket', 'polling'],  // Try WebSocket first, fallback to polling
        autoConnect: true,
        timeout: 20000,  // Longer timeout for Render cold starts
        reconnection: true,
        reconnectionAttempts: 3,
        forceNew: true
      });
      
      socketRef.current = socket;
      
      // Connection events
      socket.on('connect', () => {
        console.log('✅ Connected to PostPrism WebSocket server');
        setConnectionStatus('connected');
        addToActionLog('Connected to live streaming server', 'info');
        
        // Join the streaming session
        socket.emit('join_stream', { session_id: sessionId });
      });
      
      socket.on('connect_error', (error) => {
        console.error('❌ WebSocket connection error:', error);
        setConnectionStatus('disconnected');
        addToActionLog('Failed to connect to streaming server', 'error');
      });
      
      socket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from streaming server:', reason);
        setConnectionStatus('disconnected');
        addToActionLog('Disconnected from streaming server', 'info');
      });
      
      socket.on('joined_stream', (data) => {
        console.log('👥 Joined streaming session:', data.session_id);
        addToActionLog(`Joined streaming session ${data.session_id}`, 'info');
      });
      
      // Publishing events
      socket.on('publish_started', (data) => {
        console.log('🚀 Publishing started:', data);
        addToActionLog('Publishing started...', 'info');
      });
      
      // Platform events
      socket.on('platform_started', (data) => {
        console.log('📱 Platform started:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            status: 'active',
            currentAction: 'Starting automation...'
          }
        }));
        addToActionLog(`Started ${data.platform} automation`, 'info');
      });
      
      socket.on('platform_completed', (data) => {
        console.log('✅ Platform completed:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            status: 'completed',
            progress: 100,
            currentAction: 'Completed!'
          }
        }));
        addToActionLog(`✅ ${data.platform} completed`, 'success');
        updateOverallProgress();
      });
      
      // Video frames
      socket.on('video_frame', (data) => {
        console.log('📹 Received video frame for:', data.platform);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            videoFrame: data.data,
            currentAction: `Step ${data.step}: Processing...`
          }
        }));
      });
      
      // Enhanced agent actions with more frequent updates
      socket.on('agent_action', (data) => {
        console.log('🤖 Agent action:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            currentAction: data.action,
            status: data.status === 'executing' ? 'active' : prev[data.platform]?.status || 'active'
          }
        }));
        addToActionLog(`${data.platform}: ${data.action}`, 'action');
      });
      
      // Working Step-by-Step agent step events
      socket.on('agent_step', (data) => {
        console.log('📋 Agent step:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            currentAction: `Step ${data.step}/${data.total_steps}: ${data.description}`,
            progress: (data.step / data.total_steps) * 100,
            status: 'active'
          }
        }));
        addToActionLog(`${data.platform}: 📋 Step ${data.step}/${data.total_steps}: ${data.description}`, 'step');
      });
      
      // Agent started event for working step-by-step
      socket.on('agent_started', (data) => {
        console.log('🚀 Agent started:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            status: 'active',
            currentAction: data.message || 'Starting agent...',
            progress: 0
          }
        }));
        addToActionLog(`${data.platform}: 🚀 ${data.message || 'Agent started'}`, 'info');
      });
      
      // Agent completed event for working step-by-step
      socket.on('agent_completed', (data) => {
        console.log('✅ Agent completed:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            status: data.success ? 'completed' : 'error',
            progress: 100,
            currentAction: data.success ? 'Completed!' : 'Failed'
          }
        }));
        addToActionLog(`${data.platform}: ${data.success ? '✅' : '❌'} Completed (${data.steps_count} steps in ${data.total_time?.toFixed(1)}s)`, data.success ? 'success' : 'error');
        updateOverallProgress();
      });
      
      // Enhanced platform progress updates
      socket.on('platform_progress', (data) => {
        console.log('📊 Platform progress:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            progress: data.progress,
            currentAction: data.message,
            status: 'active'
          }
        }));
        updateOverallProgress();
      });
      
      // Enhanced agent thinking with intelligence metrics
      socket.on('agent_thinking', (data) => {
        console.log('💭 Agent thinking:', data);
        setStreamData(prev => ({
          ...prev,
          [data.platform]: {
            ...prev[data.platform],
            currentAction: data.thinking || data.analysis || 'Analyzing...',
            status: 'active'
          }
        }));
        
        // Enhanced thinking log with intelligence score if available
        const thinkingText = data.thinking || data.analysis || 'Agent thinking...';
        const scoreText = data.intelligence_score ? ` (Intelligence: ${data.intelligence_score})` : '';
        const timeText = data.decision_time ? ` [${data.decision_time}]` : '';
        
        addToActionLog(`${data.platform}: 💭 ${thinkingText}${scoreText}${timeText}`, 'thinking');
      });
      
      socket.on('agent_success', (data) => {
        console.log('🎉 Agent success:', data);
        addToActionLog(`✅ ${data.platform}: ${data.message}`, 'success');
      });
      
      socket.on('agent_error', (data) => {
        console.log('❌ Agent error:', data);
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
      
      // Enhanced completion handling - fix blank page issue
      socket.on('all_platforms_completed', (data) => {
        console.log('🎉 All platforms completed:', data);
        addToActionLog('🎉 All platforms completed successfully!', 'success');
        setOverallProgress(100);
        
        // Mark all platforms as completed
        setStreamData(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(platform => {
            updated[platform] = {
              ...updated[platform],
              status: 'completed',
              progress: 100,
              currentAction: '✅ Publishing completed!'
            };
          });
          return updated;
        });
        
        // Delay transition to ensure WebSocket events are processed
        setTimeout(() => {
          console.log('🎯 Triggering workflow completion callback with results...');
          console.log('📊 Results data:', data.results);
          
          // FIXED: Ensure results data is properly formatted
          if (onWorkflowCompleted) {
            onWorkflowCompleted(data.results || data);
          }
          
          // Clean up WebSocket connection AFTER callback
          setTimeout(() => {
            console.log('🧹 Cleaning up WebSocket after completion...');
            if (socketRef.current) {
              socketRef.current.emit('leave_stream', { session_id: sessionId });
              socketRef.current.disconnect();
              socketRef.current = null;
            }
            setConnectionStatus('disconnected');
          }, 1000); // Longer delay to ensure state transition
        }, 1500); // Allow UI to update before transition
      });
      
      // Cleanup on unmount
      return () => {
        if (socketRef.current) {
          console.log('🧹 Cleaning up WebSocket connection...');
          socketRef.current.emit('leave_stream', { session_id: sessionId });
          socketRef.current.disconnect();
          socketRef.current = null;
        }
      };
    }
  }, [isActive, selectedPlatforms, sessionId]);
  
  const addToActionLog = (message: string, type: string) => {
    setActionLog(prev => [...prev, {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };
  
  const updateOverallProgress = () => {
    const platforms = Object.values(streamData);
    const completedCount = platforms.filter(p => p.status === 'completed').length;
    const totalCount = platforms.length;
    
    if (totalCount > 0) {
      setOverallProgress((completedCount / totalCount) * 100);
    }
  };

  const simulateDemoPublishing = async () => {
    console.log('🎮 Starting enhanced demo publishing simulation...');
    addToActionLog(DEMO_CONFIG.demoMessages.welcome, 'info');
    
    // Initial AI analysis phase
    addToActionLog('🧠 AI initializing parallel publishing strategy...', 'info');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show some initial AI thinking
    for (let i = 0; i < 2; i++) {
      const thinkingMsg = DEMO_CONFIG.demoMessages.aiThinking[Math.floor(Math.random() * DEMO_CONFIG.demoMessages.aiThinking.length)];
      addToActionLog(thinkingMsg, 'thinking');
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    addToActionLog(DEMO_CONFIG.demoMessages.startPublishing, 'info');
    
    // Simulate parallel publishing (show all platforms starting simultaneously)
    selectedPlatforms.forEach(platform => {
      setStreamData(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          status: 'active',
          currentAction: `Initializing ${platform} agent...`
        }
      }));
    });
    
    // Enhanced simulation with realistic steps for each platform
    const platformSteps = {
      linkedin: [
        'Opening LinkedIn professional interface...',
        'AI detecting compose button position...',
        'Analyzing LinkedIn algorithm preferences...',
        'Composing professional content...',
        'Adding industry-relevant hashtags...',
        'Optimizing for LinkedIn engagement...',
        'Publishing to professional network...',
        'Verifying publication success...'
      ],
      twitter: [
        'Opening Twitter interface...',
        'AI analyzing tweet composition area...',
        'Optimizing for Twitter character limit...',
        'Composing viral-optimized content...',
        'Adding trending hashtags...',
        'Scheduling for optimal engagement...',
        'Publishing tweet...',
        'Verifying tweet visibility...'
      ],
      instagram: [
        'Opening Instagram interface...',
        'AI detecting story/feed options...',
        'Analyzing visual content requirements...',
        'Composing Instagram-optimized content...',
        'Adding discovery hashtags...',
        'Optimizing for Instagram algorithm...',
        'Publishing to feed...',
        'Verifying post publication...'
      ]
    };
    
    // Run platforms in parallel simulation
    const platformPromises = selectedPlatforms.map(async (platform, index) => {
      const steps = platformSteps[platform as keyof typeof platformSteps] || [
        'Opening platform...',
        'AI analyzing interface...',
        'Composing content...',
        'Publishing content...'
      ];
      
      // Add small stagger between platforms
      await new Promise(resolve => setTimeout(resolve, index * 300));
      
      for (let step = 0; step < steps.length; step++) {
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
        
        const progress = ((step + 1) / steps.length) * 100;
        setStreamData(prev => ({
          ...prev,
          [platform]: {
            ...prev[platform],
            progress,
            currentAction: steps[step]
          }
        }));
        
        addToActionLog(`${platform}: ${steps[step]}`, 'action');
        
        // Add AI thinking messages at strategic points
        if (step === 2) {
          const thinkingMsg = DEMO_CONFIG.demoMessages.aiThinking[Math.floor(Math.random() * DEMO_CONFIG.demoMessages.aiThinking.length)];
          addToActionLog(`${platform}: ${thinkingMsg}`, 'thinking');
        }
        
        if (step === 4) {
          const actionMsg = DEMO_CONFIG.demoMessages.agentActions[Math.floor(Math.random() * DEMO_CONFIG.demoMessages.agentActions.length)];
          addToActionLog(`${platform}: ${actionMsg}`, 'action');
        }
      }
      
      // Mark as completed
      setStreamData(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          status: 'completed',
          progress: 100,
          currentAction: 'Publishing completed!'
        }
      }));
      
      const result = DEMO_CONFIG.mockResults[platform as keyof typeof DEMO_CONFIG.mockResults];
      addToActionLog(`✅ ${platform}: Published successfully! Execution time: ${result.executionTime}s`, 'success');
      
      // Show AI insights
      setTimeout(() => {
        addToActionLog(`💡 ${platform}: ${result.aiInsights}`, 'info');
      }, 500);
      
      updateOverallProgress();
    });
    
    // Wait for all platforms to complete
    await Promise.all(platformPromises);
    
    // All platforms completed - show performance metrics
    addToActionLog('🎉 All demo platforms completed successfully!', 'success');
    addToActionLog(`📊 Performance Summary: ${DEMO_CONFIG.performanceMetrics.successRate} success rate`, 'info');
    addToActionLog(`⚡ Time Saved: ${DEMO_CONFIG.performanceMetrics.totalTimeSaved}`, 'info');
    addToActionLog(`📈 Total Reach: ${DEMO_CONFIG.performanceMetrics.platformReach}`, 'info');
    addToActionLog(`🚀 Engagement Boost: ${DEMO_CONFIG.performanceMetrics.engagementBoost}`, 'success');
    
    setOverallProgress(100);
    
    // Trigger completion callback after a short delay
    setTimeout(() => {
      if (onWorkflowCompleted) {
        const demoResults = selectedPlatforms.reduce((acc, platform) => {
          acc[platform] = {
            ...DEMO_CONFIG.mockResults[platform as keyof typeof DEMO_CONFIG.mockResults],
            success: true
          };
          return acc;
        }, {} as any);
        
        onWorkflowCompleted({ platforms: demoResults });
      }
    }, 2000);
  };

  if (!isActive) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-12">
      <Card className={`bg-white/10 backdrop-blur-lg border border-white/20 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">AI Agent Live Stream</h2>
              <p className="text-sm text-white/70">
                Watch Agent S2.5 publish your content in real-time
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              variant="secondary" 
              className={`${
                connectionStatus === 'connected' 
                  ? 'bg-green-500/20 text-green-400' 
                  : connectionStatus === 'connecting'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              <Zap className="w-3 h-3 mr-1" />
              {connectionStatus === 'connected' ? 'Live' : connectionStatus === 'connecting' ? 'Connecting' : 'Disconnected'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white/70 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="p-6 space-y-4">
          <div className="flex justify-between text-sm text-white">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-2 bg-white/10" 
          />
        </div>

        {/* Platform Streams */}
        <div className={`grid gap-6 p-6 ${
          selectedPlatforms.length === 1 ? 'grid-cols-1' : 
          selectedPlatforms.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 
          'grid-cols-1 lg:grid-cols-3'
        }`}>
          {selectedPlatforms.map((platform) => {
            const data = streamData[platform];
            const PlatformIcon = platformIcons[platform as keyof typeof platformIcons];
            const colorClass = platformColors[platform as keyof typeof platformColors];
            
            return (
              <div key={platform} className="space-y-4">
                {/* Platform Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {PlatformIcon && <PlatformIcon className={`w-5 h-5 ${colorClass}`} />}
                    <span className="font-medium capitalize text-white">{platform}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {data?.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-400" />
                    )}
                    <span className="text-xs text-white/70">
                      {data?.status === 'completed' ? 'Complete' : 'Processing'}
                    </span>
                  </div>
                </div>

                {/* Stream Window */}
                <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center relative overflow-hidden border border-white/10">
                  {data?.videoFrame ? (
                    <>
                      <img 
                        src={`data:image/png;base64,${data.videoFrame}`} 
                        alt={`${platform} stream`}
                        className="w-full h-full object-cover"
                      />
                      {/* Live indicator */}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-red-500/90 text-white animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                          LIVE
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-3">
                      {PlatformIcon ? (
                        <PlatformIcon className={`w-16 h-16 mx-auto animate-pulse ${colorClass}`} />
                      ) : (
                        <Monitor className="w-16 h-16 text-white/50 mx-auto animate-pulse" />
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-white/70 font-medium">
                          {data?.status === 'active' ? `Agent operating on ${platform}` : `Preparing ${platform}`}
                        </p>
                        <p className="text-xs text-white/50">
                          {connectionStatus === 'connected' ? 'Connected - waiting for stream...' : 'Connecting...'}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Status Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-white font-medium">
                        {data?.currentAction || 'Waiting for Agent...'}
                      </div>
                      <div className="text-xs text-white/70">
                        {Math.round(data?.progress || 0)}%
                      </div>
                    </div>
                    <Progress 
                      value={data?.progress || 0} 
                      className="h-1.5 bg-white/20"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Log */}
        <div className="p-6 border-t border-white/10">
          <h3 className="text-lg font-semibold mb-4 text-white">Live Action Log</h3>
          <div className="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto">
            {actionLog.length > 0 ? (
              <div className="space-y-2">
                {actionLog.slice(-10).map((log, index) => (
                  <div key={`${log.id}-${index}`} className="flex items-center justify-between text-sm">
                    <span className={`flex-1 ${
                      log.type === 'error' ? 'text-red-400' :
                      log.type === 'success' ? 'text-green-400' :
                      log.type === 'thinking' ? 'text-purple-400' :
                      log.type === 'action' ? 'text-blue-400' :
                      'text-white'
                    }`}>
                      {log.message}
                    </span>
                    <span className="text-xs text-white/50 ml-2">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50 text-center">Waiting for automation to start...</p>
            )}
          </div>
        </div>

        {/* Session Info */}
        <div className="flex justify-center p-6 border-t border-white/10">
          <Badge variant="secondary" className="bg-white/10 text-white/70">
            Session: {sessionId.split('_')[1] || 'Connecting...'}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default SimplifiedLiveStreamViewer;