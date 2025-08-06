import { Zap, Triangle, LogOut, User } from "lucide-react";
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full py-8 px-6 mb-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card p-8 prism-light-effect">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-16 h-16 bg-prism rounded-2xl flex items-center justify-center animate-enhanced-glow hover-lift">
                  <Triangle className="w-8 h-8 text-white transform transition-transform group-hover:rotate-180 duration-700" />
                </div>
                <div className="absolute inset-0 bg-rainbow opacity-30 rounded-2xl blur-md animate-pulse-glow"></div>
                <div className="absolute -inset-2 bg-gradient-conic from-purple-400 via-pink-400 to-purple-400 rounded-3xl opacity-20 blur-xl animate-prism-rotate"></div>
              </div>
              <div className="space-y-1">
                <h1 className="text-4xl font-bold text-rainbow tracking-tight">PostPrism AI</h1>
                <p className="text-muted-foreground text-base max-w-md">
                  Intelligent Social Media Publishing Through Advanced AI Prism Technology
                </p>
              </div>
            </div>

            {/* Navigation and User Profile */}
            <div className="flex items-center space-x-6">
              {/* Back to Landing */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/landing'}
                className="glass border-white/20 hover:border-white/40 text-white hover:bg-white/10"
              >
                ← Back to Landing
              </Button>
              {/* Value Proposition */}
              <div className="hidden lg:flex items-center space-x-3 glass rounded-2xl px-6 py-4 hover-lift">
                <div className="w-10 h-10 bg-prism rounded-xl flex items-center justify-center animate-pulse-glow">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-white">Real-Time AI Agent</div>
                  <div className="text-xs text-muted-foreground">Watch automation in action</div>
                </div>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 glass rounded-2xl px-4 py-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-prism text-white">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-white">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={signOut}
                  className="glass border-white/20 hover:border-white/40 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
