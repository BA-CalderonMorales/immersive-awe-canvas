import { useCallback, useEffect, useRef, useState } from "react";
import { useBackgrounds } from "@/hooks/useBackgrounds";
import { useDefaultGeometries } from "@/hooks/useDefaultGeometries";
import { useWorlds } from "@/hooks/useWorlds";
import { useExperience } from "@/hooks/useExperience";
import { useExperienceEffects } from "@/hooks/useExperienceEffects";
import { useHotkeyActions } from "@/hooks/useHotkeyActions";
import {
    getDefaultGeometryForBackground,
    updateSceneConfigBackground,
    updateSceneConfigGeometry,
} from "@/lib/sceneConfigUtils";
import type { SceneConfig } from "@/types/scene";
import ExperienceContainer from "./ExperienceContainer";
import LoadingOverlay from "./LoadingOverlay";

// type DefaultGeometry =
//     Database["public"]["Tables"]["default_geometries"]["Row"];

// Helper function: Calculate new index for circular navigation
const calculateNewIndex = (
    currentIndex: number,
    totalLength: number,
    direction: "next" | "prev"
): number => {
    if (direction === "next") {
        return (currentIndex + 1) % totalLength;
    }
    return (currentIndex - 1 + totalLength) % totalLength;
};

// Helper function: Update scene config with background
const updateSceneConfigWithBackground = (
    backgrounds: any[] | null,
    backgroundIndex: number,
    editableSceneConfig: SceneConfig | null
): SceneConfig | null => {
    if (!backgrounds?.[backgroundIndex] || !editableSceneConfig) {
        return null;
    }

    const targetBackground = backgrounds[backgroundIndex];
    return updateSceneConfigBackground(editableSceneConfig, targetBackground);
};

// Helper function: Update scene config with geometry
const updateSceneConfigWithGeometry = (
    geometries: any[] | null,
    geometryIndex: number,
    editableSceneConfig: SceneConfig | null
): SceneConfig | null => {
    if (!geometries?.[geometryIndex] || !editableSceneConfig) {
        return null;
    }

    const targetGeometry = geometries[geometryIndex];
    return updateSceneConfigGeometry(editableSceneConfig, targetGeometry);
};

const ExperienceLogic = () => {
    // Basic state - Initialize with default, will be updated when background loads
    const [editableSceneConfig, setEditableSceneConfig] = useState<SceneConfig>(
        {
            type: "TorusKnot",
            day: {
                lights: [{ type: "ambient", intensity: 1 }],
                material: { materialType: "standard" },
                background: { type: "void" },
                mainObjectColor: "#ffffff",
            },
            night: {
                lights: [{ type: "ambient", intensity: 0.5 }],
                material: { materialType: "standard" },
                background: { type: "void" },
                mainObjectColor: "#ffffff",
            },
        }
    );
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
    const {
        backgrounds,
        currentBackground,
        isTransitioning,
        changeBackground,
        jumpToBackground,
    } = useBackgrounds();
    const { geometries, currentGeometry, changeGeometry, jumpToGeometry } =
        useDefaultGeometries();
    const {
        worlds,
        worldData,
        isTransitioning: worldsTransitioning,
        changeWorld,
        jumpToWorld,
    } = useWorlds();
    const { theme, toggleTheme } = useExperience();

    // Update scene config when world changes - use database configuration
    useEffect(() => {
        // Early return: Apply world scene config from database if available
        if (worldData?.sceneConfig) {
            console.log(
                "Applying world scene config from database:",
                worldData.sceneConfig
            );
            setEditableSceneConfig(worldData.sceneConfig);
            setCurrentWorldId(worldData.id);
            return;
        }

        // Early return: Skip if required data not available
        if (!currentBackground || !geometries || geometries.length === 0) {
            return;
        }

        // Fallback: Initialize scene config with unique geometry
        const defaultGeometryType = getDefaultGeometryForBackground(
            currentBackground.id,
            geometries
        );

        // Early return: Skip update if geometry type is already correct
        if (editableSceneConfig.type === defaultGeometryType) {
            return;
        }

        setEditableSceneConfig(prev => ({
            ...prev,
            type: defaultGeometryType,
        }));
    }, [
        worldData?.sceneConfig,
        worldData?.id,
        currentBackground?.id,
        geometries,
        editableSceneConfig.type,
        currentBackground,
    ]);

    // Helper functions
    const toggleObjectLock = useCallback(
        () => setIsObjectLocked(prev => !prev),
        []
    );
    const toggleDragEnabled = useCallback(
        () => setIsDragEnabled(prev => !prev),
        []
    );
    const toggleMotionFreeze = useCallback(
        () => setIsMotionFrozen(prev => !prev),
        []
    );
    const handleEntryTransitionEnd = useCallback(
        () => setShowEntryTransition(false),
        []
    );
    const handleWorldTransitionEnd = useCallback(
        () => setShowWorldTransition(false),
        []
    );
    const handleCopyCode = useCallback(() => {
        // Copy current scene config to clipboard
        navigator.clipboard.writeText(
            JSON.stringify(editableSceneConfig, null, 2)
        );
    }, [editableSceneConfig]);
    const handleGoHome = useCallback(() => {
        window.location.href = "/";
    }, []);
    const handleToggleShortcuts = useCallback(() => {
        // Toggle keyboard shortcuts overlay
    }, []);

    // Hotkey callbacks
    const hotkeyCallbacks = {
        toggleTheme,
        changeWorld: changeWorld,
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
    const handleChangeBackground = useCallback(
        (direction: "next" | "prev") => {
            // Early return: Guard against missing backgrounds
            if (!backgrounds || backgrounds.length === 0) {
                return;
            }

            const currentIndex =
                backgrounds.findIndex(bg => bg.id === currentBackground?.id) || 0;

            const newIndex = calculateNewIndex(
                currentIndex,
                backgrounds.length,
                direction
            );

            changeBackground(direction);

            const updatedConfig = updateSceneConfigWithBackground(
                backgrounds,
                newIndex,
                editableSceneConfig
            );

            if (updatedConfig) {
                setEditableSceneConfig(updatedConfig);
            }
        },
        [changeBackground, backgrounds, currentBackground, editableSceneConfig]
    );

    const handleChangeGeometry = useCallback(
        (direction: "next" | "prev") => {
            changeGeometry(direction);
        },
        [changeGeometry]
    );

    const handleJumpToBackground = useCallback(
        (backgroundIndex: number) => {
            jumpToBackground(backgroundIndex);

            const updatedConfig = updateSceneConfigWithBackground(
                backgrounds,
                backgroundIndex,
                editableSceneConfig
            );

            if (updatedConfig) {
                setEditableSceneConfig(updatedConfig);
            }
        },
        [jumpToBackground, backgrounds, editableSceneConfig]
    );

    const handleJumpToGeometry = useCallback(
        (geometryIndex: number) => {
            jumpToGeometry(geometryIndex);

            const updatedConfig = updateSceneConfigWithGeometry(
                geometries,
                geometryIndex,
                editableSceneConfig
            );

            if (updatedConfig) {
                setEditableSceneConfig(updatedConfig);
            }
        },
        [jumpToGeometry, geometries, editableSceneConfig]
    );

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

    // Early return: Loading states
    if (!backgrounds || !geometries) {
        return <LoadingOverlay message="Loading experience..." theme="night" />;
    }

    // Early return: Ensure data is available
    if (!currentGeometry || !currentBackground) {
        return <LoadingOverlay message="Waiting for data..." theme="night" />;
    }

    return (
        <ExperienceContainer
            worldData={worldData}
            editableSceneConfig={editableSceneConfig}
            isTransitioning={isTransitioning || worldsTransitioning}
            currentWorldIndex={0}
            isObjectLocked={isObjectLocked}
            theme={theme}
            worlds={worlds || []}
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
            handleJumpToWorld={jumpToWorld}
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
