
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import WorldContainer from "@/components/WorldContainer";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sun, Moon, Loader2, Copy } from "lucide-react";
import DynamicWorld from "@/components/scene/DynamicWorld";
import { isSceneConfig } from "@/lib/typeguards";
import { SceneConfig } from "@/types/scene";
import { toast } from "sonner";

type World = Database['public']['Tables']['worlds']['Row'];

const fetchWorlds = async (): Promise<World[]> => {
  const { data, error } = await supabase.from('worlds').select('*').order('id', { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
};

const ExperienceContent = () => {
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { theme, toggleTheme } = useExperience();
  const [editableSceneConfig, setEditableSceneConfig] = useState<SceneConfig | null>(null);

  const { data: worlds, isLoading, isError } = useQuery<World[]>({
    queryKey: ['worlds'],
    queryFn: fetchWorlds,
  });

  const worldData = useMemo(() => {
    if (!worlds || worlds.length === 0) return null;
    return worlds[currentWorldIndex];
  }, [worlds, currentWorldIndex]);
  
  useEffect(() => {
    if (worldData && isSceneConfig(worldData.scene_config)) {
      // Deep copy to avoid mutating the cached data from react-query
      setEditableSceneConfig(JSON.parse(JSON.stringify(worldData.scene_config)));
    }
  }, [worldData]);

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
    }, 1000); // Increased transition time for a smoother effect
  };

  const handleCopyCode = () => {
    if (!editableSceneConfig) return;
    const codeString = JSON.stringify(editableSceneConfig, null, 2);
    navigator.clipboard.writeText(codeString)
      .then(() => {
        toast.success("Scene configuration copied to clipboard!");
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast.error("Failed to copy configuration.");
      });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-4 text-lg">Summoning Worlds...</p>
      </div>
    );
  }

  if (isError || !worldData) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p className="text-lg text-red-500">Could not connect to the multiverse.</p>
      </div>
    );
  }
  
  if (!editableSceneConfig) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="ml-4 text-lg">Initializing Scene...</p>
      </div>
    );
  }

  if (!isSceneConfig(worldData.scene_config)) {
     return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <p className="text-lg text-red-500">World data is incomplete or corrupted.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      <div
        key={currentWorldIndex}
        className={`w-full h-full absolute inset-0 transition-all duration-1000 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        <WorldContainer>
          <DynamicWorld sceneConfig={editableSceneConfig} setSceneConfig={setEditableSceneConfig} />
        </WorldContainer>
      </div>

      {/* UI Overlay */}
      <div className={`absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-center z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div key={currentWorldIndex} className="animate-fade-in [animation-delay:0.5s]">
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
        className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        size="icon"
        aria-label="Previous World"
        disabled={isTransitioning}
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={() => changeWorld('next')}
        className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        size="icon"
        aria-label="Next World"
        disabled={isTransitioning}
      >
        <ArrowRight />
      </Button>

      {/* Copy Code Button */}
      <Button
        onClick={handleCopyCode}
        className="absolute bottom-4 left-4 sm:left-8 text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto z-10 transition-opacity duration-300"
        size="icon"
        aria-label="Copy Scene Configuration"
      >
        <Copy />
      </Button>

      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-white mix-blend-difference text-xs animate-fade-in [animation-delay:0.5s] transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          Press SPACE to change time of day
      </div>
    </div>
  );
};

const ExperiencePage = () => {
  useEffect(() => {
    // Ensure body opacity is reset when the page loads
    document.body.style.opacity = '1';
  }, []);

  return (
    <ExperienceProvider>
      <ExperienceContent />
    </ExperienceProvider>
  );
};

export default ExperiencePage;
