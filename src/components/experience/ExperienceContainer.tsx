
import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isSceneConfig } from "@/lib/typeguards";
import { useIsMobile } from "@/hooks/use-mobile";
import ExperienceUI from "./ExperienceUI";
import ExperienceHotkeys from "./ExperienceHotkeys";
import ExperienceTransitions from "./ExperienceTransitions";
import ExperienceLayout from "./ExperienceLayout";
import LoadingOverlay from "./LoadingOverlay";

interface ExperienceContainerProps {
  worldData: any;
  editableSceneConfig: any;
  isTransitioning: boolean;
  currentWorldIndex: number;
  isObjectLocked: boolean;
  theme: 'day' | 'night';
  worlds: any[];
  // UI state
  isSettingsOpen: boolean;
  isUiHidden: boolean;
  showUiHint: boolean;
  isHelpOpen: boolean;
  isSearchOpen: boolean;
  // Transition state
  showEntryTransition: boolean;
  showWorldTransition: boolean;
  // Callbacks
  toggleObjectLock: () => void;
  toggleTheme: () => void;
  setEditableSceneConfig: (config: any) => void;
  setIsHelpOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  setIsUiHidden: (hidden: boolean | ((prev: boolean) => boolean)) => void;
  handleChangeWorld: (direction: 'next' | 'prev') => void;
  handleJumpToWorld: (index: number) => void;
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

  const uiColor = useMemo(() => {
    if (!worldData) return 'white';
    const color = theme === 'day' ? worldData.ui_day_color : worldData.ui_night_color;
    return color || 'white';
  }, [worldData, theme]);

  if (!worldData) {
    return <LoadingOverlay message="No worlds found." theme="night" />;
  }

  if (!editableSceneConfig) {
    return <LoadingOverlay message="Initializing Scene..." theme="night" />;
  }

  if (!isSceneConfig(worldData.scene_config)) {
     return <LoadingOverlay message="World data is incomplete or corrupted." theme="night" />;
  }

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={worldData.slug}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 w-screen h-screen"
        >
          <ExperienceTransitions
            showEntryTransition={showEntryTransition}
            showWorldTransition={showWorldTransition}
            theme={theme}
            onEntryTransitionEnd={handleEntryTransitionEndWithHint}
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
            onChangeWorld={handleChangeWorld}
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
            changeWorld={handleChangeWorld}
            handleGoHome={handleGoHome}
            handleCopyCode={handleCopyCode}
            toggleObjectLock={toggleObjectLock}
            handleToggleShortcuts={handleToggleShortcuts}
            setIsSearchOpen={setIsSearchOpen}
            setIsHelpOpen={setIsHelpOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            setIsUiHidden={setIsUiHidden}
            isHelpOpen={isHelpOpen}
            isSearchOpen={isSearchOpen}
            isSettingsOpen={isSettingsOpen}
            worlds={worlds}
            jumpToWorld={handleJumpToWorld}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExperienceContainer;
