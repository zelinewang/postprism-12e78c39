/**
 * Demo Results Formatting Service
 * Extracted for better performance and maintainability
 */

import { DEMO_CONFIG } from '@/config/api';
import { DemoPublishResult } from '../demoService';
import { PlatformResult } from '@/types/streaming';
import { DemoContentAdapter } from './DemoContentAdapter';

export class DemoResultsFormatter {
  /**
   * Convert demo results to expected format for PublishResults component
   */
  static formatResults(results: DemoPublishResult[]): PlatformResult[] {
    return results.map(result => ({
      platform: result.platform,
      adaptedContent: result.adaptedContent,
      hashtags: result.hashtags,
      publishStatus: result.publishStatus,
      postUrl: result.postUrl,
      aiInsights: result.aiInsights,
      stepsTaken: result.stepsTaken,
      errorCount: result.errorCount,
      executionTime: result.executionTime,
      engagement: result.engagement,
      intelligenceScore: result.intelligenceScore
    }));
  }

  /**
   * Generate platform-specific result for demo
   */
  static generatePlatformResult(platform: string, content: string, steps: string[]): DemoPublishResult {
    const mockResult = DEMO_CONFIG.mockResults[platform as keyof typeof DEMO_CONFIG.mockResults];
    if (!mockResult) {
      throw new Error(`No mock data for platform: ${platform}`);
    }
    
    return {
      platform,
      adaptedContent: DemoContentAdapter.adaptContentForPlatform(content, platform),
      hashtags: DemoContentAdapter.generateDemoHashtags(platform),
      publishStatus: 'success',
      postUrl: mockResult.postUrl,
      aiInsights: mockResult.aiInsights,
      stepsTaken: steps.length,
      errorCount: 0,
      executionTime: 12 + Math.random() * 6, // 12-18 seconds
      engagement: mockResult.engagement,
      intelligenceScore: 95 + Math.random() * 5 // 95-100%
    };
  }
}