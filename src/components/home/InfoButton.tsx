
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface InfoButtonProps {
  theme: 'day' | 'night';
  uiColor: string;
  blendedButtonClasses: string;
}

const InfoButton = ({ theme, uiColor, blendedButtonClasses }: InfoButtonProps) => {
  const isMobile = useIsMobile();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      // On mobile, toggle tooltip visibility when clicked
      setIsTooltipOpen(!isTooltipOpen);
    }
  };

  // Device-appropriate messaging
  const getInstructions = () => {
    if (isMobile) {
      return {
        primary: "Tap anywhere on the screen to begin your journey",
        secondary: "Use the theme button (top right) to switch between day and night"
      };
    } else {
      return {
        primary: "Click anywhere or press Enter to begin your journey",
        secondary: "Press Space or use the theme button to toggle between day and night"
      };
    }
  };

  const instructions = getInstructions();

  return (
    <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-20 pointer-events-auto">
      <TooltipProvider>
        <Tooltip open={isMobile ? isTooltipOpen : undefined}>
          <TooltipTrigger asChild>
            <Button
              style={{ color: uiColor }}
              onClick={handleClick}
              className={`${blendedButtonClasses} transition-all duration-300 animate-fade-in ${
                isMobile 
                  ? 'w-12 h-12 active:scale-95' // Larger touch target on mobile with press feedback
                  : 'w-10 h-10 hover:scale-105' // Slightly smaller on desktop with hover effect
              }`}
              size="icon"
              aria-label="Information"
            >
              <Info className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            className={`max-w-xs p-4 rounded-lg shadow-2xl border-0 ${
              theme === 'day' 
                ? 'bg-white/95 text-gray-800 backdrop-blur-md' 
                : 'bg-gray-900/95 text-gray-100 backdrop-blur-md'
            }`}
            sideOffset={8}
          >
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'day' ? 'bg-emerald-500' : 'bg-blue-400'
                }`} />
                <p className="text-sm font-medium leading-relaxed">
                  {instructions.primary}
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'day' ? 'bg-emerald-500' : 'bg-blue-400'
                }`} />
                <p className="text-sm leading-relaxed opacity-90">
                  {instructions.secondary}
                </p>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default InfoButton;
