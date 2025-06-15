import { useNavigate } from "react-router-dom";
import BackgroundScene from "@/components/BackgroundScene";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import { useEffect, useState, useCallback } from "react";

const HomePageContent = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useExperience();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleStartJourney = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);
    // Give the animation time to play out
    setTimeout(() => navigate("/experience"), 1500);
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

  return (
    <div 
      className="relative w-full h-full cursor-pointer group" 
      onClick={handleStartJourney}
    >
      <div className="absolute inset-0 z-0">
        <BackgroundScene theme={theme} isLeaving={isLeaving} />
      </div>
    </div>
  );
};


const HomePage = () => {
  return (
    <ExperienceProvider>
      <HomePageContent />
    </ExperienceProvider>
  )
}

export default HomePage;
