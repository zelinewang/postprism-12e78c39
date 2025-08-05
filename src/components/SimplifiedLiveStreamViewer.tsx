import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { API_CONFIG, DEMO_MODE, DEMO_CONFIG } from "@/config/api";
import { secureDemoService, isDemoModeRecommended, DemoProgress } from "@/services/demoService";

// Optimized imports - lazy load heavy components
const PlatformCard = React.lazy(() => import('@/components/streaming/PlatformCard'));
const ActionLogPanel = React.lazy(() => import('@/components/streaming/ActionLogPanel'));
const StreamControls = React.lazy(() => import('@/components/streaming/StreamControls'));

// Optimized hook imports
import { useDemoSimulation } from '@/hooks/useDemoSimulation';
import { useWebSocketConnection } from '@/hooks/useWebSocketConnection';

// Type imports
import { StreamData, ActionLogEntry, StreamingProps, ConnectionStatus } from '@/types/streaming';

const SimplifiedLiveStreamViewer: React.FC<StreamingProps> = ({ 
  isActive, 
  selectedPlatforms, 
  sessionId: externalSessionId, 
  onWorkflowCompleted 
}) => {
  // Optimized state management
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamData, setStreamData] = useState<Record<string, StreamData>>({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [sessionId, setSessionId] = useState<string>(externalSessionId || '');
  const [actionLog, setActionLog] = useState<ActionLogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');

  // Memoized platform calculations for better performance
  const completedCount = useMemo(() => 
    Object.values(streamData).filter(p => p.status === 'completed').length,
    [streamData]
  );

  // Optimized callback functions with useCallback
  const addToActionLog = useCallback((message: string, type: ActionLogEntry['type']) => {
    setActionLog(prev => [...prev, {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Ensure unique keys
      message,
      type,
      timestamp: new Date().toLocaleTimeString()
    }]);
  }, []);
  
  const updateOverallProgress = useCallback(() => {
    const platforms = Object.values(streamData);
    const completedCount = platforms.filter(p => p.status === 'completed').length;
    const totalCount = platforms.length;
    setOverallProgress(totalCount > 0 ? (completedCount / totalCount) * 100 : 0);
  }, [streamData]);

  // Update sessionId when external sessionId changes
  useEffect(() => {
    if (externalSessionId) {
      setSessionId(externalSessionId);
    }
  }, [externalSessionId]);

  // Optimized hooks
  const { setupDemoListeners } = useDemoSimulation({
    setStreamData,
    addToActionLog,
    updateOverallProgress,
    onWorkflowCompleted
  });

  const { setupWebSocketConnection } = useWebSocketConnection({
    sessionId,
    setConnectionStatus,
    setStreamData,
    addToActionLog,
    updateOverallProgress,
    onWorkflowCompleted
  });

  // Main effect for handling streaming logic
  useEffect(() => {
    if (!isActive || selectedPlatforms.length === 0 || !sessionId) {
      return;
    }

    // Initialize stream data
    const initialData: Record<string, StreamData> = {};
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
      // SECURE frontend-only demo mode - NO backend connections
      console.log('🎮 Starting SECURE frontend-only demo mode...');
      console.log('🔒 NO API calls, NO backend, NO cost consumption');
      setConnectionStatus('connected');
      addToActionLog('🎮 Secure Demo Mode: Frontend-only simulation (no API usage)', 'info');
      
      return setupDemoListeners();
    } else {
      // Production mode - Connect to real WebSocket server
      return setupWebSocketConnection();
    }
  }, [isActive, selectedPlatforms, sessionId, setupDemoListeners, setupWebSocketConnection, addToActionLog]);

  // Memoized toggle function for fullscreen
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  if (!isActive) return null;

  return (
    <div className="w-full max-w-7xl mx-auto px-6 mb-12">
      <Card className={`glass-card ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
        {/* Optimized Controls with lazy loading */}
        <Suspense fallback={<div className="p-4 animate-pulse bg-white/5 h-16" />}>
          <StreamControls
            connectionStatus={connectionStatus}
            overallProgress={overallProgress}
            isFullscreen={isFullscreen}
            platformCount={selectedPlatforms.length}
            completedCount={completedCount}
            onToggleFullscreen={toggleFullscreen}
          />
        </Suspense>

        {/* Platform Streams Grid */}
        <div className={`grid gap-6 p-6 ${
          selectedPlatforms.length === 1 ? 'grid-cols-1' : 
          selectedPlatforms.length === 2 ? 'grid-cols-1 lg:grid-cols-2' : 
          'grid-cols-1 lg:grid-cols-3'
        }`}>
          {selectedPlatforms.map((platform) => {
            const data = streamData[platform];
            
            return (
              <Suspense key={platform} fallback={
                <Card className="glass-card p-4 animate-pulse">
                  <div className="h-32 bg-white/5 rounded" />
                </Card>
              }>
                <PlatformCard platform={platform} data={data} />
              </Suspense>
            );
          })}
        </div>

        {/* Action Log Panel */}
        <div className="p-6 border-t border-white/10">
          <Suspense fallback={
            <Card className="glass-card p-4 animate-pulse">
              <div className="h-64 bg-white/5 rounded" />
            </Card>
          }>
            <ActionLogPanel logs={actionLog} isFullscreen={isFullscreen} />
          </Suspense>
        </div>

        {/* Session Info */}
        <div className="flex justify-center p-6 border-t border-white/10">
          <div className="glass rounded-lg px-4 py-2">
            <span className="text-sm text-muted-foreground">
              Session: {sessionId.split('_')[1] || 'Connecting...'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SimplifiedLiveStreamViewer;