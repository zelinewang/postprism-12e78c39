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
    <div className="min-h-screen bg-background prism-nexus">
      <Header />
      
      <main className="space-y-12 relative z-10">
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
