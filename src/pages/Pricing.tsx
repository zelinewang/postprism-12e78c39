import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Check, Star, Zap } from 'lucide-react';

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

const Pricing = () => {
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
        <div className="absolute top-1/5 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-1/5 w-80 h-80 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
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
              <Link to="/features" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">Features</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105">About</Link>
              <Link to="/pricing" className="text-emerald-400 font-semibold">Pricing</Link>
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
            Simple, Transparent
            <br />
            <span className="text-rainbow animate-pulse-glow">
              Pricing
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-up">
            Choose the perfect plan for your content creation needs. Start free and scale as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Free Plan */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Free
                </div>
                <p className="text-gray-600 dark:text-gray-300">Perfect for testing and small creators</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">5 posts per month</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">3 social platforms</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Basic AI adaptation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Live agent streaming</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Email support</span>
                </li>
              </ul>

              <Link to="/">
                <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-2 border-primary hover:shadow-xl transition-all duration-300 transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Most Popular
                </div>
              </div>

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Professional</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  $29<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">For content creators and small businesses</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">200 posts per month</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">All social platforms</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced AI adaptation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Real-time agent streaming</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Image generation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Analytics & insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Priority support</span>
                </li>
              </ul>

              <Link to="/">
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 hover:shadow-xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  $99<span className="text-lg text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300">For agencies and large organizations</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Unlimited posts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">All platforms + future releases</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Custom AI models</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Multi-user team access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">Advanced analytics</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">API access</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">24/7 phone support</span>
                </li>
              </ul>

              <Button className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white">
                Contact Sales
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              All Plans Include
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Core features that come with every PostPrism AI subscription.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Content Adaptation</h3>
              <p className="text-gray-600 dark:text-gray-300">Intelligent content optimization for each platform</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Live Agent Streaming</h3>
              <p className="text-gray-600 dark:text-gray-300">Watch AI agents work in real-time</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Multi-Platform Publishing</h3>
              <p className="text-gray-600 dark:text-gray-300">Simultaneous posting across all platforms</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">Detailed insights and optimization metrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Can I change plans anytime?</h3>
              <p className="text-gray-600 dark:text-gray-300">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
            </div>

            <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Is there a free trial?</h3>
              <p className="text-gray-600 dark:text-gray-300">Absolutely! All paid plans come with a 14-day free trial. No credit card required to start, and you can cancel anytime.</p>
            </div>

            <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">What happens if I exceed my post limit?</h3>
              <p className="text-gray-600 dark:text-gray-300">We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional posts for the current month.</p>
            </div>

            <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Do you support custom integrations?</h3>
              <p className="text-gray-600 dark:text-gray-300">Enterprise plans include API access and custom integrations. Contact our sales team to discuss your specific requirements.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of creators already using PostPrism AI to amplify their social media presence.
          </p>
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Your Free Trial
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
