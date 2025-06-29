
import { Canvas } from "@react-three/fiber";
import { useState, useEffect, useMemo } from "react";
import { SceneObjectsProvider } from "@/context/SceneObjectsContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ExperienceUI from "./ExperienceUI";
import ExperienceContent from "./ExperienceContent";
import ExperienceTransitions from "./ExperienceTransitions";
import LoadingOverlay from "./LoadingOverlay";
import { SceneConfig, WorldData } from "@/types/scene";
import { isSceneConfig } from "@/lib/typeguards";

interface ExperienceContainerProps {
  worldData: WorldData | null;
  editableSceneConfig: SceneConfig | null;
  isTransitioning: boolean;
  currentWorldIndex: number;
  isObjectLocked: boolean;
  theme: 'day' | 'night';
  worlds: WorldData[];
  isSettingsOpen: boolean;
  isUiHidden: boolean;
  showUiHint: boolean;
  isHelpOpen: boolean;
  isSearchOpen: boolean;
  showEntryTransition: boolean;
  showWorldTransition: boolean;
  toggleObjectLock: () => void;
  toggleTheme: () => void;
  setEditableSceneConfig: (config: SceneConfig) => void;
  setIsHelpOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsUiHidden: (hidden: boolean) => void;
  handleChangeWorld: (direction: 'next' | 'prev') => void;
  handleJumpToWorld: (worldIndex: number) => void;
  handleCopyCode: () => void;
  handleGoHome: () => void;
  handleToggleShortcuts: () => void;
  handleEntryTransitionEndWithHint: () => void;
  handleWorldTransitionEnd: () => void;
}

const ExperienceContainer = ({
  worldData,
  editableSceneConfig,
  isTransitioning,
  currentWorldIndex,
  isObjectLocked,
  theme,
  worlds,
  isSettingsOpen,
  isUiHidden,
  showUiHint,
  isHelpOpen,
  isSearchOpen,
  showEntryTransition,
  showWorldTransition,
  toggleObjectLock,
  toggleTheme,
  setEditableSceneConfig,
  setIsHelpOpen,
  setIsSearchOpen,
  setIsSettingsOpen,
  setIsUiHidden,
  handleChangeWorld,
  handleJumpToWorld,
  handleCopyCode,
  handleGoHome,
  handleToggleShortcuts,
  handleEntryTransitionEndWithHint,
  handleWorldTransitionEnd,
}: ExperienceContainerProps) => {
  const isMobile = useIsMobile();
  const [showBlurTransition, setShowBlurTransition] = useState(false);

  // Fix: Ensure uiColor updates properly when theme changes by adding explicit logging and dependency tracking
  const uiColor = useMemo(() => {
    if (!worldData) {
      console.log('ExperienceContainer - No worldData, using white');
      return 'white';
    }
    
    const dayColor = worldData.ui_day_color;
    const nightColor = worldData.ui_night_color;
    const selectedColor = theme === 'day' ? dayColor : nightColor;
    const finalColor = selectedColor || 'white';
    
    console.log('ExperienceContainer - uiColor calculation:', {
      worldSlug: worldData.slug,
      theme,
      dayColor,
      nightColor,
      selectedColor,
      finalColor
    });
    
    return finalColor;
  }, [worldData, theme, worldData?.ui_day_color, worldData?.ui_night_color]);

  // Add effect to log when uiColor changes
  useEffect(() => {
    console.log('ExperienceContainer - uiColor changed to:', uiColor, 'for theme:', theme);
  }, [uiColor, theme]);

  const handleBlurTransitionEnd = () => {
    setShowBlurTransition(false);
  };

  // Only show blur transition during world changes, not on initial load
  useEffect(() => {
    if (isTransitioning && !showEntryTransition) {
      setShowBlurTransition(true);
      const timer = setTimeout(() => {
        setShowBlurTransition(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, showEntryTransition]);

  if (!worldData) {
    return <LoadingOverlay message="Discovering worlds..." theme={theme} />;
  }

  if (!editableSceneConfig) {
    return <LoadingOverlay message="Initializing experience..." theme={theme} />;
  }

  if (!isSceneConfig(worldData.scene_config)) {
     return <LoadingOverlay message="Preparing world data..." theme={theme} />;
  }

  return (
    <SceneObjectsProvider mainObjectColor={worldData?.sceneConfig?.object?.color || '#ffffff'}>
      <div className="w-full h-screen relative overflow-hidden bg-black">
        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
          style={{ 
            touchAction: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none'
          }}
        >
          <ExperienceContent
            worldData={worldData}
            editableSceneConfig={editableSceneConfig}
            isObjectLocked={isObjectLocked}
            theme={theme}
          />
        </Canvas>

        <ExperienceUI
          worldName={worldData?.name || 'Unknown World'}
          theme={theme}
          isTransitioning={isTransitioning}
          editableSceneConfig={editableSceneConfig}
          uiColor={uiColor}
          onToggleTheme={toggleTheme}
          onChangeWorld={handleChangeWorld}
          onCopyCode={handleCopyCode}
          onUpdateSceneConfig={setEditableSceneConfig}
          onShowHelp={() => setIsHelpOpen(true)}
          onGoHome={handleGoHome}
          onShowSearch={() => setIsSearchOpen(true)}
          isSettingsOpen={isSettingsOpen}
          onToggleSettings={setIsSettingsOpen}
          isUiHidden={isUiHidden}
          onToggleUiHidden={() => setIsUiHidden(!isUiHidden)}
          showUiHint={showUiHint}
        />

        <ExperienceTransitions
          showEntryTransition={showEntryTransition}
          showWorldTransition={showWorldTransition}
          onEntryTransitionEnd={handleEntryTransitionEndWithHint}
          onWorldTransitionEnd={handleWorldTransitionEnd}
          theme={theme}
          isHelpOpen={isHelpOpen}
          isSearchOpen={isSearchOpen}
          worlds={worlds}
          onCloseHelp={() => setIsHelpOpen(false)}
          onCloseSearch={() => setIsSearchOpen(false)}
          onJumpToWorld={handleJumpToWorld}
          onToggleShortcuts={handleToggleShortcuts}
        />
      </div>
    </SceneObjectsProvider>
  );
};

export default ExperienceContainer;
