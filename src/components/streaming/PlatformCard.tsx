/**
 * Platform Card Component
 * Optimized individual platform display for better performance
 */

import React, { memo } from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PLATFORM_ICONS, PLATFORM_COLORS, PlatformKey } from '@/utils/platformConfig';
import { StreamData } from '@/types/streaming';

interface PlatformCardProps {
  platform: string;
  data: StreamData;
}

const PlatformCard = memo(({ platform, data }: PlatformCardProps) => {
  const PlatformIcon = PLATFORM_ICONS[platform as PlatformKey];
  const colorClass = PLATFORM_COLORS[platform as PlatformKey];
  
  if (!PlatformIcon) {
    return null;
  }

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
          <PlatformIcon className={`w-4 h-4 ${colorClass}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium capitalize">{platform}</h4>
          <div className={`w-2 h-2 rounded-full inline-block mr-2 ${
            data.status === 'active' ? 'bg-yellow-400 animate-pulse' :
            data.status === 'completed' ? 'bg-green-400' :
            data.status === 'error' ? 'bg-red-400' : 'bg-gray-400'
          }`} />
          <span className="text-xs text-muted-foreground capitalize">{data.status}</span>
        </div>
      </div>
      
      <Progress 
        value={data.progress} 
        className="mb-2 h-2 bg-white/10"
      />
      
      <p className="text-sm text-muted-foreground truncate" title={data.currentAction}>
        {data.currentAction}
      </p>
      
      {data.videoFrame && (
        <div className="mt-3 rounded-lg overflow-hidden bg-black/20">
          <img 
            src={`data:image/png;base64,${data.videoFrame}`}
            alt={`${platform} automation`}
            className="w-full h-24 object-cover"
          />
        </div>
      )}
    </Card>
  );
});

PlatformCard.displayName = 'PlatformCard';

export default PlatformCard;