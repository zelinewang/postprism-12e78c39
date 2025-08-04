import { useState } from "react";
import Header from "@/components/Header";
import ContentInput from "@/components/ContentInput";
import SimplifiedLiveStreamViewer from "@/components/SimplifiedLiveStreamViewer";
import PublishResults from "@/components/PublishResults";

type AppState = 'input' | 'processing' | 'streaming' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [originalContent, setOriginalContent] = useState('');
  const [publishResults, setPublishResults] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');

  const handlePublish = async (content: string, platforms: string[]) => {
    setOriginalContent(content);
    setSelectedPlatforms(platforms);
    
    // 生成session_id用于WebSocket连接
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSessionId(sessionId);
    
    // 立即跳转到直播界面（不等API响应）
    setAppState('streaming');
    
    try {
      // Call real backend API with session_id
      const response = await fetch('http://localhost:8000/api/publish-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platforms,
          session_id: sessionId  // 传递给后端
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Get session_id from backend response
        const sessionId = result.data?.stream_session_id || 'unknown';
        setCurrentSessionId(sessionId);
        
        // Process results from backend
        const processedResults = Object.entries(result.data.publish_results).map(([platform, data]: [string, any]) => ({
          platform,
          adaptedContent: data.adapted_content || data.content,
          hashtags: data.hashtags || [],
          publishStatus: data.publish_status === 'success' ? 'success' as const : 'failed' as const,
          postUrl: data.post_url,
          aiInsights: data.ai_insights,
          stepsTaken: data.steps_taken || 0,
          errorCount: data.error_count || 0
        }));
        
        setPublishResults(processedResults);
        
        // Don't auto-transition - let SimplifiedLiveStreamViewer handle completion
      } else {
        throw new Error(result.error || 'Publishing failed');
      }
      
    } catch (error) {
      console.error('Publishing error:', error);
      // Show error state or fallback
      const errorResults = platforms.map(platform => ({
        platform,
        adaptedContent: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        hashtags: [],
        publishStatus: 'failed' as const,
        postUrl: '',
        aiInsights: 'Publishing failed due to system error',
        stepsTaken: 0,
        errorCount: 1
      }));
      
      setPublishResults(errorResults);
      setAppState('results');
    }
  };

  const handleNewPublish = () => {
    setAppState('input');
    setSelectedPlatforms([]);
    setOriginalContent('');
    setPublishResults([]);
    setCurrentSessionId('');
  };

  const handleWorkflowCompleted = (results?: any) => {
    // Transition to results page when live stream workflow completes
    console.log('🎯 handleWorkflowCompleted called, transitioning to results...');
    console.log('📊 Received results from WebSocket:', results);
    console.log('📊 Current publishResults:', publishResults);
    
    // If we have results from WebSocket, use them
    if (results && results.platforms) {
      console.log('🔄 Processing WebSocket results...');
      const processedResults = Object.entries(results.platforms).map(([platform, data]: [string, any]) => ({
        platform,
        adaptedContent: data.adapted_content || data.content,
        hashtags: data.hashtags || [],
        publishStatus: data.publish_status === 'success' ? 'success' as const : 'failed' as const,
        postUrl: data.post_url,
        aiInsights: data.ai_insights,
        stepsTaken: data.steps_taken || 0,
        errorCount: data.error_count || 0
      }));
      setPublishResults(processedResults);
    }
    
    setTimeout(() => {
      console.log('🔄 Setting appState to results');
      setAppState('results');
    }, 1500); // Brief delay to show completion
  };

  return (
    <div className="min-h-screen bg-background prism-light-effect">
      <Header />
      
      {/* Debug Status - Remove in production */}
      <div className="fixed top-20 right-4 z-50 bg-black/50 text-white p-2 rounded text-xs">
        <div>State: {appState}</div>
        <div>Results: {publishResults.length}</div>
        <div>Session: {currentSessionId.slice(-8)}</div>
      </div>
      
      <main className="space-y-8 relative z-10">
        {/* Content Input Section */}
        {(appState === 'input' || appState === 'processing') && (
          <ContentInput 
            onPublish={handlePublish}
            isProcessing={appState === 'processing'}
          />
        )}

        {/* Live Stream Viewer */}
        <SimplifiedLiveStreamViewer 
          isActive={appState === 'streaming'}
          selectedPlatforms={selectedPlatforms}
          sessionId={currentSessionId}
          onWorkflowCompleted={handleWorkflowCompleted}
        />

        {/* Results Display */}
        {console.log(`🔍 Render - appState: ${appState}, publishResults length: ${publishResults.length}`)}
        <PublishResults
          isVisible={appState === 'results'}
          originalContent={originalContent}
          results={publishResults}
          totalTime="2m 15s"
          onNewPublish={handleNewPublish}
        />
      </main>

      {/* Advanced Optical Prism Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Primary Prism Refraction Beams */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-full opacity-40 animate-light-ray"
              style={{
                left: `${15 + i * 10}%`,
                background: `linear-gradient(to bottom, 
                  hsl(${i * 45} 80% 60%) 0%, 
                  transparent 60%, 
                  hsl(${i * 45 + 180} 80% 60%) 100%)`,
                transform: `rotate(${-20 + i * 5}deg)`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${3 + i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* Prismatic Crystal Structures */}
        <div className="absolute top-10 left-10 w-40 h-40 opacity-20 animate-prism-rotate">
          <div className="w-full h-full bg-gradient-conic from-purple-400 via-pink-400 via-blue-400 via-cyan-400 to-purple-400 polygon-prism backdrop-blur-sm"></div>
        </div>
        <div className="absolute top-1/3 right-20 w-32 h-32 opacity-25 animate-prism-rotate" style={{ animationDelay: '5s', animationDuration: '25s' }}>
          <div className="w-full h-full bg-gradient-conic from-cyan-400 via-green-400 via-yellow-400 via-orange-400 to-cyan-400 polygon-prism backdrop-blur-sm"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 opacity-30 animate-prism-rotate" style={{ animationDelay: '10s', animationDuration: '18s' }}>
          <div className="w-full h-full bg-gradient-conic from-pink-400 via-purple-400 via-indigo-400 via-blue-400 to-pink-400 polygon-prism backdrop-blur-sm"></div>
        </div>

        {/* Spectral Orb Dispersions */}
        <div className="absolute top-1/5 left-1/5 w-96 h-96 rounded-full opacity-15 animate-enhanced-float">
          <div className="w-full h-full bg-rainbow blur-3xl"></div>
        </div>
        <div className="absolute bottom-1/5 right-1/5 w-80 h-80 rounded-full opacity-20 animate-enhanced-float" style={{ animationDelay: '4s' }}>
          <div className="w-full h-full bg-prism blur-3xl"></div>
        </div>
        <div className="absolute top-2/3 left-2/3 w-72 h-72 rounded-full opacity-18 animate-enhanced-float" style={{ animationDelay: '2s' }}>
          <div className="w-full h-full bg-gradient-radial from-blue-400/40 via-purple-400/30 to-transparent blur-3xl"></div>
        </div>

        {/* Light Particle Field */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full animate-enhanced-glow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${2 + Math.random() * 4}px`,
                height: `${2 + Math.random() * 4}px`,
                background: `radial-gradient(circle, hsl(${i * 18} 70% 60%) 0%, transparent 70%)`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                opacity: 0.4 + Math.random() * 0.4
              }}
            />
          ))}
        </div>

        {/* Central Prismatic Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 opacity-8 animate-prism-rotate" style={{ animationDuration: '30s' }}>
          <div className="w-full h-full bg-gradient-conic from-red-400 via-orange-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 via-purple-400 to-red-400 rounded-full blur-2xl"></div>
        </div>

        {/* Optical Refraction Grid */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent transform rotate-12"></div>
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/5 to-transparent transform -rotate-12"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-400/3 to-transparent transform rotate-45"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-blue-400/3 to-transparent transform -rotate-45"></div>
        </div>

        {/* Atmospheric Light Scattering */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-400/5 via-transparent to-blue-400/5 opacity-60"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-pink-400/3 via-transparent to-cyan-400/3 opacity-40 animate-pulse-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
