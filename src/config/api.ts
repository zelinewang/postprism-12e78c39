/**
 * API Configuration for PostPrism
 * 
 * Supports both local development and production deployment.
 * Automatically switches between local backend and cloud backend.
 */

interface APIConfig {
  baseURL: string;
  timeout: number;
  websocketURL: string;
}

// Environment detection with secure demo prioritization
const isDevelopment = import.meta.env.DEV;
const isLovableHosted = window.location.hostname.includes('lovable.app');
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true' || isLovableHosted; // Force demo mode on Lovable
const isCloudDeployment = import.meta.env.VITE_CLOUD_MODE === 'true' || isLovableHosted;

// API endpoints configuration - prioritize Render.com for demo
const DEVELOPMENT_API = 'http://localhost:8000';
const RENDER_BACKEND = 'https://postprism-backend.onrender.com'; // Your deployed backend
const FALLBACK_API = import.meta.env.VITE_API_URL || RENDER_BACKEND;

// Smart API selection based on environment - prioritize secure demo
function getAPIBaseURL(): string {
  if (isDevelopment) return DEVELOPMENT_API;
  // Always use Render backend for demo/cloud deployment
  return RENDER_BACKEND;
}

function getWebSocketURL(): string {
  if (isDevelopment) return 'ws://localhost:8000';
  // Always use Render WebSocket for demo/cloud deployment
  return 'wss://postprism-backend.onrender.com';
}

export const API_CONFIG: APIConfig = {
  baseURL: getAPIBaseURL(),
  timeout: isCloudDeployment ? 60000 : 30000, // Longer timeout for free tier cold starts
  websocketURL: getWebSocketURL()
};

export const DEMO_MODE = isDemo;
export const CLOUD_MODE = isCloudDeployment;

/**
 * Cloud deployment configuration
 * Optimizations and settings specific to free cloud deployment
 */
export const CLOUD_CONFIG = {
  isCloudDeployment,
  enableCloudOptimizations: isCloudDeployment || isDemo,
  coldStartWarning: isCloudDeployment,
  shareableDemo: true,
  analyticsEnabled: isCloudDeployment,
  
  // Free tier optimizations
  retryAttempts: isCloudDeployment ? 3 : 1,
  retryDelay: isCloudDeployment ? 2000 : 1000,
  
  // Cloud-specific features
  features: {
    shareButton: isCloudDeployment,
    performanceMonitoring: isCloudDeployment,
    userFeedback: isCloudDeployment,
    socialShare: isCloudDeployment
  },
  
  // URLs for sharing
  demoURL: 'https://postprism.lovable.app',
  githubURL: 'https://github.com/your-username/postprism',
  documentationURL: 'https://github.com/your-username/postprism#readme'
};

/**
 * Enhanced Demo mode configuration
 * Provides realistic mock data and simulated workflows for users without API keys
 */
export const DEMO_CONFIG = {
  mockPublishingTime: 18000, // 18 seconds for more realistic simulation
  mockPlatforms: ['linkedin', 'twitter', 'instagram'],
  demoMessages: {
    welcome: isCloudDeployment 
      ? "🌟 Welcome to PostPrism Cloud Demo! Running live on free infrastructure - watch 3 AI agents work simultaneously!"
      : "🎮 Welcome to PostPrism Demo! Watch AI agents work simultaneously across 3 platforms.",
    startPublishing: isCloudDeployment
      ? "☁️ Cloud AI agents activated! Publishing to LinkedIn, Twitter, and Instagram in parallel..."
      : "🚀 Starting parallel publishing to LinkedIn, Twitter, and Instagram...",
    cloudOptimized: "⚡ Optimized for free cloud deployment - Lovable frontend + Render backend",
    shareDemo: "🔗 Love this demo? Share it with your team!",
    upgradePrompt: "💡 Want real publishing? Deploy locally with your API keys!",
    aiThinking: [
      "💭 Analyzing LinkedIn's professional tone requirements...",
      "💭 Optimizing Twitter content for engagement algorithms...", 
      "💭 Adapting visual elements for Instagram aesthetic...",
      "💭 Calculating optimal posting times for each platform...",
      "💭 Ensuring consistent brand voice across all channels..."
    ],
    agentActions: [
      "🔍 AI detecting clickable elements on page...",
      "✍️ Composing platform-optimized content...",
      "🏷️ Adding relevant hashtags and mentions...",
      "📸 Processing visual content for platform specs...",
      "🎯 Positioning content for maximum reach...",
      "✅ Verifying post formatting and compliance..."
    ]
  },
  mockResults: {
    linkedin: {
      success: true,
      content: "🚀 Exciting update from PostPrism! Our AI-powered social media automation platform is revolutionizing how businesses manage their online presence. With Agent S2.5 + ORGO AI, we're achieving 3x faster publishing across multiple platforms simultaneously. #AI #Innovation #SocialMedia #BusinessAutomation",
      postUrl: "https://linkedin.com/posts/postprism-ai_ai-innovation-socialmedia-activity-7012345678901234567-Abc1",
      executionTime: 12.3,
      engagement: {
        likes: 47,
        comments: 12,
        shares: 8
      },
      aiInsights: "Professional tone optimized for LinkedIn audience. Content structured for thought leadership positioning."
    },
    twitter: {
      success: true,
      content: "🤖 PostPrism + Agent S2.5 = Social Media Magic! ✨\n\nWatch AI work across 3 platforms simultaneously:\n→ 3x faster publishing\n→ Real-time transparency \n→ Production-ready automation\n\n#AI #PostPrism #AgentS25 #SocialMediaAutomation\n\nDemo: postprism.ai 🎮",
      postUrl: "https://twitter.com/PostPrismAI/status/1823456789012345678",
      executionTime: 11.7,
      engagement: {
        likes: 234,
        retweets: 67,
        comments: 43
      },
      aiInsights: "Optimized hashtags and emoji placement for maximum Twitter engagement. Character count optimized."
    },
    instagram: {
      success: true,
      content: "🌈 Behind the scenes at PostPrism! \n\nOur AI agents are working their magic ✨ Publishing to LinkedIn, Twitter & Instagram simultaneously - all while you watch in real-time! 🤖\n\nThis is the future of social media management 🚀\n\n#PostPrism #AIAutomation #SocialMediaTech #Innovation #TechMagic #FutureOfWork #AIAgents #ProductivityHack #TechStartup #DigitalTransformation",
      postUrl: "https://instagram.com/p/CyAbc123DefGhi",
      executionTime: 15.1,
      engagement: {
        likes: 892,
        comments: 156,
        shares: 234
      },
      aiInsights: "Visual-first content optimized for Instagram feed. Strategic hashtag mix for maximum discoverability."
    }
  },
  performanceMetrics: {
    totalTimeSaved: "2.5 hours per week",
    successRate: "98.7%",
    platformReach: "34,000+ total reach",
    engagementBoost: "+187% vs manual posting"
  }
};

/**
 * API endpoints
 */
export const ENDPOINTS = {
  health: '/health',
  config: '/api/config',
  previewContent: '/api/preview-content',
  publishContent: '/api/publish-content',
  testAgent: '/api/test-official-agent',
  testParallel: '/api/test-parallel-execution'
};

// Secure logging with limited information exposure
console.log(`🔧 PostPrism Configuration:`, {
  mode: isDevelopment ? 'development' : isDemo ? 'secure-demo' : 'production',
  backend: API_CONFIG.baseURL.includes('render.com') ? 'cloud-backend' : 'local-backend',
  demoMode: DEMO_MODE,
  cloudDeployment: CLOUD_CONFIG.isCloudDeployment,
  securityLevel: isLovableHosted ? 'lovable-secured' : 'standard'
});