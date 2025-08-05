/**
 * Stream Controls Component
 * Optimized streaming controls for better performance
 */

import React, { memo } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Monitor, 
  Maximize2, 
  Minimize2,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";
import { ConnectionStatus } from '@/types/streaming';

interface StreamControlsProps {
  connectionStatus: ConnectionStatus;
  overallProgress: number;
  isFullscreen: boolean;
  platformCount: number;
  completedCount: number;
  onToggleFullscreen: () => void;
}

const StreamControls = memo(({ 
  connectionStatus, 
  overallProgress, 
  isFullscreen, 
  platformCount, 
  completedCount,
  onToggleFullscreen 
}: StreamControlsProps) => {
  const getStatusColor = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'connecting': return 'bg-yellow-500 animate-pulse';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: ConnectionStatus) => {
    switch (status) {
      case 'connected': return 'Live';
      case 'connecting': return 'Connecting...';
      case 'disconnected': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-bold text-rainbow flex items-center">
          <Monitor className="w-6 h-6 mr-2" />
          Agent Live Stream
        </h2>
        
        <Badge 
          variant="secondary" 
          className={`flex items-center space-x-1 ${
            connectionStatus === 'connected' ? 'bg-green-500/20 text-green-400' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${getStatusColor(connectionStatus)}`} />
          <span>{getStatusText(connectionStatus)}</span>
        </Badge>
      </div>

      <div className="flex items-center space-x-4">
        {/* Progress Summary */}
        <div className="flex items-center space-x-2 text-sm">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>{completedCount}/{platformCount} platforms</span>
        </div>
        
        <div className="flex items-center space-x-2 min-w-[120px]">
          <Clock className="w-4 h-4 text-accent" />
          <Progress value={overallProgress} className="w-16 h-2" />
          <span className="text-sm text-accent">{Math.round(overallProgress)}%</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFullscreen}
          className="text-muted-foreground hover:text-white"
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 mr-1" />
              Exit Fullscreen
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 mr-1" />
              Fullscreen
            </>
          )}
        </Button>
      </div>
    </div>
  );
});

StreamControls.displayName = 'StreamControls';

export default StreamControls;