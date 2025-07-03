import { useExperience } from "@/hooks/useExperience";
import { useBackgrounds } from "@/hooks/useBackgrounds";
import { useDefaultGeometries } from "@/hooks/useDefaultGeometries";
import { useExperienceState } from "@/hooks/useExperienceState";
import { useExperienceTransitions } from "@/hooks/useExperienceTransitions";
import { useExperienceCallbacks } from "@/hooks/useExperienceCallbacks";
import { useExperienceEffects } from "@/hooks/useExperienceEffects";
import LoadingOverlay from "./LoadingOverlay";
import ExperienceContainer from "./ExperienceContainer";

interface ExperienceLogicProps {
  initialWorldSlug?: string;
}

const ExperienceLogic = ({ initialWorldSlug }: ExperienceLogicProps) => {
  const { theme, toggleTheme } = useExperience();
  
  const {
    backgrounds,
    isLoading: backgroundsLoading,
    isError: backgroundsError,
    currentBackground,
    currentBackgroundIndex,
    isTransitioning,
    changeBackground,
  } = useBackgrounds();

  const {
    geometries,
    isLoading: geometriesLoading,
    isError: geometriesError,
    currentGeometry,
  } = useDefaultGeometries();

  const isLoading = backgroundsLoading || geometriesLoading;
  const isError = backgroundsError || geometriesError;

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

  // Debug logging
  console.log('🔍 ExperienceLogic Debug:', {
    isLoading,
    backgroundsLoading,
    geometriesLoading,
    backgroundsError,
    geometriesError,
    currentBackground,
    currentGeometry,
    backgroundsCount: backgrounds?.length,
    geometriesCount: geometries?.length
  });

  if (isLoading) {
    return <LoadingOverlay message="Loading Experience..." theme="night" />;
  }

  if (isError) {
    return <LoadingOverlay message="Could not load experience data." theme="night" />;
  }

  // Create a fallback if no data is available
  if (!currentGeometry && !geometriesLoading) {
    return <LoadingOverlay message="No geometries available." theme="night" />;
  }

  if (!currentBackground && !backgroundsLoading) {
    return <LoadingOverlay message="No backgrounds available." theme="night" />;
  }

  return (
    <ExperienceContainer
      worldData={currentGeometry}
      editableSceneConfig={editableSceneConfig}
      isTransitioning={isTransitioning}
      currentWorldIndex={currentBackgroundIndex}
      isObjectLocked={isObjectLocked}
      theme={theme}
      worlds={backgrounds}
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
      handleChangeBackground={changeBackground}
      handleJumpToWorld={() => {}}
      handleCopyCode={handleCopyCode}
      handleGoHome={handleGoHome}
      handleToggleShortcuts={handleToggleShortcuts}
      handleEntryTransitionEndWithHint={handleEntryTransitionEndWithHint}
      handleWorldTransitionEnd={handleWorldTransitionEnd}
      isDragEnabled={isDragEnabled}
      onToggleDrag={toggleDragEnabled}
      currentBackground={currentBackground}
      currentGeometry={currentGeometry}
    />
  );
};

export default ExperienceLogic;