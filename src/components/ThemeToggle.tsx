import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="glass w-12 h-12 p-0 rounded-xl hover:scale-110 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="relative z-10">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      
      {/* Aurora animation background */}
      <div className="absolute inset-0 bg-aurora opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20"></div>
      </div>
      
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}