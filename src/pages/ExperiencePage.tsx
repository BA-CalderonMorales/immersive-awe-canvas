
import { useState, useEffect, useMemo } from "react";
import { World1, World2, World3 } from "@/worlds";
import WorldContainer from "@/components/WorldContainer";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const worlds = [
  { component: World1, name: "Genesis Torus" },
  { component: World2, name: "Wobble Field" },
  { component: World3, name: "Distortion Sphere" },
];

const ExperienceContent = () => {
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  const changeWorld = (direction: 'next' | 'prev') => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    // Let the fade-out animation play
    setTimeout(() => {
      setCurrentWorldIndex((prevIndex) => {
        const newIndex = direction === 'next'
          ? (prevIndex + 1) % worlds.length
          : (prevIndex - 1 + worlds.length) % worlds.length;
        return newIndex;
      });
      // New world will fade in with the key change
      setIsTransitioning(false);
    }, 300); // Corresponds to fade-out duration
  };

  const WorldComponent = useMemo(() => worlds[currentWorldIndex].component, [currentWorldIndex]);
  const worldData = useMemo(() => worlds[currentWorldIndex], [currentWorldIndex]);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div
        key={currentWorldIndex}
        className={`w-full h-full absolute inset-0 ${isTransitioning ? 'animate-fade-out' : 'animate-fade-in'}`}
      >
        <WorldContainer>
          <WorldComponent />
        </WorldContainer>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-end p-8 sm:p-16">
        <div className="text-center pb-16 sm:pb-0">
          <div key={currentWorldIndex} className="animate-fade-in [animation-delay:0.3s]">
            <h2 className="text-4xl font-bold text-white mix-blend-difference">{worldData.name}</h2>
            <p className="text-lg text-white mix-blend-difference">World {currentWorldIndex + 1}</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <Button
        onClick={() => changeWorld('prev')}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto z-10"
        size="icon"
        aria-label="Previous World"
        disabled={isTransitioning}
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={() => changeWorld('next')}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto z-10"
        size="icon"
        aria-label="Next World"
        disabled={isTransitioning}
      >
        <ArrowRight />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white mix-blend-difference text-xs animate-fade-in [animation-delay:0.5s]">
          Press SPACE to change time of day
      </div>
    </div>
  );
};

const ExperiencePage = () => {
  return (
    <ExperienceProvider>
      <ExperienceContent />
    </ExperienceProvider>
  );
};

export default ExperiencePage;
