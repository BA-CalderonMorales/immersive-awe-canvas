
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
          <TooltipContent side="right" className="max-w-xs">
            <div className="text-sm space-y-1">
              <p>Click anywhere or press Enter to begin your journey</p>
              <p>Press Space to toggle between day and night themes</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default InfoButton;
