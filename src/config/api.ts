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

// Environment detection
const isDevelopment = import.meta.env.DEV;
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

// API endpoints configuration
const DEVELOPMENT_API = 'http://localhost:8000';
const PRODUCTION_API = import.meta.env.VITE_API_URL || 'https://postprism-backend.railway.app';

export const API_CONFIG: APIConfig = {
  baseURL: isDevelopment ? DEVELOPMENT_API : PRODUCTION_API,
  timeout: 30000,
  websocketURL: isDevelopment 
    ? 'ws://localhost:8000' 
    : (import.meta.env.VITE_WS_URL || 'wss://postprism-backend.railway.app')
};

export const DEMO_MODE = isDemo;

/**
 * Demo mode configuration
 * Provides mock data and simulated workflows for users without API keys
 */
export const DEMO_CONFIG = {
  mockPublishingTime: 15000, // 15 seconds simulated publishing
  mockPlatforms: ['linkedin', 'twitter', 'instagram'],
  mockResults: {
    linkedin: {
      success: true,
      content: "Demo content published to LinkedIn",
      postUrl: "https://linkedin.com/posts/demo-12345",
      executionTime: 12.5
    },
    twitter: {
      success: true,
      content: "Demo content published to Twitter",
      postUrl: "https://twitter.com/demo/status/12345",
      executionTime: 11.2
    },
    instagram: {
      success: true,
      content: "Demo content published to Instagram",
      postUrl: "https://instagram.com/p/demo12345",
      executionTime: 14.8
    }
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

console.log(`🔧 API Configuration:`, {
  mode: isDevelopment ? 'development' : 'production',
  baseURL: API_CONFIG.baseURL,
  websocketURL: API_CONFIG.websocketURL,
  demoMode: DEMO_MODE
});