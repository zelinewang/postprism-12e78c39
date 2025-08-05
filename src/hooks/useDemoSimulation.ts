/**
 * Demo Simulation Hook
 * Extracted for better performance and reusability
 */

import { useCallback } from 'react';
import { secureDemoService, DemoProgress } from '@/services/demoService';
import { DemoResultsFormatter } from '@/services/demo/DemoResultsFormatter';
import { StreamData, ActionLogEntry, PlatformResult } from '@/types/streaming';

interface UseDemoSimulationProps {
  setStreamData: React.Dispatch<React.SetStateAction<Record<string, StreamData>>>;
  addToActionLog: (message: string, type: ActionLogEntry['type']) => void;
  updateOverallProgress: () => void;
  onWorkflowCompleted?: (results?: PlatformResult[]) => void;
}

export const useDemoSimulation = ({ 
  setStreamData, 
  addToActionLog, 
  updateOverallProgress,
  onWorkflowCompleted 
}: UseDemoSimulationProps) => {
  
  const setupDemoListeners = useCallback(() => {
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
      
      // Format results and trigger completion callback
      const formattedResults = DemoResultsFormatter.formatResults(results);
      
      setTimeout(() => {
        if (onWorkflowCompleted) {
          console.log('🎯 Triggering demo completion callback with formatted results');
          onWorkflowCompleted(formattedResults);
        }
      }, 1500);
    });
    
    return () => {
      progressUnsubscribe();
      resultsUnsubscribe();
    };
  }, [setStreamData, addToActionLog, updateOverallProgress, onWorkflowCompleted]);

  return { setupDemoListeners };
};