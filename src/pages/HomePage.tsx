
import { useNavigate } from "react-router-dom";
import BackgroundScene from "@/components/BackgroundScene";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import { useEffect, useRef, useState, useCallback } from "react";
import TransitionSplash from "@/components/TransitionSplash";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sun, Moon, Info } from "lucide-react";
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

  const blendedButtonClasses = "border-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm";
  const uiColor = theme === 'day' ? '#1a1a1a' : '#ffffff';

  return (
    <div 
      className="relative w-full h-full cursor-pointer group" 
      onClick={handleStartJourney}
    >
  
      {/* Theme switcher in top right */}
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 pointer-events-auto">
      
        <Tooltip>
        
          <TooltipTrigger asChild>
          
            <Button
              style={{ color: uiColor }}
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className={`${blendedButtonClasses} transition-all duration-300 animate-fade-in`}
              size="icon"
              aria-label="Toggle Theme"
            >
              {theme === 'day' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>
          
          </TooltipTrigger>
          
          <TooltipContent>
            <p>Toggle Theme (Space)</p>
          </TooltipContent>
        
        </Tooltip>
      
      </div>

      {/* Background with floating elements */}
      <div className="absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover:scale-105">
      
        <BackgroundScene theme={theme} />
        
        {/* Floating trees for day mode */}
        {theme === 'day' && (
        
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
            <div className="absolute top-1/4 left-1/4 w-8 h-12 opacity-20 animate-bounce-slow [animation-delay:0s]">
              🌲
            </div>
            
            <div className="absolute top-1/3 right-1/3 w-6 h-10 opacity-15 animate-bounce-slow [animation-delay:1s]">
              🌳
            </div>
            
            <div className="absolute bottom-1/3 left-1/5 w-7 h-11 opacity-25 animate-bounce-slow [animation-delay:2s]">
              🌲
            </div>
            
            <div className="absolute top-1/2 right-1/4 w-5 h-9 opacity-10 animate-bounce-slow [animation-delay:1.5s]">
              🌿
            </div>
          
          </div>
        
        )}

        {/* Moon for night mode */}
        {theme === 'night' && (
          <div className="absolute top-1/4 right-1/4 w-16 h-16 opacity-30 animate-pulse pointer-events-none">
            🌙
          </div>
        )}
      
      </div>

      {/* Main content overlay */}
      <div className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center 
          transition-colors duration-1000 
          ${theme === 'day' 
            ? 'bg-transparent group-hover:bg-black/10' 
            : 'bg-black/20 group-hover:bg-black/40'}`}>
        
        <div className="text-center select-none pointer-events-none mb-8">
          <h1 
            ref={textRef}
            className={`text-5xl md:text-7xl font-bold mb-4 opacity-0 transition-all duration-1000 ${
              theme === 'day' 
                ? 'text-emerald-800 [text-shadow:0_0_20px_rgba(16,185,129,0.3)]' 
                : 'text-blue-100 mix-blend-difference [text-shadow:0_0_20px_rgba(147,197,253,0.4)]'
            }`}
          >
            Immersive Awe Canvas
          </h1>
          <p
            ref={subTextRef}
            className={`mt-4 text-xl transition-all duration-1000 opacity-0 ${
              theme === 'day'
                ? 'text-emerald-700 [text-shadow:0_0_15px_rgba(16,185,129,0.2)]'
                : 'text-blue-200 mix-blend-difference [text-shadow:0_0_15px_rgba(147,197,253,0.3)]'
            }`}
          >
            The Journey Awaits
          </p>
        </div>

        {/* Bottom info icon only */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center opacity-70 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`w-6 h-6 p-0 ${
                  theme === 'day' ? 'text-emerald-600 hover:text-emerald-800' : 'text-blue-300 hover:text-blue-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-sm space-y-1">
                <p>Click anywhere or press Enter to begin your journey</p>
                <p>Press Space to toggle between day and night themes</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

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

const HomePage = () => {
  
  return (

    <ExperienceProvider>
      <HomePageContent />
    </ExperienceProvider>
  
  )

}

export default HomePage;
