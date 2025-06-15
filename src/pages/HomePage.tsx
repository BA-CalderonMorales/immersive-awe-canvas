
import { useNavigate } from "react-router-dom";
import BackgroundScene from "@/components/BackgroundScene";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import { useEffect, useRef, useState, useCallback } from "react";
import TransitionSplash from "@/components/TransitionSplash";
import anime from "animejs";

const HomePageContent = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useExperience();
  const [isLeaving, setIsLeaving] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subTextRef = useRef<HTMLParagraphElement>(null);

  const handleStartJourney = useCallback(() => {
    if (isLeaving) return;
    setIsLeaving(true);
    setShowSplash(true);
    setTimeout(() => {
      navigate("/experience");
    }, 1850);
  }, [isLeaving, navigate]);

  useEffect(() => {
    // Animate main title
    if (textRef.current) {
      anime({
        targets: textRef.current,
        translateY: [-40, 0],
        opacity: [0, 1],
        easing: "easeOutBack",
        duration: 1200,
        delay: 120,
      });
    }
    // Animate subtitle
    if (subTextRef.current) {
      anime({
        targets: subTextRef.current,
        opacity: [0, 0.85],
        translateY: [22, 0],
        delay: 800,
        duration: 900,
        easing: "easeOutQuad",
      });
    }
  }, []);

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
      <div className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center 
          transition-colors duration-1000 
          ${theme === 'day' 
            ? 'bg-transparent group-hover:bg-black/15' 
            : 'bg-black/20 group-hover:bg-black/40'}`}>
        <div className="text-center select-none pointer-events-none">
          <h1 
            ref={textRef}
            className="text-5xl md:text-7xl font-bold text-white mix-blend-difference mb-2 opacity-0 [text-shadow:0_0_8px_rgba(255,255,255,0.3)]"
          >
            The Journey Awaits
          </h1>
          <p
            ref={subTextRef}
            className="mt-8 text-lg text-white/80 mix-blend-difference opacity-0 [text-shadow:0_0_8px_rgba(255,255,255,0.2)]"
          >
            Click anywhere or press Enter to begin
          </p>
        </div>
      </div>
      <TransitionSplash show={showSplash} theme={theme} />
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
