
import { useState, useEffect } from "react";
import { useInstructions } from "@/hooks/useInstructions";
import InfoTooltip from "./InfoTooltip";
import TopBarActions from "./TopBarActions";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Home } from "lucide-react";

interface TopBarProps {
  worldName: string;
  uiColor: string;
  onToggleUiHidden: () => void;
  onToggleTheme: () => void;
  theme: 'day' | 'night';
  onGoHome: () => void;
  isTransitioning: boolean;
  isMobile: boolean;
  onShowHelp: () => void;
}

const TopBar = ({ 
  worldName, 
  uiColor, 
  onToggleUiHidden, 
  onToggleTheme, 
  theme, 
  onGoHome, 
  isTransitioning, 
  isMobile, 
  onShowHelp 
}: TopBarProps) => {
  const blendedButtonClasses = "border bg-black/70 hover:bg-black/90 backdrop-blur-sm shadow-lg";
  
  // Use scene-specific UI colors for proper contrast
  const uiStyle = { color: uiColor, borderColor: uiColor };

  // Simple state management - always show buttons
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [showOnboardingPulse, setShowOnboardingPulse] = useState(false);

  const instructions = useInstructions(isFirstVisit, isMobile);

  // Check for first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedExperience');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedExperience', 'true');
      
      // Show onboarding pulse after a short delay
      setTimeout(() => {
        setShowOnboardingPulse(true);
        
        // Hide pulse after 5 seconds
        setTimeout(() => {
          setShowOnboardingPulse(false);
        }, 5000);
      }, 2000);
    }
  }, []);

  return (
    <div 
      style={uiStyle} 
      className={`absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-start z-10 transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-2 pointer-events-auto flex-1 min-w-0 mr-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              onClick={onGoHome}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Go Home"
            >
              <Home />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go Home (G)</p>
          </TooltipContent>
        </Tooltip>

        {!isMobile && (
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold h-8 sm:h-10 flex items-center truncate flex-shrink min-w-0">
            {worldName}
          </h2>
        )}
        
        <InfoTooltip 
          uiStyle={uiStyle}
          blendedButtonClasses={blendedButtonClasses}
          showOnboardingPulse={showOnboardingPulse}
          isInfoTooltipOpen={isInfoTooltipOpen}
          setIsInfoTooltipOpen={setIsInfoTooltipOpen}
          setShowOnboardingPulse={setShowOnboardingPulse}
          isMobile={isMobile}
          instructions={instructions}
          theme={theme}
        />
      </div>
      
      <TopBarActions 
        uiStyle={uiStyle}
        blendedButtonClasses={blendedButtonClasses}
        onToggleUiHidden={onToggleUiHidden}
        onToggleTheme={onToggleTheme}
        theme={theme}
      />
    </div>
  );
};

export default TopBar;
