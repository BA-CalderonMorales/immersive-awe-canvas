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
    setTimeout(() => navigate("/experience"), 500); // Match fade-out duration
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
      <div className="absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover:scale-105">
        <BackgroundScene theme={theme} />
      </div>
      <div className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center transition-colors duration-1000 
        ${theme === 'day' 
            ? 'bg-transparent group-hover:bg-black/15' 
            : 'bg-black/20 group-hover:bg-black/40'}`}>
        <div className="text-center">
          <h1 className={`text-5xl md:text-7xl font-bold text-white mix-blend-difference transition-transform duration-500 group-hover:scale-105 ${isLeaving ? 'animate-fade-out' : 'animate-fade-in'}`}>
            The Journey Awaits
          </h1>
          <p className={`mt-8 text-lg text-white/80 mix-blend-difference transition-opacity duration-500 group-hover:opacity-100 opacity-80 ${isLeaving ? 'animate-fade-out' : 'animate-fade-in [animation-delay:0.5s]'}`}>
            Click anywhere or press Enter to begin
          </p>
        </div>
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
