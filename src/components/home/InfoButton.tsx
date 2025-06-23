
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface InfoButtonProps {
  theme: 'day' | 'night';
  uiColor: string;
  blendedButtonClasses: string;
  isFirstVisit?: boolean;
}

interface BaseInstructions {
  primary: string;
  secondary: string;
  tertiary: string;
}

interface FirstVisitInstructions extends BaseInstructions {
  welcome: string;
}

const InfoButton = ({ theme, uiColor, blendedButtonClasses, isFirstVisit = false }: InfoButtonProps) => {
  const isMobile = useIsMobile();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [showOnboardingPulse, setShowOnboardingPulse] = useState(false);

  // Show subtle onboarding hint for first-time visitors
  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setShowOnboardingPulse(true);
        
        // Auto-hide pulse after a few seconds
        const hideTimer = setTimeout(() => {
          setShowOnboardingPulse(false);
        }, 5000);
        
        return () => clearTimeout(hideTimer);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOnboardingPulse(false);
    
    if (isMobile) {
      setIsTooltipOpen(!isTooltipOpen);
    }
  };

  const getInstructions = (): BaseInstructions | FirstVisitInstructions => {
    const baseInstructions: BaseInstructions = {
      primary: isMobile 
        ? "Drag to look around, pinch to zoom"
        : "Click and drag to explore, scroll to zoom",
      secondary: isMobile
        ? "Use navigation arrows to discover new worlds"
        : "Press N/P or use arrows to travel between worlds",
      tertiary: isMobile
        ? "Tap the theme button to switch day/night"
        : "Press Space or theme button to toggle day/night"
    };

    if (isFirstVisit) {
      return {
        ...baseInstructions,
        welcome: "Welcome to your journey through immersive worlds!"
      };
    }

    return baseInstructions;
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
              className={`${blendedButtonClasses} transition-all duration-300 ${
                showOnboardingPulse ? 'animate-pulse ring-2 ring-blue-400/50' : ''
              } ${
                isMobile 
                  ? 'w-12 h-12 active:scale-95'
                  : 'w-10 h-10 hover:scale-105'
              }`}
              size="icon"
              aria-label="Information and Controls"
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
              {isFirstVisit && 'welcome' in instructions && (
                <div className="flex items-start gap-2 pb-2 border-b border-gray-200/20">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    theme === 'day' ? 'bg-blue-500' : 'bg-blue-400'
                  }`} />
                  <p className="text-sm font-semibold leading-relaxed">
                    {instructions.welcome}
                  </p>
                </div>
              )}
              
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
              
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  theme === 'day' ? 'bg-emerald-500' : 'bg-blue-400'
                }`} />
                <p className="text-sm leading-relaxed opacity-90">
                  {instructions.tertiary}
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
