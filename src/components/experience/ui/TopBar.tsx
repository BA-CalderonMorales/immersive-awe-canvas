
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
  isSettingsOpen?: boolean;
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
  onShowHelp,
  isSettingsOpen = false
}: TopBarProps) => {
  // Improved button classes with better contrast
  const blendedButtonClasses = theme === 'day' 
    ? "border border-gray-300 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm shadow-lg"
    : "border bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm shadow-lg";
  
  // Use scene-specific UI colors for border only
  const uiStyle = { borderColor: uiColor };
  
  // For light theme, use dark text; for dark theme, use the ui color
  const textStyle = theme === 'day' ? { color: '#1f2937' } : { color: uiColor };

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

  const buttonStyle = { ...uiStyle, ...textStyle };

  return (
    <div 
      style={textStyle} 
      className={`absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-start transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      } ${isSettingsOpen ? 'z-10' : 'z-50'}`}
    >
      <div className="flex items-center gap-2 pointer-events-auto flex-1 min-w-0 mr-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={buttonStyle}
              onClick={onGoHome}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Go Home"
            >
              <Home className="w-4 h-4" />
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
          uiStyle={buttonStyle}
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
        uiStyle={buttonStyle}
        blendedButtonClasses={blendedButtonClasses}
        onToggleUiHidden={onToggleUiHidden}
        onToggleTheme={onToggleTheme}
        theme={theme}
      />
    </div>
  );
};

export default TopBar;
