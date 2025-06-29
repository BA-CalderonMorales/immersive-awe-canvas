import { useExperience } from "@/hooks/useExperience";
import { useWorlds } from "@/hooks/useWorlds";
import { useExperienceState } from "@/hooks/useExperienceState";
import { useExperienceTransitions } from "@/hooks/useExperienceTransitions";
import { useExperienceCallbacks } from "@/hooks/useExperienceCallbacks";
import { useExperienceEffects } from "@/hooks/useExperienceEffects";
import { useWorldNavigation } from "@/hooks/useWorldNavigation";
import LoadingOverlay from "./LoadingOverlay";
import ExperienceContainer from "./ExperienceContainer";

interface ExperienceLogicProps {
  initialWorldSlug?: string;
}

const ExperienceLogic = ({ initialWorldSlug }: ExperienceLogicProps) => {
  const { theme, toggleTheme } = useExperience();
  
  const {
    worlds,
    isLoading,
    isError,
    worldData,
    currentWorldIndex,
    isTransitioning,
    jumpToWorld,
  } = useWorlds(initialWorldSlug);

  // Handle world navigation
  const { handleChangeWorld, handleJumpToWorld } = useWorldNavigation({
    worlds,
    currentWorldIndex,
    jumpToWorld,
  });

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
    isDragEnabled,
    toggleDragEnabled,
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

  if (isLoading) {
    return <LoadingOverlay message="Summoning Worlds..." theme="night" />;
  }

  if (isError) {
    return <LoadingOverlay message="Could not connect to the multiverse." theme="night" />;
  }

  return (
    <ExperienceContainer
      worldData={worldData}
      editableSceneConfig={editableSceneConfig}
      isTransitioning={isTransitioning}
      currentWorldIndex={currentWorldIndex}
      isObjectLocked={isObjectLocked}
      theme={theme}
      worlds={worlds}
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
      handleChangeWorld={handleChangeWorld}
      handleJumpToWorld={handleJumpToWorld}
      handleCopyCode={handleCopyCode}
      handleGoHome={handleGoHome}
      handleToggleShortcuts={handleToggleShortcuts}
      handleEntryTransitionEndWithHint={handleEntryTransitionEndWithHint}
      handleWorldTransitionEnd={handleWorldTransitionEnd}
      isDragEnabled={isDragEnabled}
      onToggleDrag={toggleDragEnabled}
    />
  );
};

export default ExperienceLogic;