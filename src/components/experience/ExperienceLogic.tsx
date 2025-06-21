
import { useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useWorlds } from "@/hooks/useWorlds";
import { useExperience } from "@/hooks/useExperience";
import { isSceneConfig } from "@/lib/typeguards";
import { useIsMobile } from "@/hooks/use-mobile";
import { useExperienceState } from "@/hooks/useExperienceState";
import { useExperienceTransitions } from "@/hooks/useExperienceTransitions";
import { useExperienceCallbacks } from "@/hooks/useExperienceCallbacks";
import { useExperienceEffects } from "@/hooks/useExperienceEffects";
import ExperienceUI from "./ExperienceUI";
import LoadingOverlay from "./LoadingOverlay";
import ExperienceHotkeys from "./ExperienceHotkeys";
import ExperienceTransitions from "./ExperienceTransitions";
import ExperienceLayout from "./ExperienceLayout";
import { motion, AnimatePresence } from "framer-motion";

interface ExperienceLogicProps {
  initialWorldSlug?: string;
}

const ExperienceLogic = ({ initialWorldSlug }: ExperienceLogicProps) => {

  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useExperience();
  const isMobile = useIsMobile();
  
  const {

    worlds,
    isLoading,
    isError,
    worldData,
    currentWorldIndex,
    isTransitioning,
    changeWorld,
    jumpToWorld,
    jumpToWorldBySlug,

  } = useWorlds(initialWorldSlug);
  
  // Sync URL with current world
  useEffect(() => {

    if (worldData && worldData.slug) {

      const expectedPath = `/experience/${worldData.slug}`;

      if (location.pathname !== expectedPath) {
        navigate(expectedPath, { replace: true });
      }

    }

  }, [worldData, location.pathname, navigate]);

  const handleChangeWorld = (direction: 'next' | 'prev') => {
    changeWorld(direction);
  };

  const handleJumpToWorld = (index: number) => {
    jumpToWorld(index);
  };

  const {

    editableSceneConfig,
    setEditableSceneConfig,
    isObjectLocked,
    toggleObjectLock,
    currentWorldId,
    setCurrentWorldId,
    isHelpOpen,
    setIsHelpOpen,
    isSearchOpen,
    setIsSearchOpen,
    isSettingsOpen,
    setIsSettingsOpen,
    isUiHidden,
    setIsUiHidden,
    showUiHint,
    setShowUiHint,
    hintShownRef,
    handleCopyCode,

  } = useExperienceState();

  const {

    showEntryTransition,
    showWorldTransition,
    handleEntryTransitionEnd,
    handleWorldTransitionEnd,

  } = useExperienceTransitions(isTransitioning);

  const {

    handleGoHome,
    handleToggleShortcuts,

  } = useExperienceCallbacks();

  const {

    handleEntryTransitionEndWithHint,

  } = useExperienceEffects({

    worldData,
    currentWorldId,
    setEditableSceneConfig,
    setCurrentWorldId,
    isSettingsOpen,
    setIsSettingsOpen,
    hintShownRef,
    setShowUiHint,
    handleEntryTransitionEnd,

  });

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

      <AnimatePresence mode="wait">

        <motion.div
          key={worldData.slug}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="w-full h-full"
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

export default ExperienceLogic;