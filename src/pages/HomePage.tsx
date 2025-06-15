
import { useNavigate } from "react-router-dom";
import BackgroundScene from "@/components/BackgroundScene";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import { useEffect } from "react";

const HomePageContent = () => {
  const navigate = useNavigate();
  const { toggleTheme } = useExperience();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        toggleTheme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme]);

  const handleStartJourney = () => {
    // Add a subtle fade-out effect on the body before navigating
    document.body.style.transition = "opacity 0.5s ease-out";
    document.body.style.opacity = '0';
    setTimeout(() => navigate("/experience"), 500);
  };

  return (
    <div 
      className="relative w-full h-full cursor-pointer group" 
      onClick={handleStartJourney}
      onMouseEnter={() => {
        // Reset opacity on mouse enter in case user navigates back
        document.body.style.opacity = '1';
      }}
    >
      <div className="absolute inset-0 z-0">
        <BackgroundScene />
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/20 transition-all duration-500 group-hover:bg-black/40">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mix-blend-difference animate-fade-in transition-transform duration-500 group-hover:scale-105">
            The Journey Awaits
          </h1>
          <p className="mt-8 text-lg text-white/80 mix-blend-difference animate-fade-in [animation-delay:0.5s] transition-opacity duration-500 group-hover:opacity-100 opacity-80">
            Click anywhere to begin
          </p>
        </div>
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white mix-blend-difference text-xs animate-fade-in [animation-delay:0.5s]">
          Press SPACE to change time of day
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
