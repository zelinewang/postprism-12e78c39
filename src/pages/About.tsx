import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Users, Target, Award, Globe, Zap } from 'lucide-react';

const About = () => {
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
              <Link to="/about" className="text-primary font-semibold">About</Link>
              <Link to="/pricing" className="text-slate-600 hover:text-primary transition-colors">Pricing</Link>
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
            Redefining Social Media
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
              with AI Innovation
            </span>
          </h1>
           <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto">
             We're building the future of content creation where artificial intelligence meets human creativity 
             to amplify your voice across every platform.
           </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
               <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">
                 To democratize social media success by making advanced AI automation accessible to creators, 
                 businesses, and individuals worldwide.
               </p>
               <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Like a prism that splits white light into a beautiful spectrum, PostPrism AI takes your single 
                piece of content and refracts it into perfectly optimized versions for each social platform, 
                each with its own unique characteristics and appeal.
              </p>
              <Link to="/">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 text-lg rounded-xl">
                  Experience Our Vision
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">98%</div>
                     <div className="text-sm text-slate-600 dark:text-slate-300">Automation Accuracy</div>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-bold text-secondary mb-2">3x</div>
                     <div className="text-sm text-slate-600 dark:text-slate-300">Faster Publishing</div>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                     <div className="text-sm text-slate-600 dark:text-slate-300">AI Availability</div>
                   </div>
                   <div className="text-center">
                     <div className="text-3xl font-bold text-primary mb-2">∞</div>
                     <div className="text-sm text-slate-600 dark:text-slate-300">Creative Possibilities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Our Core Values
            </h2>
             <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
               The principles that guide everything we build and every decision we make.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Innovation First</h3>
               <p className="text-slate-600 dark:text-slate-300">
                 We push the boundaries of what's possible with AI, always staying ahead of the curve 
                 in social media automation technology.
               </p>
            </div>

            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User-Centric</h3>
               <p className="text-slate-600 dark:text-slate-300">
                 Every feature we build starts with understanding our users' needs and creating 
                 solutions that truly make their lives easier.
               </p>
            </div>

            <div className="glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Global Impact</h3>
               <p className="text-slate-600 dark:text-slate-300">
                 We believe in democratizing access to powerful tools, helping creators worldwide 
                 amplify their voices and reach their audiences.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Cutting-Edge Technology
            </h2>
             <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
               Built on the latest advances in artificial intelligence and automation technology.
             </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                The Science Behind PostPrism
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI Content Adaptation</h4>
                   <p className="text-slate-600 dark:text-slate-300">
                     Our multi-model AI system combines Anthropic's Claude for professional content and 
                     OpenAI's GPT-4 for creative optimization, ensuring perfect platform adaptation.
                   </p>
                 </div>
                 <div>
                   <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AgentS2 Automation</h4>
                   <p className="text-slate-600 dark:text-slate-300">
                     Powered by state-of-the-art computer vision and UI automation, our AgentS2 technology 
                     achieves 98% accuracy in complex web interactions.
                   </p>
                 </div>
                 <div>
                   <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Streaming</h4>
                   <p className="text-slate-600 dark:text-slate-300">
                     Watch AI agents work in real-time through our advanced WebSocket streaming technology, 
                     providing complete transparency in the automation process.
                   </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
              <div className="relative glass-card p-8 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">OSWorld Ranking #3</div>
                       <div className="text-sm text-slate-600 dark:text-slate-300">AgentS2 Performance</div>
                     </div>
                   </div>
                   <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                       <Target className="h-6 w-6 text-white" />
                     </div>
                     <div>
                       <div className="font-bold text-gray-900 dark:text-white">Windows Agent Arena #1</div>
                       <div className="text-sm text-slate-600 dark:text-slate-300">UI Automation Excellence</div>
                     </div>
                   </div>
                   <div className="flex items-center space-x-4">
                     <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center">
                       <Sparkles className="h-6 w-6 text-white" />
                     </div>
                     <div>
                       <div className="font-bold text-gray-900 dark:text-white">Multi-AI Integration</div>
                       <div className="text-sm text-slate-600 dark:text-slate-300">Claude + GPT-4 + DALL-E</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Built by Innovators
          </h2>
           <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto">
             Our team combines expertise in AI research, software engineering, and social media marketing 
             to create the ultimate content automation platform.
           </p>
          
          <div className="glass-card p-12 rounded-2xl backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border border-white/20 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">5+</div>
                 <div className="text-slate-600 dark:text-slate-300">Years AI Experience</div>
               </div>
               <div>
                 <div className="text-4xl font-bold text-secondary mb-2">100K+</div>
                 <div className="text-slate-600 dark:text-slate-300">Posts Automated</div>
               </div>
               <div>
                 <div className="text-4xl font-bold text-accent mb-2">24/7</div>
                 <div className="text-slate-600 dark:text-slate-300">Innovation Never Stops</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Join the Revolution?
          </h2>
           <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
             Be part of the future of social media automation and see your content reach new heights.
           </p>
          <Link to="/">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-12 py-6 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Your Journey
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

export default About;