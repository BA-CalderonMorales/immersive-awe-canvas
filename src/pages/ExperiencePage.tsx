
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import WorldContainer from "@/components/WorldContainer";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import { Loader2 } from "lucide-react";
import DynamicWorld from "@/components/scene/DynamicWorld";
import { isSceneConfig } from "@/lib/typeguards";
import { SceneConfig } from "@/types/scene";
import { toast } from "sonner";
import ExperienceUI from "@/components/experience/ExperienceUI";
import HelpDialog from "@/components/dialogs/HelpDialog";
import WorldSearchDialog from "@/components/dialogs/WorldSearchDialog";
import KeyboardControls from "@/components/controls/KeyboardControls";
import { useNavigate } from "react-router-dom";

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
  const [currentWorldId, setCurrentWorldId] = useState<number | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const { data: worlds, isLoading, isError } = useQuery<World[]>({
    queryKey: ['worlds'],
    queryFn: fetchWorlds,
  });

  const worldData = useMemo(() => {
    if (!worlds || worlds.length === 0) return null;
    return worlds[currentWorldIndex];
  }, [worlds, currentWorldIndex]);
  
  useEffect(() => {
    if (worldData && worldData.id !== currentWorldId) {
      if (isSceneConfig(worldData.scene_config)) {
        setEditableSceneConfig(JSON.parse(JSON.stringify(worldData.scene_config)));
        setCurrentWorldId(worldData.id);
      }
    }
  }, [worldData, currentWorldId]);

  const changeWorld = useMemo(() => (direction: 'next' | 'prev') => {
    if (isTransitioning || !worlds || worlds.length === 0) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentWorldIndex((prevIndex) => {
        if (!worlds) return 0;
        const newIndex = direction === 'next'
          ? (prevIndex + 1) % worlds.length
          : (prevIndex - 1 + worlds.length) % worlds.length;
        return newIndex;
      });
      setIsTransitioning(false);
    }, 1000);
  }, [isTransitioning, worlds]);

  const jumpToWorld = (index: number) => {
    if (isTransitioning || !worlds || worlds.length === 0 || index === currentWorldIndex) {
      return;
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentWorldIndex(index);
      setIsTransitioning(false);
    }, 1000);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isHelpOpen) return;

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          toggleTheme();
          break;
        case 'KeyN':
           event.preventDefault();
           changeWorld('next');
           break;
        case 'KeyP':
           event.preventDefault();
           changeWorld('prev');
           break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme, changeWorld, isHelpOpen]);

  const handleGoHome = () => {
    navigate('/');
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
          <KeyboardControls />
          <DynamicWorld sceneConfig={editableSceneConfig} />
        </WorldContainer>
      </div>

      <ExperienceUI
        worldName={worldData.name}
        theme={theme}
        isTransitioning={isTransitioning}
        editableSceneConfig={editableSceneConfig}
        onToggleTheme={toggleTheme}
        onChangeWorld={changeWorld}
        onCopyCode={handleCopyCode}
        onUpdateSceneConfig={setEditableSceneConfig}
        onShowHelp={() => setIsHelpOpen(true)}
        onGoHome={handleGoHome}
        onShowSearch={() => setIsSearchOpen(true)}
      />
      <HelpDialog isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
      <WorldSearchDialog
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        worlds={worlds}
        onSelectWorld={jumpToWorld}
      />
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
