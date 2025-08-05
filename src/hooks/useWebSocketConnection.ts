/**
 * WebSocket Connection Hook
 * Extracted for better performance and reusability
 */

import { useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from '@/config/api';
import { StreamData, ActionLogEntry, ConnectionStatus, PlatformResult } from '@/types/streaming';

interface UseWebSocketConnectionProps {
  sessionId: string;
  setConnectionStatus: React.Dispatch<React.SetStateAction<ConnectionStatus>>;
  setStreamData: React.Dispatch<React.SetStateAction<Record<string, StreamData>>>;
  addToActionLog: (message: string, type: ActionLogEntry['type']) => void;
  updateOverallProgress: () => void;
  onWorkflowCompleted?: (results?: PlatformResult[]) => void;
}

export const useWebSocketConnection = ({
  sessionId,
  setConnectionStatus,
  setStreamData,
  addToActionLog,
  updateOverallProgress,
  onWorkflowCompleted
}: UseWebSocketConnectionProps) => {
  const socketRef = useRef<Socket | null>(null);

  const setupWebSocketConnection = useCallback(() => {
    console.log('🔌 Connecting to WebSocket server...');
    setConnectionStatus('connecting');
    
    const socket = io(API_CONFIG.websocketURL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      timeout: 20000,
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
    
    // Agent actions
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
    
    // Agent steps
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
    
    // Agent completion
    socket.on('all_platforms_completed', (data) => {
      console.log('🎉 All platforms completed:', data);
      addToActionLog('🎉 All platforms completed successfully!', 'success');
      
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
      
      setTimeout(() => {
        console.log('🎯 Triggering workflow completion callback with results...');
        if (onWorkflowCompleted) {
          onWorkflowCompleted(data.results || data);
        }
        
        setTimeout(() => {
          console.log('🧹 Cleaning up WebSocket after completion...');
          if (socketRef.current) {
            socketRef.current.emit('leave_stream', { session_id: sessionId });
            socketRef.current.disconnect();
            socketRef.current = null;
          }
          setConnectionStatus('disconnected');
        }, 1000);
      }, 1500);
    });
    
    // Other events
    socket.on('agent_started', (data) => {
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
    
    socket.on('agent_thinking', (data) => {
      setStreamData(prev => ({
        ...prev,
        [data.platform]: {
          ...prev[data.platform],
          currentAction: data.thinking || data.analysis || 'Analyzing...',
          status: 'active'
        }
      }));
      
      const thinkingText = data.thinking || data.analysis || 'Agent thinking...';
      const scoreText = data.intelligence_score ? ` (Intelligence: ${data.intelligence_score})` : '';
      addToActionLog(`${data.platform}: 💭 ${thinkingText}${scoreText}`, 'thinking');
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
    
    return () => {
      if (socketRef.current) {
        console.log('🧹 Cleaning up WebSocket connection...');
        socketRef.current.emit('leave_stream', { session_id: sessionId });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [sessionId, setConnectionStatus, setStreamData, addToActionLog, updateOverallProgress, onWorkflowCompleted]);

  return { setupWebSocketConnection, socketRef };
};
