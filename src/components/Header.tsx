import { Zap, Triangle } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-12 px-6 mb-16 relative">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-12 prism-nexus hover-elevate">
          <div className="flex items-center justify-between">
            {/* Revolutionary Logo and Brand */}
            <div className="flex items-center space-x-8">
              <div className="relative group">
                <div className="w-20 h-20 bg-aurora rounded-3xl flex items-center justify-center animate-aurora hover-elevate group-hover:scale-110 transition-all duration-700">
                  <Triangle className="w-10 h-10 text-white transform transition-all duration-1000 group-hover:rotate-180" />
                </div>
                <div className="absolute inset-0 bg-cosmic opacity-40 rounded-3xl blur-lg animate-cosmic-drift"></div>
                <div className="absolute -inset-4 bg-prismatic opacity-20 rounded-full blur-2xl animate-prismatic-rotation"></div>
                <div className="absolute -inset-6 border border-white/10 rounded-full animate-prismatic-glow"></div>
              </div>
              <div className="space-y-2">
                <h1 className="text-hero text-aurora font-black tracking-tight">
                  PostPrism AI
                </h1>
                <p className="text-subtitle text-muted-foreground max-w-lg leading-relaxed">
                  Revolutionary AI-Powered Social Media Publishing Through Advanced Prismatic Technology
                </p>
              </div>
            </div>

            {/* Ultra-Premium Value Proposition */}
            <div className="hidden lg:flex items-center space-x-4 glass rounded-3xl px-8 py-6 hover-elevate group">
              <div className="w-12 h-12 bg-cosmic rounded-2xl flex items-center justify-center animate-aurora group-hover:scale-110 transition-all duration-500">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-left space-y-1">
                <div className="text-lg font-bold text-cosmic bg-clip-text text-transparent">
                  Neural AI Agent
                </div>
                <div className="text-sm text-muted-foreground">
                  Watch intelligence in motion
                </div>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-2"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;