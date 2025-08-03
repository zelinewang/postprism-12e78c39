import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ContentInput from "@/components/ContentInput";
import LiveStreamViewer from "@/components/LiveStreamViewer";
import PublishResults from "@/components/PublishResults";
import AuroraBackground from "@/components/AuroraBackground";
import ThemeToggle from "@/components/ThemeToggle";

type AppState = 'input' | 'processing' | 'streaming' | 'results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('input');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [originalContent, setOriginalContent] = useState('');
  const [publishResults, setPublishResults] = useState<any[]>([]);
  const [isDark, setIsDark] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

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
    <div className="min-h-screen relative">
      {/* Aurora Background */}
      <AuroraBackground isDark={isDark} />
      
      {/* Theme Toggle */}
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      
      <Header />
      
      <main className="space-y-8 relative z-10">
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

    </div>
  );
};

export default Index;
