import { Zap, Triangle } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-6 mb-8">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-prism rounded-xl flex items-center justify-center animate-glow">
                  <Triangle className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-rainbow opacity-20 rounded-xl blur-sm"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-rainbow">PostPrism AI</h1>
                <p className="text-muted-foreground text-sm">
                  Intelligent Social Media Publishing Through AI Prism Technology
                </p>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="hidden lg:flex items-center space-x-2 glass rounded-xl px-4 py-2">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium">
                Watch AI Agent Work in Real-Time
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;