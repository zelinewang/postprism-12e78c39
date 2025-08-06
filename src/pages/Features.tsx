import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Target, Users, Eye, Brain, Rocket, Shield } from 'lucide-react';

const PrismLogo = () => (
  <div className="relative w-8 h-8 animate-prism-rotate">
    <img
      src="/lovable-uploads/88784487-172c-4e13-87e3-3ecd85d7d29d.png"
      alt="PostPrism AI"
      className="w-full h-full object-contain filter drop-shadow-lg"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-500/20 to-cyan-400/20 rounded-lg blur-md -z-10 animate-glow"></div>
  </div>
);

const Features = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-4">
              <PrismLogo />
              <span className="text-2xl font-bold text-rainbow">PostPrism AI</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">Home</Link>
              <Link to="/features" className="text-emerald-400 font-semibold">Features</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">About</Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">Pricing</Link>
              <Link to="/app">
                <Button className="btn-prism">
                  Try PostPrism AI <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Powerful Features for
            <br />
            <span className="text-rainbow animate-pulse-glow">
              Modern Creators
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-up">
            Discover the cutting-edge capabilities that make PostPrism AI the ultimate social media automation platform.
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* AI Content Adaptation */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Content Adaptation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Advanced AI models including Claude and GPT-4 work together to adapt your content for each platform's unique audience, tone, and requirements.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• LinkedIn: Professional tone with industry insights</li>
                <li>• Twitter: Concise, engaging with trending elements</li>
                <li>• Instagram: Visual storytelling with emotional appeal</li>
              </ul>
            </div>

            {/* Real-time Agent Streaming */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Live Agent Streaming</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Watch AI agents work in real-time through live video streams. See every click, type, and interaction as your content gets published.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• Real-time video streaming</li>
                <li>• Step-by-step action logging</li>
                <li>• Multi-platform parallel processing</li>
              </ul>
            </div>

            {/* AgentS2 Automation */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AgentS2 Automation</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Powered by state-of-the-art AgentS2 technology for precise UI automation and intelligent computer interaction.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• 98% UI detection accuracy</li>
                <li>• Smart error recovery</li>
                <li>• Cross-platform compatibility</li>
              </ul>
            </div>

            {/* Multi-Platform Publishing */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Multi-Platform Publishing</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Seamlessly publish to LinkedIn, Twitter, and Instagram with platform-specific optimizations and formatting.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• Simultaneous multi-platform posting</li>
                <li>• Platform-specific hashtag optimization</li>
                <li>• Image generation for Instagram</li>
              </ul>
            </div>

            {/* Performance Analytics */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Performance Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Get detailed insights on your content performance, AI optimization metrics, and publishing analytics.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• AI optimization insights</li>
                <li>• Publishing success rates</li>
                <li>• Performance recommendations</li>
              </ul>
            </div>

            {/* Enterprise Security */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Bank-level security with encrypted sessions, secure authentication, and comprehensive data protection.
              </p>
              <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <li>• End-to-end encryption</li>
                <li>• Secure session management</li>
                <li>• GDPR compliance ready</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Technical Excellence
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Built with cutting-edge technology stack for maximum performance and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">AI Technology Stack</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Anthropic Claude API for professional content</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">OpenAI GPT-4 for creative optimization</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">DALL-E integration for image generation</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">AgentS2 for computer automation</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Platform Architecture</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">React + TypeScript frontend</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-secondary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Python Flask backend with WebSocket</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">ORGO cloud infrastructure</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Real-time video streaming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Experience the Future of Social Media
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join the revolution and see how AI can transform your content strategy.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Using PostPrism AI
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Features;
