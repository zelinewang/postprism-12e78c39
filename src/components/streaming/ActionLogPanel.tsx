/**
 * Action Log Panel Component
 * Optimized action log display for better performance
 */

import React, { memo, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionLogEntry } from '@/types/streaming';

interface ActionLogPanelProps {
  logs: ActionLogEntry[];
  isFullscreen?: boolean;
}

const ActionLogPanel = memo(({ logs, isFullscreen = false }: ActionLogPanelProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type: ActionLogEntry['type']) => {
    switch (type) {
      case 'info': return '💡';
      case 'action': return '🤖';
      case 'thinking': return '💭';
      case 'success': return '✅';
      case 'error': return '❌';
      case 'step': return '📋';
      default: return '📝';
    }
  };

  const getLogColor = (type: ActionLogEntry['type']) => {
    switch (type) {
      case 'info': return 'text-blue-300';
      case 'action': return 'text-green-300';
      case 'thinking': return 'text-purple-300';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'step': return 'text-yellow-300';
      default: return 'text-gray-300';
    }
  };

  return (
    <Card className="glass-card">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-semibold flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
          Live Activity Log
        </h3>
      </div>
      
      <ScrollArea 
        className={`${isFullscreen ? 'h-80' : 'h-64'}`}
        ref={scrollRef}
      >
        <div className="p-4 space-y-2">
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Waiting for activity...
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-2 text-sm animate-slide-in"
              >
                <span className="text-base leading-none mt-0.5">
                  {getLogIcon(log.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-muted-foreground mr-2">
                    {log.timestamp}
                  </span>
                  <span className={getLogColor(log.type)}>
                    {log.message}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
});

ActionLogPanel.displayName = 'ActionLogPanel';

export default ActionLogPanel;