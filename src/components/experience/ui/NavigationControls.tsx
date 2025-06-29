
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationControlsProps {
  uiColor: string;
  onChangeWorld: (direction: 'next' | 'prev') => void;
  isTransitioning: boolean;
  theme: 'day' | 'night';
}

const NavigationControls = ({ uiColor, onChangeWorld, isTransitioning, theme }: NavigationControlsProps) => {
  // Improved button classes with better contrast
  const blendedButtonClasses = theme === 'day' 
    ? "border border-gray-300 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
    : "border bg-black/70 hover:bg-black/90 backdrop-blur-sm shadow-lg";
  
  // Use scene-specific UI colors for border only
  const uiStyle = { borderColor: uiColor };
  
  // For light theme, use white text; for dark theme, use the ui color
  const textStyle = { color: theme === 'day' ? '#ffffff' : uiColor };

  const buttonStyle = { ...uiStyle, ...textStyle };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            style={buttonStyle}
            onClick={() => onChangeWorld('prev')}
            className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 pointer-events-auto z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${blendedButtonClasses} text-white`}
            size="icon"
            aria-label="Previous World"
            disabled={isTransitioning}
          >
            <ArrowLeft />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Previous World (P)</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            style={buttonStyle}
            onClick={() => onChangeWorld('next')}
            className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 pointer-events-auto z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${blendedButtonClasses} text-white`}
            size="icon"
            aria-label="Next World"
            disabled={isTransitioning}
          >
            <ArrowRight />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Next World (N)</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};

export default NavigationControls;
