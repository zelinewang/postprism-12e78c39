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
      throw new Error(`Please wait ${Math.ceil((this.minDemoInterval - (now - this.lastDemoRun)) / 1000)} seconds before trying again`);
    }
    
    this.lastDemoRun = now;
    this.isActive = true;
    this.sessionId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`🎮 Starting secure demo mode: ${this.sessionId}`);
    
    // Try real backend first for live virtual machine demo
    try {
      const backendDemoResult = await this.tryBackendDemo(content, platforms);
      if (backendDemoResult) {
        console.log('🎬 Real live stream demo started with virtual machines and agents');
        return { sessionId: this.sessionId };
      }
    } catch (error) {
      console.warn('⚠️ Real backend unavailable (might be sleeping), using realistic simulation:', error);
    }
    
    // Fallback to realistic frontend simulation if backend is sleeping
    console.log('📱 Using enhanced simulation while backend wakes up...');
    this.simulateDemoPublishing(content, platforms);
    
    return { sessionId: this.sessionId };
  }
  
  /**
   * Use real backend for live demo with virtual machines and agents
   */
  private async tryBackendDemo(content: string, platforms: string[]): Promise<boolean> {
    try {
      console.log(`🚀 Connecting to real backend: ${API_CONFIG.baseURL}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // Longer timeout for real processing
      
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
        console.log('✅ Real backend connected - live stream processing started:', result);
        return true;
      } else {
        console.error('❌ Backend returned error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('❌ Failed to connect to real backend:', error);
    }
    return false;
  }
  
  /**
   * Frontend-only demo simulation with realistic timing
   */
  private async simulateDemoPublishing(content: string, platforms: string[]) {
    const totalSteps = 12;
    const stepDuration = DEMO_CONFIG.mockPublishingTime / totalSteps;
    
    console.log(`🤖 Starting frontend demo simulation for ${platforms.length} platforms`);
    
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
    console.log('🎉 Demo simulation completed');
  }
  
  /**
   * Simulate individual platform publishing with realistic steps
   */
  private async simulatePlatformPublishing(platform: string, content: string, delay: number): Promise<DemoPublishResult> {
    await this.sleep(delay); // Stagger platform starts
    
    const steps = [
      '🔍 AI analyzing platform characteristics...',
      '💭 Optimizing content style...',
      '🎯 Selecting optimal posting time...',
      '📝 Generating platform-specific content...',
      '🏷️ Adding relevant hashtags...',
      '🤖 Simulating browser automation...',
      '✍️ Filling in content...',
      '📸 Processing media files...',
      '🎨 Adjusting visual elements...',
      '✅ Validating post format...',
      '🚀 Executing publish operation...',
      '🎉 Confirming successful publication!'
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
      linkedin: `🚀 ${content}\n\nThis is a revolutionary demo of PostPrism AI! Through the powerful combination of Agent S2.5 + ORGO, we've achieved true multi-platform parallel publishing.\n\n#ArtificialIntelligence #SocialMediaAutomation #PostPrism #TechInnovation`,
      
      twitter: `🤖 ${content}\n\n✨ Just experienced @PostPrism's AI publishing magic:\n→ 3 platforms simultaneously\n→ Watch AI work in real-time\n→ 45 seconds for everything\n\nThis is the future! 🚀\n\n#PostPrism #AIAutomation #ProductivityTool`,
      
      instagram: `🌈 ${content}\n\nJust witnessed PostPrism's magical moment! ✨\n\nAI working simultaneously on LinkedIn, Twitter and Instagram while I watch the entire process like a movie 🎬\n\nThis transparent AI automation experience is unprecedented!\n\n#PostPrism #ArtificialIntelligence #TechAesthetics #Automation #EfficiencyRevolution #FutureTech #Innovation #DigitalTransformation #AITools #SocialMedia`
    };
    
    return adaptations[platform as keyof typeof adaptations] || content;
  }
  
  /**
   * Generate platform-appropriate hashtags
   */
  private generateDemoHashtags(platform: string): string[] {
    const platformTags = {
      linkedin: ['ArtificialIntelligence', 'PostPrism', 'Automation', 'ProductivityTool', 'TechInnovation'],
      twitter: ['PostPrism', 'AIAutomation', 'ProductivityTool', 'Tech', 'Innovation'],
      instagram: ['PostPrism', 'ArtificialIntelligence', 'TechAesthetics', 'Automation', 'EfficiencyRevolution', 'FutureTech', 'AITools']
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
    console.log('⏹️ Demo stopped');
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
    '✅ No API keys exposed',
    '✅ Rate limiting protection',
    '✅ Secure frontend simulation',
    '✅ Zero cost consumption',
    '✅ Authentic experience'
  ]
});

export const isDemoModeRecommended = () => {
  // Recommend demo mode for Lovable deployments and first-time users
  return window.location.hostname.includes('lovable.app') || 
         localStorage.getItem('postprism_demo_completed') !== 'true';
};