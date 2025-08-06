/**
 * CloudStatus Component
 *
 * Displays cloud deployment status, provides sharing functionality,
 * and shows optimization tips for cloud users.
 */

import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Share2, Github, BookOpen, Zap, Cloud, AlertCircle } from 'lucide-react';
import { CLOUD_CONFIG, API_CONFIG, DEMO_MODE } from '@/config/api';

interface CloudStatusProps {
  className?: string;
  showShareButton?: boolean;
  showPerformanceInfo?: boolean;
}

const CloudStatus: React.FC<CloudStatusProps> = ({
  className = "",
  showShareButton = true,
  showPerformanceInfo = true
}) => {
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'cold-start' | 'error'>('checking');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Check server status
  useEffect(() => {
    if (!CLOUD_CONFIG.isCloudDeployment && !DEMO_MODE) return;

    const checkServerStatus = async () => {
      const startTime = Date.now();

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${API_CONFIG.baseURL}/health`, {
          method: 'GET',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        const endTime = Date.now();
        const responseTimeMs = endTime - startTime;

        setResponseTime(responseTimeMs);

        if (response.ok) {
          setServerStatus(responseTimeMs > 5000 ? 'cold-start' : 'online');
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        console.log('Server status check:', error);
        setServerStatus(DEMO_MODE ? 'online' : 'error'); // Demo mode always shows online
        setResponseTime(DEMO_MODE ? 150 : null); // Mock response time for demo
      }
    };

    checkServerStatus();
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PostPrism - AI Social Media Automation',
          text: '🤖 Check out this revolutionary AI tool that publishes to LinkedIn, Twitter & Instagram simultaneously! Watch the AI work in real-time.',
          url: CLOUD_CONFIG.demoURL
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } catch (error) {
        // Fallback to clipboard
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(CLOUD_CONFIG.demoURL);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const getStatusInfo = () => {
    switch (serverStatus) {
      case 'checking':
        return {
          icon: <Cloud className="w-4 h-4 animate-pulse" />,
          text: 'Checking cloud status...',
          color: 'bg-blue-500'
        };
      case 'online':
        return {
          icon: <Zap className="w-4 h-4" />,
          text: `Online (${responseTime}ms)`,
          color: 'bg-green-500'
        };
      case 'cold-start':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: `Cold start (${responseTime}ms)`,
          color: 'bg-yellow-500'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Demo mode only',
          color: 'bg-purple-500'
        };
    }
  };

  const statusInfo = getStatusInfo();

  if (!CLOUD_CONFIG.isCloudDeployment && !DEMO_MODE) {
    return null; // Don't show for local development
  }

  return (
    <Card className={`bg-white/5 backdrop-blur-lg border border-white/10 ${className}`}>
      <div className="p-4">
        {/* Status Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Badge className={`${statusInfo.color} text-white flex items-center space-x-1`}>
              {statusInfo.icon}
              <span className="text-xs font-medium">{statusInfo.text}</span>
            </Badge>
            {CLOUD_CONFIG.isCloudDeployment && (
              <Badge variant="outline" className="border-blue-400 text-blue-400">
                <Cloud className="w-3 h-3 mr-1" />
                Free Cloud
              </Badge>
            )}
          </div>

          {showShareButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-1" />
              {shareSuccess ? 'Copied!' : 'Share'}
            </Button>
          )}
        </div>

        {/* Cloud Optimization Info */}
        {showPerformanceInfo && CLOUD_CONFIG.isCloudDeployment && (
          <div className="text-sm text-white/70 mb-3">
            <p className="flex items-center space-x-1 mb-1">
              <Zap className="w-3 h-3" />
              <span>Running on Render.com free tier (750h/month)</span>
            </p>
            {serverStatus === 'cold-start' && (
              <p className="text-yellow-400 text-xs">
                ℹ️ First load after inactivity may take 10-30 seconds
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(CLOUD_CONFIG.githubURL, '_blank')}
            className="border-white/20 text-white hover:bg-white/10 text-xs"
          >
            <Github className="w-3 h-3 mr-1" />
            Source Code
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(CLOUD_CONFIG.documentationURL, '_blank')}
            className="border-white/20 text-white hover:bg-white/10 text-xs"
          >
            <BookOpen className="w-3 h-3 mr-1" />
            Setup Guide
          </Button>

          {DEMO_MODE && (
            <Button
              variant="outline"
              size="sm"
              className="border-purple-400 text-purple-400 hover:bg-purple-400/10 text-xs"
              disabled
            >
              <Cloud className="w-3 h-3 mr-1" />
              Demo Mode
            </Button>
          )}
        </div>

        {/* Demo Mode Info */}
        {DEMO_MODE && (
          <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-300">
            <p>💡 This is a demo simulation. For real publishing, deploy locally with your API keys.</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default CloudStatus;
