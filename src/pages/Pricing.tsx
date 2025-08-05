import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Check, Star, Zap } from 'lucide-react';

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background prism-light-effect">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PostPrism AI
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-slate-600 hover:text-primary transition-colors">Home</Link>
              <Link to="/features" className="text-slate-600 hover:text-primary transition-colors">Features</Link>
              <Link to="/about" className="text-slate-600 hover:text-primary transition-colors">About</Link>
              <Link to="/pricing" className="text-primary font-semibold">Pricing</Link>
              <Link to="/" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                Try PostPrism AI <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Simple, Transparent
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              Pricing
            </span>
          </h1>
           <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
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
                <p className="text-slate-600 dark:text-slate-300">Perfect for testing and small creators</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">5 posts per month</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">3 social platforms</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Basic AI adaptation</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Live agent streaming</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Email support</span>
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
                <p className="text-slate-600 dark:text-slate-300">For content creators and small businesses</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">200 posts per month</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">All social platforms</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Advanced AI adaptation</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Real-time agent streaming</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Image generation</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Analytics & insights</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Priority support</span>
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
                <p className="text-slate-600 dark:text-slate-300">For agencies and large organizations</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Unlimited posts</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">All platforms + future releases</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Custom AI models</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Multi-user team access</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">Advanced analytics</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">API access</span>
                 </li>
                 <li className="flex items-center space-x-3">
                   <Check className="h-5 w-5 text-primary flex-shrink-0" />
                   <span className="text-slate-700 dark:text-slate-300">24/7 phone support</span>
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
             <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
               Core features that come with every PostPrism AI subscription.
             </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Content Adaptation</h3>
               <p className="text-slate-600 dark:text-slate-300">Intelligent content optimization for each platform</p>
             </div>

             <div className="text-center">
               <div className="w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-4 mx-auto">
                 <Sparkles className="h-8 w-8 text-white" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Live Agent Streaming</h3>
               <p className="text-slate-600 dark:text-slate-300">Watch AI agents work in real-time</p>
             </div>

             <div className="text-center">
               <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mb-4 mx-auto">
                 <Check className="h-8 w-8 text-white" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Multi-Platform Publishing</h3>
               <p className="text-slate-600 dark:text-slate-300">Simultaneous posting across all platforms</p>
             </div>

             <div className="text-center">
               <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-4 mx-auto">
                 <Star className="h-8 w-8 text-white" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
               <p className="text-slate-600 dark:text-slate-300">Detailed insights and optimization metrics</p>
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
               <p className="text-slate-600 dark:text-slate-300">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.</p>
             </div>

             <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Is there a free trial?</h3>
               <p className="text-slate-600 dark:text-slate-300">Absolutely! All paid plans come with a 14-day free trial. No credit card required to start, and you can cancel anytime.</p>
             </div>

             <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">What happens if I exceed my post limit?</h3>
               <p className="text-slate-600 dark:text-slate-300">We'll notify you when you're approaching your limit. You can upgrade your plan or purchase additional posts for the current month.</p>
             </div>

             <div className="glass-card p-6 rounded-xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Do you support custom integrations?</h3>
               <p className="text-slate-600 dark:text-slate-300">Enterprise plans include API access and custom integrations. Contact our sales team to discuss your specific requirements.</p>
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
           <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
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

       {/* Advanced Optical Prism Background - Same as Index */}
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

export default Pricing;