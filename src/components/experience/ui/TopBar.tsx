
import { useState, useEffect } from "react";
import { useInstructions } from "@/hooks/useInstructions";
import LikeDialog from "./LikeDialog";
import InfoTooltip from "./InfoTooltip";
import TopBarActions from "./TopBarActions";

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
  const blendedButtonClasses = "border-0 bg-black/40 hover:bg-black/60 dark:bg-white/40 dark:hover:bg-white/60";
  
  // Use black text in day mode for better visibility against bright backgrounds
  const textColor = theme === 'day' ? '#000000' : uiColor;
  const uiStyle = { color: textColor };

  // Simplified state management
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [showOnboardingPulse, setShowOnboardingPulse] = useState(false);

  const instructions = useInstructions(isFirstVisit, isMobile);

  // Initialize first visit state only once on mount
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedExperience');
    if (!hasVisited) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedExperience', 'true');
      
      // Show onboarding pulse for first-time visitors
      const timer = setTimeout(() => {
        setShowOnboardingPulse(true);
        
        const hideTimer = setTimeout(() => {
          setShowOnboardingPulse(false);
        }, 5000);
        
        return () => clearTimeout(hideTimer);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div 
      style={uiStyle} 
      className={`absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-start z-10 transition-opacity duration-300 ${
        isTransitioning ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div 
        key={worldName} 
        className="animate-fade-in [animation-delay:0.5s] flex items-center gap-2 pointer-events-auto flex-1 min-w-0 mr-4"
      >
        {!isMobile && (
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold h-8 sm:h-10 flex items-center truncate flex-shrink min-w-0">
            {worldName}
          </h2>
        )}
        
        <LikeDialog 
          uiStyle={uiStyle}
          blendedButtonClasses={blendedButtonClasses}
        />

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
        onGoHome={onGoHome}
        theme={theme}
      />
    </div>
  );
};

export default TopBar;
