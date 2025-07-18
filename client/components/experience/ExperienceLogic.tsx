import { useState, useRef, useCallback, useEffect } from 'react';
import { useBackgrounds } from '@/hooks/useBackgrounds';
import { useDefaultGeometries } from '@/hooks/useDefaultGeometries';
import { useExperienceEffects } from '@/hooks/useExperienceEffects';
import { useExperience } from '@/hooks/useExperience';
import { useHotkeyActions } from '@/hooks/useHotkeyActions';
import ExperienceContainer from './ExperienceContainer';
import LoadingOverlay from './LoadingOverlay';
import { SceneConfig } from '@/types/scene';
import { updateSceneConfigBackground, updateSceneConfigGeometry, getDefaultGeometryForBackground } from '@/lib/sceneConfigUtils';
import type { Database } from "@database/supabase/types";

type DefaultGeometry = Database['public']['Tables']['default_geometries']['Row'];

const ExperienceLogic = () => {
  // Basic state - Initialize with default, will be updated when background loads
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

  // Initialize scene config with unique geometry when background and geometries are first loaded
  useEffect(() => {
    if (currentBackground && geometries && geometries.length > 0) {
      const defaultGeometryType = getDefaultGeometryForBackground(
        currentBackground.id, 
        geometries
      );
      
      // Only update if the geometry type is different to avoid unnecessary re-renders
      if (editableSceneConfig.type !== defaultGeometryType) {
        setEditableSceneConfig(prev => ({
          ...prev,
          type: defaultGeometryType
        }));
      }
    }
  }, [currentBackground?.id, geometries, editableSceneConfig.type]);

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
    const currentIndex = backgrounds?.findIndex(bg => bg.id === currentBackground?.id) || 0;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = backgrounds ? (currentIndex + 1) % backgrounds.length : 0;
    } else {
      newIndex = backgrounds ? (currentIndex - 1 + backgrounds.length) % backgrounds.length : 0;
    }
    
    changeBackground(direction);
    
    // Update scene config with new background and unique geometry
    if (backgrounds && backgrounds[newIndex] && editableSceneConfig) {
      const targetBackground = backgrounds[newIndex];
      let updatedConfig = updateSceneConfigBackground(editableSceneConfig, targetBackground);
      
      // Set unique default geometry for this background
      const defaultGeometryType = getDefaultGeometryForBackground(
        targetBackground.id, 
        geometries
      );
      updatedConfig = {
        ...updatedConfig,
        type: defaultGeometryType
      };
      
      setEditableSceneConfig(updatedConfig);
    }
  }, [changeBackground, backgrounds, currentBackground, editableSceneConfig, geometries]);

  const handleChangeGeometry = useCallback((direction: 'next' | 'prev') => {
    changeGeometry(direction);
  }, [changeGeometry]);

  const handleJumpToBackground = useCallback((backgroundIndex: number) => {
    jumpToBackground(backgroundIndex);
    // Update scene config when background changes
    if (backgrounds && backgrounds[backgroundIndex] && editableSceneConfig) {
      const targetBackground = backgrounds[backgroundIndex];
      let updatedConfig = updateSceneConfigBackground(editableSceneConfig, targetBackground);
      
      // Set unique default geometry for this background
      const defaultGeometryType = getDefaultGeometryForBackground(
        targetBackground.id, 
        geometries
      );
      updatedConfig = {
        ...updatedConfig,
        type: defaultGeometryType
      };
      
      setEditableSceneConfig(updatedConfig);
    }
  }, [jumpToBackground, backgrounds, editableSceneConfig, geometries]);

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