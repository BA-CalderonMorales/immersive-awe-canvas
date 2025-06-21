
import { useNavigate } from "react-router-dom";
import BackgroundScene from "@/components/BackgroundScene";
import { useExperience } from "@/hooks/useExperience";
import { useEffect, useState, useCallback } from "react";
import { FEATURE_WORLD_SLUGS } from "@/config/featureFlags";
import TransitionSplash from "@/components/TransitionSplash";
import ThemeToggle from "./ThemeToggle";
import MainTitle from "./MainTitle";
import FloatingElements from "./FloatingElements";
import InfoButton from "./InfoButton";

const HomePageContent = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useExperience();
  const [isLeaving, setIsLeaving] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  const handleStartJourney = useCallback(() => {
    if (isLeaving) return;
    
    setIsLeaving(true);
    setShowSplash(true);
    
    setTimeout(() => {
      const firstSlug = FEATURE_WORLD_SLUGS[0];
      navigate(firstSlug ? `/experience/${firstSlug}` : "/experience");
    }, 1850);
  }, [isLeaving, navigate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        toggleTheme();
      }
      
      if (event.key === 'Enter') {
        event.preventDefault();
        handleStartJourney();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme, handleStartJourney]);

  const blendedButtonClasses = "border-0 bg-black/40 hover:bg-black/60 dark:bg-white/40 dark:hover:bg-white/60 backdrop-blur-sm";
  const uiColor = theme === 'day' ? '#1a1a1a' : '#ffffff';

  return (
    <div 
      className="relative w-full h-full cursor-pointer group" 
      onClick={handleStartJourney}
    >
      <ThemeToggle 
        theme={theme}
        uiColor={uiColor}
        onToggleTheme={toggleTheme}
        blendedButtonClasses={blendedButtonClasses}
      />

      {/* Background with floating elements */}
      <div className="absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover:scale-105">
        <BackgroundScene theme={theme} />
        <FloatingElements theme={theme} />
      </div>

      {/* Main content overlay */}
      <div className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center 
          transition-colors duration-1000 
          ${theme === 'day' 
            ? 'bg-transparent group-hover:bg-black/10' 
            : 'bg-black/40 dark:bg-white/40 group-hover:bg-black/60 dark:group-hover:bg-white/60'}`}>
        
        <MainTitle theme={theme} />

        <InfoButton 
          theme={theme}
          uiColor={uiColor}
          blendedButtonClasses={blendedButtonClasses}
        />

        {/* Subtle pulse effect to guide user */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-2000 ${
          theme === 'day' 
            ? 'bg-gradient-radial from-emerald-100/10 via-transparent to-transparent' 
            : 'bg-gradient-radial from-blue-300/5 via-transparent to-transparent'
        } animate-pulse opacity-50`} />
      </div>

      <TransitionSplash show={showSplash} theme={theme} />
    </div>
  );
};

export default HomePageContent;
