import { useState, useRef, useCallback } from 'react';
import { useBackgrounds } from '@/hooks/useBackgrounds';
import { useDefaultGeometries } from '@/hooks/useDefaultGeometries';
import { useExperienceEffects } from '@/hooks/useExperienceEffects';
import { useExperience } from '@/hooks/useExperience';
import { useHotkeyActions } from '@/hooks/useHotkeyActions';
import ExperienceContainer from './ExperienceContainer';
import LoadingOverlay from './LoadingOverlay';
import { SceneConfig } from '@/types/scene';
import { updateSceneConfigBackground, updateSceneConfigGeometry } from '@/utils/sceneConfigUtils';
import type { Database } from "@/integrations/supabase/types";

type DefaultGeometry = Database['public']['Tables']['default_geometries']['Row'];

const ExperienceLogic = () => {
  // Basic state
  const [editableSceneConfig, setEditableSceneConfig] = useState<SceneConfig>({
    type: 'TorusKnot',
    day: {
      lights: [{ type: 'ambient', intensity: 1 }],
      material: { materialType: 'standard' },
      background: { type: 'void' },
      mainObjectColor: '#ffffff'
    },
    night: {
      lights: [{ type: 'ambient', intensity: 0.5 }],
      material: { materialType: 'standard' },
      background: { type: 'void' },
      mainObjectColor: '#ffffff'
    }
  });
  const [currentWorldId, setCurrentWorldId] = useState<number | null>(null);
  const [isObjectLocked, setIsObjectLocked] = useState(false);
  const [isDragEnabled, setIsDragEnabled] = useState(false);
  const [isMotionFrozen, setIsMotionFrozen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUiHidden, setIsUiHidden] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showEntryTransition, setShowEntryTransition] = useState(true);
  const [showWorldTransition, setShowWorldTransition] = useState(false);
  const [showUiHint, setShowUiHint] = useState(false);
  const hintShownRef = useRef(false);

  // Hooks
  const { backgrounds, currentBackground, isTransitioning, changeBackground, jumpToBackground } = useBackgrounds();
  const { geometries, currentGeometry, changeGeometry, jumpToGeometry } = useDefaultGeometries();
  const { theme, toggleTheme } = useExperience();

  // Helper functions
  const toggleObjectLock = useCallback(() => setIsObjectLocked(prev => !prev), []);
  const toggleDragEnabled = useCallback(() => setIsDragEnabled(prev => !prev), []);
  const toggleMotionFreeze = useCallback(() => setIsMotionFrozen(prev => !prev), []);
  const handleEntryTransitionEnd = useCallback(() => setShowEntryTransition(false), []);
  const handleWorldTransitionEnd = useCallback(() => setShowWorldTransition(false), []);
  const handleCopyCode = useCallback(() => {
    // Copy current scene config to clipboard
    navigator.clipboard.writeText(JSON.stringify(editableSceneConfig, null, 2));
  }, [editableSceneConfig]);
  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);
  const handleToggleShortcuts = useCallback(() => {
    // Toggle keyboard shortcuts overlay
  }, []);

  // Hotkey callbacks
  const hotkeyCallbacks = {
    toggleTheme,
    changeWorld: changeBackground,
    changeGeometry,
    openSearch: () => setIsSearchOpen(true),
    goHome: handleGoHome,
    openHelp: () => setIsHelpOpen(true),
    toggleSettings: () => setIsSettingsOpen(prev => !prev),
    copyCode: handleCopyCode,
    toggleUi: () => setIsUiHidden(prev => !prev),
    toggleLock: toggleObjectLock,
    toggleShortcuts: handleToggleShortcuts,
  };

  // Initialize hotkeys
  useHotkeyActions(hotkeyCallbacks);

  // Enhanced handlers that update scene config properly
  const handleChangeBackground = useCallback((direction: 'next' | 'prev') => {
    changeBackground(direction);
  }, [changeBackground]);

  const handleChangeGeometry = useCallback((direction: 'next' | 'prev') => {
    changeGeometry(direction);
  }, [changeGeometry]);

  const handleJumpToBackground = useCallback((backgroundIndex: number) => {
    jumpToBackground(backgroundIndex);
    // Update scene config when background changes
    if (backgrounds && backgrounds[backgroundIndex] && editableSceneConfig) {
      const targetBackground = backgrounds[backgroundIndex];
      const updatedConfig = updateSceneConfigBackground(editableSceneConfig, targetBackground);
      setEditableSceneConfig(updatedConfig);
    }
  }, [jumpToBackground, backgrounds, editableSceneConfig]);

  const handleJumpToGeometry = useCallback((geometryIndex: number) => {
    jumpToGeometry(geometryIndex);
    // Update scene config when geometry changes
    if (geometries && geometries[geometryIndex] && editableSceneConfig) {
      const targetGeometry = geometries[geometryIndex];
      const updatedConfig = updateSceneConfigGeometry(editableSceneConfig, targetGeometry);
      setEditableSceneConfig(updatedConfig);
    }
  }, [jumpToGeometry, geometries, editableSceneConfig]);

  // Experience effects
  const { handleEntryTransitionEndWithHint } = useExperienceEffects({
    worldData: currentGeometry,
    currentWorldId,
    setEditableSceneConfig,
    setCurrentWorldId,
    isSettingsOpen,
    setIsSettingsOpen,
    hintShownRef,
    setShowUiHint,
    handleEntryTransitionEnd,
  });

  // Loading states
  const backgroundsLoading = !backgrounds;
  const geometriesLoading = !geometries;
  const isLoading = backgroundsLoading || geometriesLoading;

  // Debug logging
  console.log('ExperienceLogic debug:', {
    backgroundsLoading,
    geometriesLoading, 
    isLoading,
    currentGeometry,
    currentBackground,
    backgrounds: backgrounds?.length,
    geometries: geometries?.length
  });

  if (isLoading) {
    console.log('ExperienceLogic: Showing loading overlay');
    return <LoadingOverlay message="Loading experience..." theme="night" />;
  }

  // Ensure data is available
  if (!currentGeometry || !currentBackground) {
    console.log('ExperienceLogic: Waiting for data...', { currentGeometry, currentBackground });
    return <LoadingOverlay message="Waiting for data..." theme="night" />;
  }

  console.log('ExperienceLogic: Rendering ExperienceContainer');

  return (
    <ExperienceContainer
      worldData={currentGeometry as any}
      editableSceneConfig={editableSceneConfig}
      isTransitioning={isTransitioning}
      currentWorldIndex={0}
      isObjectLocked={isObjectLocked}
      theme={theme}
      worlds={backgrounds as any[]}
      isSettingsOpen={isSettingsOpen}
      isUiHidden={isUiHidden}
      showUiHint={showUiHint}
      isHelpOpen={isHelpOpen}
      isSearchOpen={isSearchOpen}
      showEntryTransition={showEntryTransition}
      showWorldTransition={showWorldTransition}
      toggleObjectLock={toggleObjectLock}
      toggleTheme={toggleTheme}
      setEditableSceneConfig={setEditableSceneConfig}
      setIsHelpOpen={setIsHelpOpen}
      setIsSearchOpen={setIsSearchOpen}
      setIsSettingsOpen={setIsSettingsOpen}
      setIsUiHidden={setIsUiHidden}
      handleChangeBackground={handleChangeBackground}
      handleChangeGeometry={handleChangeGeometry}
      handleJumpToWorld={() => {}}
      handleCopyCode={handleCopyCode}
      handleGoHome={handleGoHome}
      handleToggleShortcuts={handleToggleShortcuts}
      handleEntryTransitionEndWithHint={handleEntryTransitionEndWithHint}
      handleWorldTransitionEnd={handleWorldTransitionEnd}
      isDragEnabled={isDragEnabled}
      onToggleDrag={toggleDragEnabled}
      isMotionFrozen={isMotionFrozen}
      onToggleMotion={toggleMotionFreeze}
      currentBackground={currentBackground}
      currentGeometry={currentGeometry}
      onJumpToBackground={handleJumpToBackground}
      onJumpToGeometry={handleJumpToGeometry}
    />
  );
};

export default ExperienceLogic;