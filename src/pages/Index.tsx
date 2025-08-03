import { useState } from "react";
import Header from "@/components/Header";
import ContentInput from "@/components/ContentInput";
import LiveStreamViewer from "@/components/LiveStreamViewer";
import PublishResults from "@/components/PublishResults";

type AppState = 'input' | 'processing' | 'streaming' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [originalContent, setOriginalContent] = useState('');
  const [publishResults, setPublishResults] = useState<any[]>([]);

  const handlePublish = (content: string, platforms: string[]) => {
    setOriginalContent(content);
    setSelectedPlatforms(platforms);
    setAppState('processing');
    
    // Simulate processing delay then start streaming
    setTimeout(() => {
      setAppState('streaming');
      
      // Simulate completion after streaming
      setTimeout(() => {
        // Mock results for demo
        const mockResults = platforms.map(platform => ({
          platform,
          adaptedContent: `${content} - Optimized for ${platform} with platform-specific tone and formatting.`,
          hashtags: platform === 'linkedin' ? ['professional', 'networking'] : 
                   platform === 'twitter' ? ['trending', 'tech'] : 
                   ['visual', 'inspiration'],
          publishStatus: 'success' as const,
          postUrl: `https://${platform}.com/post/123`,
          aiInsights: `Content optimized for ${platform}'s audience with improved engagement potential.`,
          stepsTaken: 10,
          errorCount: 0
        }));
        
        setPublishResults(mockResults);
        setAppState('results');
      }, 8000); // 8 seconds of streaming
    }, 2000); // 2 seconds processing
  };

  const handleNewPublish = () => {
    setAppState('input');
    setSelectedPlatforms([]);
    setOriginalContent('');
    setPublishResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="space-y-8">
        {/* Content Input Section */}
        {(appState === 'input' || appState === 'processing') && (
          <ContentInput 
            onPublish={handlePublish}
            isProcessing={appState === 'processing'}
          />
        )}

        {/* Live Stream Viewer */}
        <LiveStreamViewer 
          isActive={appState === 'streaming'}
          selectedPlatforms={selectedPlatforms}
        />

        {/* Results Display */}
        <PublishResults
          isVisible={appState === 'results'}
          originalContent={originalContent}
          results={publishResults}
          totalTime="2m 15s"
          onNewPublish={handleNewPublish}
        />
      </main>

      {/* Enhanced Prism Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Main Prism Light Rays */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-red-400/60 via-transparent to-transparent transform rotate-12 animate-pulse-glow"></div>
          <div className="absolute top-0 left-1/3 w-1 h-full bg-gradient-to-b from-orange-400/60 via-transparent to-transparent transform rotate-6 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-yellow-400/60 via-transparent to-transparent transform -rotate-3 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-green-400/60 via-transparent to-transparent transform -rotate-12 animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-blue-400/60 via-transparent to-transparent transform -rotate-6 animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-0 right-1/5 w-1 h-full bg-gradient-to-b from-purple-400/60 via-transparent to-transparent transform rotate-3 animate-pulse-glow" style={{ animationDelay: '2.5s' }}></div>
        </div>

        {/* Floating Prism Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 opacity-20 animate-float">
          <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 transform rotate-45 rounded-lg backdrop-blur-sm"></div>
        </div>
        <div className="absolute top-1/3 right-32 w-24 h-24 opacity-25 animate-float" style={{ animationDelay: '1s' }}>
          <div className="w-full h-full bg-gradient-to-tl from-cyan-400/40 to-purple-400/40 transform rotate-12 rounded-lg backdrop-blur-sm"></div>
        </div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 opacity-30 animate-float" style={{ animationDelay: '2s' }}>
          <div className="w-full h-full bg-gradient-to-tr from-pink-400/40 to-orange-400/40 transform -rotate-30 rounded-lg backdrop-blur-sm"></div>
        </div>

        {/* Large Spectrum Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-float">
          <div className="w-full h-full bg-rainbow opacity-20 blur-3xl"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full animate-float" style={{ animationDelay: '3s' }}>
          <div className="w-full h-full bg-prism opacity-25 blur-3xl"></div>
        </div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full animate-float" style={{ animationDelay: '1.5s' }}>
          <div className="w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        </div>

        {/* Dispersed Light Particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-2 h-2 rounded-full animate-pulse-glow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(${i * 30} 70% 60%)`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: 0.6
              }}
            ></div>
          ))}
        </div>

        {/* Central Prism Triangle */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 opacity-10 animate-float">
          <div className="w-0 h-0 border-l-20 border-r-20 border-b-32 border-l-transparent border-r-transparent border-b-white/30 transform rotate-0"></div>
        </div>

        {/* Crosshatch Light Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-45"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
