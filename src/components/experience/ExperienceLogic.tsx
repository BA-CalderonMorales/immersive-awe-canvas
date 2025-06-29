
import { useParams } from "react-router-dom";
import { useExperience } from "@/hooks/useExperience";
import { useWorlds } from "@/hooks/useWorlds";
import { useExperienceState } from "@/hooks/useExperienceState";
import { useExperienceTransitions } from "@/hooks/useExperienceTransitions";
import { useExperienceCallbacks } from "@/hooks/useExperienceCallbacks";
import { useExperienceEffects } from "@/hooks/useExperienceEffects";
import { useWorldNavigation } from "@/hooks/useWorldNavigation";
import LoadingOverlay from "./LoadingOverlay";
import ExperienceContainer from "./ExperienceContainer";

const ExperienceLogic = () => {
  const { worldSlug } = useParams<{ worldSlug: string }>();
  const { theme, toggleTheme } = useExperience();
  
  console.log('ExperienceLogic rendering with worldSlug:', worldSlug);
  
  const {
    worlds,
    isLoading,
    isError,
    worldData,
    currentWorldIndex,
    isTransitioning,
    jumpToWorld,
  } = useWorlds(worldSlug);

  console.log('ExperienceLogic - worlds:', worlds?.length, 'worldData:', worldData?.name, 'isLoading:', isLoading, 'isError:', isError);

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
    console.log('ExperienceLogic - showing loading overlay');
    return <LoadingOverlay message="Summoning Worlds..." theme="night" />;
  }

  if (isError) {
    console.log('ExperienceLogic - showing error overlay');
    return <LoadingOverlay message="Could not connect to the multiverse." theme="night" />;
  }

  if (!worldData) {
    console.log('ExperienceLogic - no world data, showing loading');
    return <LoadingOverlay message="Discovering worlds..." theme="night" />;
  }

  console.log('ExperienceLogic - rendering ExperienceContainer with worldData:', worldData.name);

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
    />
  );
};

export default ExperienceLogic;
