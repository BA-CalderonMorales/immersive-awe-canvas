
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { World1, World2, World3 } from "@/worlds";
import WorldContainer from "@/components/WorldContainer";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sun, Moon, Loader2 } from "lucide-react";

type World = Database['public']['Tables']['worlds']['Row'];

const worldComponentMap: { [key: string]: React.ComponentType } = {
  World1,
  World2,
  World3,
};

const fetchWorlds = async (): Promise<World[]> => {
  const { data, error } = await supabase.from('worlds').select('*').order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

const ExperienceContent = () => {
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { theme, toggleTheme } = useExperience();

  const { data: worlds, isLoading, isError } = useQuery({
    queryKey: ['worlds'],
    queryFn: fetchWorlds,
  });

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
    if (isTransitioning || !worlds || worlds.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentWorldIndex((prevIndex) => {
        const newIndex = direction === 'next'
          ? (prevIndex + 1) % worlds.length
          : (prevIndex - 1 + worlds.length) % worlds.length;
        return newIndex;
      });
      setIsTransitioning(false);
    }, 300);
  };

  const WorldComponent = useMemo(() => {
    if (!worlds || worlds.length === 0) return null;
    const key = worlds[currentWorldIndex].component_key;
    return worldComponentMap[key];
  }, [worlds, currentWorldIndex]);

  const worldData = useMemo(() => {
    if (!worlds || worlds.length === 0) return null;
    return worlds[currentWorldIndex];
  }, [worlds, currentWorldIndex]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-4 text-lg">Summoning Worlds...</p>
      </div>
    );
  }

  if (isError || !worldData || !WorldComponent) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p className="text-lg text-red-500">Could not connect to the multiverse.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <div
        key={currentWorldIndex}
        className={`w-full h-full absolute inset-0 ${isTransitioning ? 'animate-fade-out' : 'animate-fade-in'}`}
      >
        <WorldContainer>
          <WorldComponent />
        </WorldContainer>
      </div>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-center z-10">
        <div key={currentWorldIndex} className="animate-fade-in [animation-delay:0.3s]">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mix-blend-difference">{worldData.name}</h2>
        </div>
        <Button
          onClick={toggleTheme}
          className="text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto"
          size="icon"
          aria-label="Toggle Theme"
        >
          {theme === 'day' ? <Moon /> : <Sun />}
        </Button>
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
