import { useState, useEffect, useMemo } from "react";
import { useWorlds } from "@/hooks/useWorlds";
import WorldContainer from "@/components/WorldContainer";
import { ExperienceProvider } from "@/context/ExperienceContext";
import { useExperience } from "@/hooks/useExperience";
import DynamicWorld from "@/components/scene/DynamicWorld";
import { isSceneConfig } from "@/lib/typeguards";
import { SceneConfig } from "@/types/scene";
import { toast } from "sonner";
import ExperienceUI from "@/components/experience/ExperienceUI";
import HelpDialog from "@/components/dialogs/HelpDialog";
import WorldSearchDialog from "@/components/dialogs/WorldSearchDialog";
import KeyboardControls from "@/components/controls/KeyboardControls";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "@/components/experience/LoadingOverlay";

const ExperienceContent = () => {
  const {
    worlds,
    isLoading,
    isError,
    worldData,
    currentWorldIndex,
    isTransitioning,
    changeWorld,
    jumpToWorld,
  } = useWorlds();
  
  const { theme, toggleTheme } = useExperience();
  const [editableSceneConfig, setEditableSceneConfig] = useState<SceneConfig | null>(null);
  const [currentWorldId, setCurrentWorldId] = useState<number | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (worldData && worldData.id !== currentWorldId) {
      if (isSceneConfig(worldData.scene_config)) {
        setEditableSceneConfig(JSON.parse(JSON.stringify(worldData.scene_config)));
        setCurrentWorldId(worldData.id);
      }
    }
  }, [worldData, currentWorldId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isHelpOpen || isSearchOpen) return;

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
        case 'KeyK':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            setIsSearchOpen(o => !o);
          }
          break;
        case 'KeyH':
          event.preventDefault();
          handleGoHome();
          break;
        case 'KeyS':
          event.preventDefault();
          setIsSearchOpen(true);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme, changeWorld, isHelpOpen, isSearchOpen, handleGoHome]);

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

  const uiColor = useMemo(() => {
    if (!worldData) return 'white';
    // Use the world-specific color if available, otherwise fallback to white
    const color = theme === 'day' ? worldData.ui_day_color : worldData.ui_night_color;
    return color || 'white';
  }, [worldData, theme]);

  if (isLoading) {
    return <LoadingOverlay message="Summoning Worlds..." />;
  }

  if (isError) {
    return <LoadingOverlay message="Could not connect to the multiverse." />;
  }
  
  if (!worldData) {
    return <LoadingOverlay message="No worlds found." />;
  }

  if (!editableSceneConfig) {
    return <LoadingOverlay message="Initializing Scene..." />;
  }

  if (!isSceneConfig(worldData.scene_config)) {
     return <LoadingOverlay message="World data is incomplete or corrupted." />;
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
        uiColor={uiColor}
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
