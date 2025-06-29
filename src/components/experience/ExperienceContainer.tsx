
import { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useExperienceUIColor } from "@/hooks/useExperienceUIColor";
import { useExperienceBlurTransition } from "@/hooks/useExperienceBlurTransition";
import ExperienceUI from "./ExperienceUI";
import ExperienceCanvas from "./ExperienceCanvas";
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
  const uiColor = useExperienceUIColor(worldData, theme);
  const { showBlurTransition, handleBlurTransitionEnd } = useExperienceBlurTransition(isTransitioning, showEntryTransition);

  if (!worldData) {
    return <LoadingOverlay message="Discovering worlds..." theme={theme} />;
  }

  if (!editableSceneConfig) {
    return <LoadingOverlay message="Initializing experience..." theme={theme} />;
  }

  if (!isSceneConfig(worldData.scene_config)) {
     return <LoadingOverlay message="Preparing world data..." theme={theme} />;
  }

  // Get the main object color from the current theme config
  const themeConfig = theme === 'day' ? editableSceneConfig.day : editableSceneConfig.night;
  const mainObjectColor = themeConfig?.mainObjectColor || '#ffffff';

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black">
      <ExperienceCanvas
        worldData={worldData}
        editableSceneConfig={editableSceneConfig}
        isObjectLocked={isObjectLocked}
        theme={theme}
        mainObjectColor={mainObjectColor}
      />

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
        showBlurTransition={showBlurTransition}
        onEntryTransitionEnd={handleEntryTransitionEndWithHint}
        onWorldTransitionEnd={handleWorldTransitionEnd}
        onBlurTransitionEnd={handleBlurTransitionEnd}
        theme={theme}
      />
    </div>
  );
};

export default ExperienceContainer;
