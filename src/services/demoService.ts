import { DEMO_CONFIG, API_CONFIG, ENDPOINTS } from '@/config/api';

/**
 * PostPrism Secure Demo Service
 * 
 * Enhanced security features:
 * 1. No API keys exposed in frontend
 * 2. Rate limiting simulation to prevent abuse
 * 3. Realistic demo data with appropriate delays
 * 4. Clear distinction between demo and real functionality
 * 5. Optional backend integration for enhanced demo
 */

export interface DemoPublishResult {
  platform: string;
  adaptedContent: string;
  hashtags: string[];
  publishStatus: 'success' | 'failed';
  postUrl: string;
  aiInsights: string;
  stepsTaken: number;
  errorCount: number;
  executionTime: number;
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
    retweets?: number;
  };
  intelligenceScore?: number;
}

export interface DemoProgress {
  platform: string;
  step: number;
  maxSteps: number;
  action: string;
  thinking?: string;
  timestamp: number;
}

class SecureDemoService {
  private isActive = false;
  private sessionId: string | null = null;
  private progressCallbacks: ((progress: DemoProgress) => void)[] = [];
  private resultCallbacks: ((results: DemoPublishResult[]) => void)[] = [];
  
  // Rate limiting for demo abuse prevention
  private lastDemoRun = 0;
  private readonly minDemoInterval = 10000; // 10 seconds between demos
  
  /**
   * Start secure demo publishing simulation
   */
  async startDemo(content: string, platforms: string[]): Promise<{ sessionId: string }> {
    // Rate limiting check
    const now = Date.now();
    if (now - this.lastDemoRun < this.minDemoInterval) {
      throw new Error(`请等待 ${Math.ceil((this.minDemoInterval - (now - this.lastDemoRun)) / 1000)} 秒后再试`);
    }
    
    this.lastDemoRun = now;
    this.isActive = true;
    this.sessionId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🎮 启动安全Demo模式: ${this.sessionId}`);
    
    // Try backend demo first, fallback to frontend simulation
    try {
      const backendDemoResult = await this.tryBackendDemo(content, platforms);
      if (backendDemoResult) {
        return { sessionId: this.sessionId };
      }
    } catch (error) {
      console.log('📱 Backend demo unavailable, using frontend simulation');
    }
    
    // Fallback to frontend-only simulation
    this.simulateDemoPublishing(content, platforms);
    
    return { sessionId: this.sessionId };
  }
  
  /**
   * Try to use backend demo endpoint (if available)
   */
  private async tryBackendDemo(content: string, platforms: string[]): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${API_CONFIG.baseURL}${ENDPOINTS.publishContent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platforms,
          session_id: this.sessionId,
          demo_mode: true
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Backend demo response received:', result);
        return true;
      }
    } catch (error) {
      console.log('⚠️ Backend demo failed:', error);
    }
    return false;
  }
  
  /**
   * Frontend-only demo simulation with realistic timing
   */
  private async simulateDemoPublishing(content: string, platforms: string[]) {
    const totalSteps = 12;
    const stepDuration = DEMO_CONFIG.mockPublishingTime / totalSteps;
    
    console.log(`🤖 启动前端Demo模拟: ${platforms.length}个平台`);
    
    // Simulate parallel platform processing
    const platformPromises = platforms.map((platform, index) => 
      this.simulatePlatformPublishing(platform, content, index * 1000) // Stagger start times
    );
    
    // Wait for all platforms to "complete"
    const results = await Promise.all(platformPromises);
    
    // Emit final results
    this.resultCallbacks.forEach(callback => {
      try {
        callback(results);
      } catch (error) {
        console.error('Demo result callback error:', error);
      }
    });
    
    this.isActive = false;
    console.log('🎉 Demo模拟完成');
  }
  
  /**
   * Simulate individual platform publishing with realistic steps
   */
  private async simulatePlatformPublishing(platform: string, content: string, delay: number): Promise<DemoPublishResult> {
    await this.sleep(delay); // Stagger platform starts
    
    const steps = [
      '🔍 AI分析平台特征...',
      '💭 优化内容风格...',
      '🎯 选择最佳发布时机...',
      '📝 生成平台特定内容...',
      '🏷️ 添加相关标签...',
      '🤖 模拟浏览器操作...',
      '✍️ 填写发布内容...',
      '📸 处理媒体文件...',
      '🎨 调整视觉元素...',
      '✅ 验证发布格式...',
      '🚀 执行发布操作...',
      '🎉 确认发布成功!'
    ];
    
    // Simulate step-by-step progress
    for (let i = 0; i < steps.length; i++) {
      const progress: DemoProgress = {
        platform,
        step: i + 1,
        maxSteps: steps.length,
        action: steps[i],
        thinking: i % 3 === 0 ? DEMO_CONFIG.demoMessages.aiThinking[i % DEMO_CONFIG.demoMessages.aiThinking.length] : undefined,
        timestamp: Date.now()
      };
      
      this.progressCallbacks.forEach(callback => {
        try {
          callback(progress);
        } catch (error) {
          console.error('Demo progress callback error:', error);
        }
      });
      
      await this.sleep(1200 + Math.random() * 800); // Realistic step timing
    }
    
    // Generate platform-specific result
    const mockResult = DEMO_CONFIG.mockResults[platform as keyof typeof DEMO_CONFIG.mockResults];
    if (!mockResult) {
      throw new Error(`No mock data for platform: ${platform}`);
    }
    
    return {
      platform,
      adaptedContent: this.adaptContentForPlatform(content, platform),
      hashtags: this.generateDemoHashtags(platform),
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
  
  /**
   * Generate platform-optimized content
   */
  private adaptContentForPlatform(content: string, platform: string): string {
    const adaptations = {
      linkedin: `🚀 ${content}\n\n这是PostPrism AI的革命性演示！通过Agent S2.5 + ORGO的强大组合，我们实现了真正的多平台并行发布。\n\n#人工智能 #社交媒体自动化 #PostPrism #科技创新`,
      
      twitter: `🤖 ${content}\n\n✨ 刚刚体验了@PostPrism的AI发布功能：\n→ 3个平台同时发布\n→ 实时观看AI工作\n→ 45秒完成所有操作\n\n这就是未来！🚀\n\n#PostPrism #AI自动化 #效率工具`,
      
      instagram: `🌈 ${content}\n\n刚刚见证了PostPrism的神奇时刻！✨\n\nAI同时在LinkedIn、Twitter和Instagram工作，而我就像看电影一样观看整个过程 🎬\n\n这种透明的AI自动化体验前所未有！\n\n#PostPrism #人工智能 #科技美学 #自动化 #效率革命 #未来科技 #创新体验 #数字化转型 #AI工具 #社交媒体`
    };
    
    return adaptations[platform as keyof typeof adaptations] || content;
  }
  
  /**
   * Generate platform-appropriate hashtags
   */
  private generateDemoHashtags(platform: string): string[] {
    const platformTags = {
      linkedin: ['人工智能', 'PostPrism', '自动化', '效率工具', '科技创新'],
      twitter: ['PostPrism', 'AI自动化', '效率工具', '科技', '创新'],
      instagram: ['PostPrism', '人工智能', '科技美学', '自动化', '效率革命', '未来科技', 'AI工具']
    };
    
    return platformTags[platform as keyof typeof platformTags] || ['PostPrism', 'Demo'];
  }
  
  /**
   * Subscribe to demo progress updates
   */
  onProgress(callback: (progress: DemoProgress) => void): () => void {
    this.progressCallbacks.push(callback);
    return () => {
      const index = this.progressCallbacks.indexOf(callback);
      if (index > -1) {
        this.progressCallbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * Subscribe to demo results
   */
  onResults(callback: (results: DemoPublishResult[]) => void): () => void {
    this.resultCallbacks.push(callback);
    return () => {
      const index = this.resultCallbacks.indexOf(callback);
      if (index > -1) {
        this.resultCallbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * Get current demo status
   */
  getStatus() {
    return {
      isActive: this.isActive,
      sessionId: this.sessionId,
      canStartDemo: Date.now() - this.lastDemoRun >= this.minDemoInterval
    };
  }
  
  /**
   * Stop current demo
   */
  stopDemo() {
    this.isActive = false;
    this.sessionId = null;
    console.log('⏹️ Demo已停止');
  }
  
  /**
   * Utility: Sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const secureDemoService = new SecureDemoService();

// Export additional demo utilities
export const getDemoFeatures = () => ({
  supportedPlatforms: ['linkedin', 'twitter', 'instagram'],
  maxDemoRuns: 5, // Per session
  averageSimulationTime: DEMO_CONFIG.mockPublishingTime,
  securityFeatures: [
    '✅ 无API密钥暴露',
    '✅ 频率限制保护',
    '✅ 前端模拟安全',
    '✅ 成本零消耗',
    '✅ 真实体验感受'
  ]
});

export const isDemoModeRecommended = () => {
  // Recommend demo mode for Lovable deployments and first-time users
  return window.location.hostname.includes('lovable.app') || 
         localStorage.getItem('postprism_demo_completed') !== 'true';
};