import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Target, Users, Play, Eye, Bot, Layers, ChevronDown, Star, CheckCircle, Globe } from 'lucide-react';

const PrismLogo = () => (
  <div className="relative w-12 h-12 animate-prism-rotate">
    <img
      src="/lovable-uploads/88784487-172c-4e13-87e3-3ecd85d7d29d.png"
      alt="PostPrism AI"
      className="w-full h-full object-contain filter drop-shadow-lg"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-500/20 to-pink-400/20 rounded-lg blur-md -z-10 animate-glow"></div>
  </div>
);

const InteractiveDots = () => {
  const [dots, setDots] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const newDots = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4
    }));
    setDots(newDots);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {dots.map(dot => (
        <div
          key={dot.id}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse-glow"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            animationDelay: `${dot.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, gradient, delay }: {
  icon: any;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) => (
  <div
    className={`p-8 hover-lift prism-light-effect animate-slide-up scroll-reveal magnetic-hover relative overflow-hidden`}
    style={{
      animationDelay: `${delay}ms`,
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.08) 50%, rgba(147, 51, 234, 0.1) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
    }}
  >
    <div className="relative z-10">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto animate-float relative overflow-hidden"
           style={{
             background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(6, 182, 212, 0.8) 50%, rgba(147, 51, 234, 0.8) 100%)',
             boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
           }}>
        <Icon className="h-8 w-8 text-white relative z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
      </div>
      <h3 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">{title}</h3>
      <p className="text-muted-foreground text-lg text-center leading-relaxed">
        {description}
      </p>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
  </div>
);

const StepCard = ({ number, title, description, delay }: {
  number: number;
  title: string;
  description: string;
  delay: number;
}) => (
  <div
    className="text-center animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-20 h-20 bg-prism rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-2xl animate-glow">
      {number}
    </div>
    <h3 className="text-2xl font-bold text-foreground mb-4">{title}</h3>
    <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
      {description}
    </p>
  </div>
);

const MetricCard = ({ label, value, suffix = "", delay }: {
  label: string;
  value: string;
  suffix?: string;
  delay: number;
}) => (
  <div
    className="p-6 text-center hover-lift animate-slide-up scroll-reveal magnetic-hover relative overflow-hidden"
    style={{
      animationDelay: `${delay}ms`,
      background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(20, 184, 166, 0.3)',
      borderRadius: '20px',
      boxShadow: '0 20px 40px -12px rgba(20, 184, 166, 0.3)'
    }}
  >
    <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent animate-pulse-glow">
      {value}<span className="text-emerald-400">{suffix}</span>
    </div>
    <div className="text-slate-300">{label}</div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
  </div>
);

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);

    // Handle scroll animations
    const handleScroll = () => {
      const newScrollY = window.scrollY;
      setScrollY(newScrollY);

      // Reveal elements on scroll
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
    };

    // Handle mouse movement for magnetic effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Update CSS custom properties for parallax
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
      document.documentElement.style.setProperty('--scroll-y', `${scrollY * 0.5}px`);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <InteractiveDots />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <PrismLogo />
              <span className="text-2xl font-bold text-rainbow">
                PostPrism AI
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
                Features
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
                About
              </Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">
                Pricing
              </Link>
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
      <section ref={heroRef} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Enhanced background with parallax */}
        <div className="absolute inset-0 parallax-slow">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float-delayed" style={{ "--delay": "0s" } as any}></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-float-delayed" style={{ "--delay": "2s" } as any}></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-3xl animate-float-delayed" style={{ "--delay": "4s" } as any}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 relative overflow-hidden animate-shimmer magnetic-hover"
                   style={{
                     background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 50%, rgba(147, 51, 234, 0.15) 100%)',
                     border: '1px solid rgba(16, 185, 129, 0.3)',
                     backdropFilter: 'blur(20px)',
                     boxShadow: '0 8px 32px rgba(16, 185, 129, 0.2)'
                   }}>
                <Star className="h-4 w-4 text-emerald-400 animate-pulse-glow" />
                <span className="text-sm font-medium bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  World's First Real-Time AI Observatory
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight">
              Watch AI
              <br />
              <span className="text-rainbow animate-pulse-glow">
                Automate Your Life
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform one piece of content into perfectly optimized posts for LinkedIn, Twitter, and Instagram.
              <span className="text-accent font-semibold"> Watch AI agents work in real-time</span> as they publish across all platforms simultaneously.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link to="/app">
                <Button size="lg" className="btn-prism text-xl px-12 py-6">
                  <Eye className="mr-3 h-6 w-6" />
                  Watch AI in Action
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="glass border-primary/30 text-xl px-12 py-6 hover:border-primary/60 hover:bg-primary/10 transition-all duration-500"
                onClick={() => window.open('https://drive.google.com/file/d/1VQ-ryiUvUobjEwkwRCKIvOA-i2ifnabP/view?usp=sharing', '_blank')}
              >
                <Play className="mr-3 h-6 w-6" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 parallax-medium">
            <MetricCard label="Faster Publishing" value="3x" delay={200} />
            <MetricCard label="Success Rate" value="98.7" suffix="%" delay={400} />
            <MetricCard label="Platforms" value="3" delay={600} />
            <MetricCard label="Seconds to Publish" value="120" delay={800} />
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Revolutionary <span className="text-primary">AI Transparency</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The first platform where you can watch AI think, decide, and execute in real-time.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20 parallax-fast">
            <FeatureCard
              icon={Eye}
              title="Real-Time AI Observatory"
              description="Watch AI agents work simultaneously across all platforms. See every click, decision, and optimization as it happens."
              gradient=""
              delay={0}
            />
            <FeatureCard
              icon={Bot}
              title="SOTA Agent S2.5"
              description="Powered by the latest computer-use agent technology with custom optimizations for social media automation."
              gradient=""
              delay={200}
            />
            <FeatureCard
              icon={Zap}
              title="Parallel Architecture"
              description="True parallelism with ORGO Cloud VMs. 3x faster than sequential publishing with dedicated environments."
              gradient=""
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 glass-card mx-4 lg:mx-8 rounded-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              How <span className="text-rainbow">PostPrism</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple, powerful, and transparent. Transform your content in three revolutionary steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number={1}
              title="Input Your Content"
              description="Enter your original content and select target platforms. Our AI understands context and audience preferences."
              delay={0}
            />
            <StepCard
              number={2}
              title="Watch AI Adapt"
              description="Observe in real-time as AI adapts your content for each platform's unique style, tone, and requirements."
              delay={200}
            />
            <StepCard
              number={3}
              title="Simultaneous Publishing"
              description="Watch AI agents automatically publish across all platforms simultaneously with 120-second execution time."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Multi-Platform <span className="text-accent">Excellence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each platform gets content perfectly optimized for its audience and format.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="platform-linkedin glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">LinkedIn</h3>
              <p className="text-muted-foreground">Professional tone, industry insights, and thought leadership content optimized for business networking.</p>
            </div>

            <div className="platform-twitter glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Twitter</h3>
              <p className="text-muted-foreground">Engaging, concise content with trending hashtags and optimal character count for maximum reach.</p>
            </div>

            <div className="platform-instagram glass-card p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Instagram</h3>
              <p className="text-muted-foreground">Visual storytelling with emotional appeal, perfect hashtags, and engaging captions for social discovery.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 prism-light-effect">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Ready to revolutionize your social media?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the AI transparency revolution. Watch intelligence work for you.
            </p>
            <Link to="/app">
              <Button size="lg" className="btn-prism text-xl px-16 py-8">
                <Sparkles className="mr-3 h-6 w-6" />
                Start Watching AI
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 backdrop-blur-xl border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <PrismLogo />
                <span className="text-xl font-bold text-rainbow">PostPrism AI</span>
              </div>
              <p className="text-muted-foreground">
                Revolutionary AI transparency platform powered by cutting-edge automation technology.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Live Demo</Link></li>
                <li><Link to="/about" className="hover:text-foreground transition-colors">Technology</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="https://github.com/zelinewang/postprism-12e78c39/blob/main/README.md#%EF%B8%8F-complete-setup-guide" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Setup Guide</a></li>
                <li><a href="https://github.com/zelinewang/postprism-12e78c39" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Source Code</a></li>
                <li><a href="https://drive.google.com/file/d/1VQ-ryiUvUobjEwkwRCKIvOA-i2ifnabP/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Video Demo</a></li>
                <li><a href="https://docs.orgo.ai/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">ORGO AI</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 PostPrism AI. All rights reserved. Powered by ORGO AI & Agent S2.5</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
