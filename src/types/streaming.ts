/**
 * Type definitions for streaming functionality
 * Centralized types for better TypeScript performance
 */

export interface StreamData {
  platform: string;
  progress: number;
  status: 'idle' | 'active' | 'completed' | 'error';
  currentAction: string;
  videoFrame?: string;
}

export interface ActionLogEntry {
  id: string;
  message: string;
  type: 'info' | 'action' | 'thinking' | 'success' | 'error' | 'step';
  timestamp: string;
}

export interface PlatformResult {
  platform: string;
  adaptedContent: string;
  hashtags: string[];
  publishStatus: 'success' | 'failed';
  postUrl: string;
  aiInsights: string;
  stepsTaken: number;
  errorCount: number;
  executionTime?: number;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    retweets?: number;
  };
  intelligenceScore?: number;
}

export interface StreamingProps {
  isActive: boolean;
  selectedPlatforms: string[];
  sessionId?: string;
  onWorkflowCompleted?: (results?: PlatformResult[]) => void;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';