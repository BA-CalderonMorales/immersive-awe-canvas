import { useExperience } from "@/hooks/useExperience";
import { useBackgrounds } from "@/hooks/useBackgrounds";
import { useDefaultGeometries } from "@/hooks/useDefaultGeometries";
import { useExperienceState } from "@/hooks/useExperienceState";
import { useExperienceTransitions } from "@/hooks/useExperienceTransitions";
import { useExperienceCallbacks } from "@/hooks/useExperienceCallbacks";
import { useExperienceEffects } from "@/hooks/useExperienceEffects";
import LoadingOverlay from "./LoadingOverlay";
import ExperienceContainer from "./ExperienceContainer";

const ExperienceLogic = () => {
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
    currentGeometryIndex,
    changeGeometry,
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
    worldData: currentGeometry ? {
      ...currentGeometry,
      scene_config: { type: currentGeometry.geometry_type }
    } : null,
    currentWorldId,
    setEditableSceneConfig,
    setCurrentWorldId,
    isSettingsOpen,
    setIsSettingsOpen,
    hintShownRef,
    setShowUiHint,
    handleEntryTransitionEnd,
  });

  // Show minimal scene while loading instead of blocking overlay

  if (isLoading) {
    console.log('🔍 Still loading because:', { backgroundsLoading, geometriesLoading });
    // Show minimal scene while loading instead of blocking overlay
    return (
      <ExperienceContainer
        worldData={{ name: "Loading..." }}
        editableSceneConfig={{
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
        }}
        isTransitioning={true}
        currentWorldIndex={0}
        isObjectLocked={true}
        theme={theme}
        worlds={[]}
        isSettingsOpen={false}
        isUiHidden={false}
        showUiHint={false}
        isHelpOpen={false}
        isSearchOpen={false}
        showEntryTransition={false}
        showWorldTransition={false}
        toggleObjectLock={() => {}}
        toggleTheme={toggleTheme}
        setEditableSceneConfig={() => {}}
        setIsHelpOpen={() => {}}
        setIsSearchOpen={() => {}}
        setIsSettingsOpen={() => {}}
        setIsUiHidden={() => {}}
        handleChangeBackground={() => {}}
        handleChangeGeometry={() => {}}
        handleJumpToWorld={() => {}}
        handleCopyCode={() => {}}
        handleGoHome={() => {}}
        handleToggleShortcuts={() => {}}
        handleEntryTransitionEndWithHint={() => {}}
        handleWorldTransitionEnd={() => {}}
        isDragEnabled={false}
        onToggleDrag={() => {}}
        currentBackground={null}
        currentGeometry={null}
      />
    );
  }

  if (isError) {
    console.log('🔍 Error state:', { backgroundsError, geometriesError });
    return <LoadingOverlay message="Could not load experience data." theme="night" />;
  }

  // Ensure data is available
  if (!currentGeometry || !currentBackground) {
    console.log('🔍 Missing data:', { 
      hasCurrentGeometry: !!currentGeometry, 
      hasCurrentBackground: !!currentBackground,
      geometriesLength: geometries?.length,
      backgroundsLength: backgrounds?.length 
    });
    return <LoadingOverlay message="Waiting for data..." theme="night" />;
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
      handleChangeGeometry={changeGeometry}
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