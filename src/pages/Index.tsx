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

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
    </div>
  );
};

export default Index;
