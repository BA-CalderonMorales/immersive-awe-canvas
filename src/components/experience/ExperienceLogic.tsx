
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useWorlds } from "@/hooks/useWorlds";
import { useExperience } from "@/hooks/useExperience";
import { isSceneConfig } from "@/lib/typeguards";
import { SceneConfig } from "@/types/scene";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { logEvent } from "@/lib/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardShortcuts } from "@/context/KeyboardShortcutsContext";
import ExperienceUI from "./ExperienceUI";
import LoadingOverlay from "./LoadingOverlay";
import ExperienceHotkeys from "./ExperienceHotkeys";
import ExperienceTransitions from "./ExperienceTransitions";
import ExperienceLayout from "./ExperienceLayout";

const ExperienceLogic = () => {
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
  const { toggleVisible: toggleKeyboardShortcuts } = useKeyboardShortcuts();
  const [editableSceneConfig, setEditableSceneConfig] = useState<SceneConfig | null>(null);
  const [isObjectLocked, setIsObjectLocked] = useState(false);
  const [currentWorldId, setCurrentWorldId] = useState<number | null>(null);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showUiHint, setShowUiHint] = useState(false);
  const hintShownRef = useRef(false);

  const toggleObjectLock = useCallback(() => {
    setIsObjectLocked(locked => {
      const newLockState = !locked;
      toast.info(newLockState ? "Object motion locked" : "Object motion unlocked");
      return newLockState;
    });
  }, []);
  
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

  const handleToggleShortcuts = useCallback(() => {
    toggleKeyboardShortcuts();
    logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_shortcuts' });
  }, [toggleKeyboardShortcuts]);

  const [showEntryTransition, setShowEntryTransition] = useState(true);
  const [showWorldTransition, setShowWorldTransition] = useState(false);

  const handleEntryTransitionEnd = () => {
    setShowEntryTransition(false);
    if (!hintShownRef.current) {
      hintShownRef.current = true;
      setShowUiHint(true);
      setTimeout(() => {
        setShowUiHint(false);
      }, 4000);
    }
  };

  const handleWorldTransitionEnd = () => {
    setShowWorldTransition(false);
  };

  useEffect(() => {
    if (isTransitioning) {
      setShowWorldTransition(true);
    }
  }, [isTransitioning]);

  useEffect(() => {
    if (worldData && worldData.id !== currentWorldId) {
      if (isSceneConfig(worldData.scene_config)) {
        setEditableSceneConfig(JSON.parse(JSON.stringify(worldData.scene_config)));
        setCurrentWorldId(worldData.id);
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
        }
      }
    }
  }, [worldData, currentWorldId, isSettingsOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Escape' && isSettingsOpen) {
        event.preventDefault();
        setIsSettingsOpen(false);
        logEvent({ eventType: 'keyboard_shortcut', eventSource: 'close_settings' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSettingsOpen]);

  const uiColor = useMemo(() => {
    if (!worldData) return 'white';
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
      <ExperienceTransitions
        showEntryTransition={showEntryTransition}
        showWorldTransition={showWorldTransition}
        theme={theme}
        onEntryTransitionEnd={handleEntryTransitionEnd}
        onWorldTransitionEnd={handleWorldTransitionEnd}
      />
      
      <ExperienceLayout
        editableSceneConfig={editableSceneConfig}
        isTransitioning={isTransitioning}
        currentWorldIndex={currentWorldIndex}
        isObjectLocked={isObjectLocked}
        onToggleObjectLock={toggleObjectLock}
        isSettingsOpen={isSettingsOpen}
        isMobile={isMobile}
        onUpdateSceneConfig={setEditableSceneConfig}
      />

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
        isUiHidden={isUiHidden}
        onToggleUiHidden={() => setIsUiHidden((h) => !h)}
        showUiHint={showUiHint}
      />

      <ExperienceHotkeys
        toggleTheme={toggleTheme}
        changeWorld={changeWorld}
        handleGoHome={handleGoHome}
        handleCopyCode={handleCopyCode}
        toggleObjectLock={toggleObjectLock}
        handleToggleShortcuts={!isMobile ? handleToggleShortcuts : undefined}
        setIsSearchOpen={setIsSearchOpen}
        setIsHelpOpen={setIsHelpOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        setIsUiHidden={setIsUiHidden}
        isHelpOpen={isHelpOpen}
        isSearchOpen={isSearchOpen}
        isSettingsOpen={isSettingsOpen}
        worlds={worlds}
        jumpToWorld={jumpToWorld}
      />
    </div>
  );
};

export default ExperienceLogic;
