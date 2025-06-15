import { useState, useEffect, useMemo, useCallback } from "react";
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
import { logEvent } from "@/lib/logger";
import { useLikes } from "@/hooks/useLikes";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import SceneControls from "@/components/scene/SceneControls";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { isLiked, toggleLike } = useLikes();
  const [editableSceneConfig, setEditableSceneConfig] = useState<SceneConfig | null>(null);
  const [currentWorldId, setCurrentWorldId] = useState<number | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleCopyCode = useCallback(() => {
    if (!editableSceneConfig) return;
    const codeString = JSON.stringify(editableSceneConfig, null, 2);
    navigator.clipboard.writeText(codeString)
      .then(() => {
        toast.success("Scene configuration copied to clipboard!");
        logEvent({ eventType: 'action', eventSource: 'copy_code_success' });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast.error("Failed to copy configuration.");
        logEvent({ eventType: 'action', eventSource: 'copy_code_failure', metadata: { error: (err as Error).message } });
      });
  }, [editableSceneConfig]);

  useEffect(() => {
    if (worldData && worldData.id !== currentWorldId) {
      if (isSceneConfig(worldData.scene_config)) {
        setEditableSceneConfig(JSON.parse(JSON.stringify(worldData.scene_config)));
        setCurrentWorldId(worldData.id);
        // Close settings panel on world change for a cleaner transition
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    }
  }, [worldData, currentWorldId, isSettingsOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isHelpOpen || isSearchOpen || isSettingsOpen) return;

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          toggleTheme();
          logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_theme' });
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
        case 'KeyQ':
          event.preventDefault();
          setIsHelpOpen(true);
          logEvent({ eventType: 'keyboard_shortcut', eventSource: 'open_help' });
          break;
        case 'KeyE':
          event.preventDefault();
          setIsSettingsOpen(o => !o);
          logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_settings' });
          break;
        case 'KeyC':
          event.preventDefault();
          handleCopyCode();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleTheme, changeWorld, isHelpOpen, isSearchOpen, handleGoHome, handleCopyCode, isSettingsOpen]);

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

  const World3D = (
     <div
        key={currentWorldIndex}
        className={`w-full h-full absolute inset-0 transition-all duration-1000 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      >
        <WorldContainer>
          <KeyboardControls />
          <DynamicWorld sceneConfig={editableSceneConfig} />
        </WorldContainer>
      </div>
  );

  const SceneSettingsPanel = (
    <div className="bg-background text-foreground h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Customize Scene</h2>
          <p className="text-sm text-muted-foreground">
            Live adjustments for the world.
          </p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <SceneControls sceneConfig={editableSceneConfig} onUpdate={setEditableSceneConfig} />
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="w-full h-full relative overflow-hidden bg-black">
      {isMobile ? (
        <div className="w-full h-full">{World3D}</div>
      ) : (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel>
            <div className="w-full h-full relative">{World3D}</div>
          </ResizablePanel>
          {isSettingsOpen && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                {SceneSettingsPanel}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      )}

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
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={setIsSettingsOpen}
        isLiked={isLiked(worldData.id)}
        onToggleLike={() => toggleLike(worldData.id, worldData.name)}
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
