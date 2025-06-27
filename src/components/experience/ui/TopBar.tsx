
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EyeOff, Sun, Moon, Home, Heart, Link, Coffee, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useMemo } from "react";

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

interface InstructionSet {
  primary: string;
  secondary: string;
  tertiary: string;
  welcome?: string;
}

const TopBar = ({ worldName, uiColor, onToggleUiHidden, onToggleTheme, theme, onGoHome, isTransitioning, isMobile, onShowHelp }: TopBarProps) => {
  const blendedButtonClasses = "border-0 bg-black/40 hover:bg-black/60 dark:bg-white/40 dark:hover:bg-white/60";
  
  // Use black text in day mode for better visibility against bright backgrounds
  const textColor = theme === 'day' ? '#000000' : uiColor;
  const uiStyle = { color: textColor };

  // Stable state management to prevent flickering
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [showOnboardingPulse, setShowOnboardingPulse] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Memoize instructions to prevent unnecessary recalculations
  const instructions = useMemo((): InstructionSet => {
    const baseInstructions = {
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
  }, [isFirstVisit, isMobile]);

  // Initialize first visit state only once
  useEffect(() => {
    if (!hasInitialized) {
      const hasVisited = localStorage.getItem('hasVisitedExperience');
      if (!hasVisited) {
        setIsFirstVisit(true);
        localStorage.setItem('hasVisitedExperience', 'true');
      }
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  // Handle onboarding pulse with stable timing
  useEffect(() => {
    if (isFirstVisit && hasInitialized) {
      const timer = setTimeout(() => {
        setShowOnboardingPulse(true);
        
        const hideTimer = setTimeout(() => {
          setShowOnboardingPulse(false);
        }, 5000);
        
        return () => clearTimeout(hideTimer);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, hasInitialized]);

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOnboardingPulse(false);
    
    if (isMobile) {
      setIsInfoTooltipOpen(!isInfoTooltipOpen);
    }
  };

  return (
    <div style={uiStyle} className={`absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-start z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div key={worldName} className="animate-fade-in [animation-delay:0.5s] flex items-center gap-2 pointer-events-auto flex-1 min-w-0 mr-4">
        {!isMobile && (
          <h2 className="text-lg sm:text-2xl md:text-3xl font-bold h-8 sm:h-10 flex items-center truncate flex-shrink min-w-0">
            {worldName}
          </h2>
        )}
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              style={uiStyle}
              className={`transition-colors duration-300 ${blendedButtonClasses} flex-shrink-0`}
              size="icon"
              aria-label="Like this project"
            >
              <Heart className="fill-current" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                  <AlertDialogTitle>Like this project?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This is a passion project by one developer. Features like saving and sharing worlds are on the roadmap. Your support helps bring them to life!
                  </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
                <AlertDialogAction asChild>
                    <a href="https://buymeacoffee.com/brandoncalderonmorales" target="_blank" rel="noopener noreferrer">
                        <Coffee className="mr-2" /> Buy me a coffee
                    </a>
                </AlertDialogAction>
                <AlertDialogAction asChild>
                    <a href="https://www.linkedin.com/in/bcalderonmorales-cmoe/" target="_blank" rel="noopener noreferrer">
                        <Link className="mr-2" /> Connect on LinkedIn
                    </a>
                </AlertDialogAction>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Maybe later</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Tooltip open={isMobile ? isInfoTooltipOpen : undefined}>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              onClick={handleInfoClick}
              className={`${blendedButtonClasses} transition-all duration-300 ${
                showOnboardingPulse ? 'animate-pulse ring-2 ring-blue-400/50' : ''
              } flex-shrink-0`}
              size="icon"
              aria-label="Information and Controls"
            >
              <Info className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            side="bottom" 
            className={`max-w-xs p-4 rounded-lg shadow-2xl border-0 ${
              theme === 'day' 
                ? 'bg-white/95 text-gray-800 backdrop-blur-md' 
                : 'bg-gray-900/95 text-gray-100 backdrop-blur-md'
            }`}
            sideOffset={8}
          >
            <div className="space-y-3">
              {instructions.welcome && (
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
      </div>
      
      <div className="flex items-center gap-2 pointer-events-auto flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              aria-label="Hide UI"
              onClick={onToggleUiHidden}
              className={blendedButtonClasses}
              style={uiStyle}
            >
              <EyeOff className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hide UI (V)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              onClick={onToggleTheme}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Toggle Theme"
            >
              {theme === 'day' ? <Moon /> : <Sun />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Theme (Space)</p>
          </TooltipContent>
        </Tooltip>
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
      </div>
    </div>
  );
};

export default TopBar;
