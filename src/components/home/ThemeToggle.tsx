
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: 'day' | 'night';
  uiColor: string;
  onToggleTheme: () => void;
  blendedButtonClasses: string;
}

const ThemeToggle = ({ theme, uiColor, onToggleTheme, blendedButtonClasses }: ThemeToggleProps) => {
  return (
    <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 pointer-events-auto">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            style={{ color: uiColor }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleTheme();
            }}
            className={`${blendedButtonClasses} transition-all duration-300 animate-fade-in`}
            size="icon"
            aria-label="Toggle Theme"
          >
            {theme === 'day' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Theme (Space)</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle;
