import { useCallback, useEffect, useState } from "react";
import { createConfigUpdater } from "@/components/scene/controls/ConfigUpdateUtils";
import type { SceneConfig } from "@/types/scene";
import { useBackgrounds } from "./useBackgrounds";
import { useDefaultGeometries } from "./useDefaultGeometries";
import { useExperience } from "./useExperience";

/**
 * ViewModel for Scene Settings Panel
 * Implements MVVM pattern with proper separation of concerns
 */
export const useSceneSettingsViewModel = (
    sceneConfig: SceneConfig,
    onSceneUpdate: (config: SceneConfig) => void,
    isMotionFrozen?: boolean,
    onToggleMotion?: () => void
) => {
    const { theme } = useExperience();
    const {
        currentGeometry,
        geometries,
        jumpToGeometry,
        currentGeometryIndex,
    } = useDefaultGeometries();
    const {
        currentBackground,
        backgrounds,
        jumpToBackground,
        currentBackgroundIndex,
    } = useBackgrounds();

    // Local state for UI interactions
    const [selectedBackgroundId, setSelectedBackgroundId] = useState<
        string | null
    >(null);
    const [selectedGeometryId, setSelectedGeometryId] = useState<string | null>(
        null
    );

    // Initialize selections from current state
    useEffect(() => {
        if (currentBackground && !selectedBackgroundId) {
            setSelectedBackgroundId(currentBackground.id.toString());
        }
        if (currentGeometry && !selectedGeometryId) {
            setSelectedGeometryId(currentGeometry.id.toString());
        }
    }, [
        currentBackground,
        currentGeometry,
        selectedBackgroundId,
        selectedGeometryId,
    ]);

    // Scene update functions
    const updateMainObjectColor = useCallback(
        (color: string) => {
            const updater = createConfigUpdater(sceneConfig, onSceneUpdate);
            updater(config => {
                config[theme].mainObjectColor = color;
            });
        },
        [sceneConfig, onSceneUpdate, theme]
    );

    const updateMaterialProperty = useCallback(
        (property: string, value: string | number | boolean) => {
            const updater = createConfigUpdater(sceneConfig, onSceneUpdate);
            updater(config => {
                config[theme].material = {
                    ...config[theme].material,
                    [property]: value,
                };
            });
        },
        [sceneConfig, onSceneUpdate, theme]
    );

    const updateLightProperty = useCallback(
        (
            lightIndex: number,
            property: string,
            value: string | number | boolean | number[]
        ) => {
            const updater = createConfigUpdater(sceneConfig, onSceneUpdate);
            updater(config => {
                if (config[theme].lights[lightIndex]) {
                    config[theme].lights[lightIndex] = {
                        ...config[theme].lights[lightIndex],
                        [property]: value,
                    };
                }
            });
        },
        [sceneConfig, onSceneUpdate, theme]
    );

    const updateBackgroundProperty = useCallback(
        (property: string, value: string | number | boolean) => {
            const updater = createConfigUpdater(sceneConfig, onSceneUpdate);
            updater(config => {
                config[theme].background = {
                    ...config[theme].background,
                    [property]: value,
                };
            });
        },
        [sceneConfig, onSceneUpdate, theme]
    );

    // Background selection handler
    const handleBackgroundChange = useCallback(
        (backgroundId: string) => {
            setSelectedBackgroundId(backgroundId);
            const backgroundIndex = backgrounds?.findIndex(
                bg => bg.id === parseInt(backgroundId)
            );
            if (backgroundIndex !== undefined && backgroundIndex !== -1) {
                jumpToBackground(backgroundIndex);
            }
        },
        [backgrounds, jumpToBackground]
    );

    // Geometry selection handler
    const handleGeometryChange = useCallback(
        (geometryId: string) => {
            setSelectedGeometryId(geometryId);
            const geometryIndex = geometries?.findIndex(
                geo => geo.id === parseInt(geometryId)
            );
            if (geometryIndex !== undefined && geometryIndex !== -1) {
                jumpToGeometry(geometryIndex);
            }
        },
        [geometries, jumpToGeometry]
    );

    // Motion freeze handler
    const handleToggleMotion = useCallback(() => {
        if (onToggleMotion) {
            onToggleMotion();
        }
    }, [onToggleMotion]);

    // Scene reset handler
    const handleResetScene = useCallback(() => {
        // Reset to default scene configuration
        const defaultConfig: SceneConfig = {
            type: "TorusKnot",
            day: {
                mainObjectColor: "#ffffff",
                material: {
                    materialType: "standard",
                    metalness: 0.5,
                    roughness: 0.5,
                    emissive: "#000000",
                    emissiveIntensity: 0,
                    transparent: false,
                    opacity: 1,
                },
                background: {
                    type: "void",
                },
                lights: [
                    { type: "ambient", intensity: 1.5 },
                    {
                        type: "directional",
                        position: [10, 10, 5],
                        intensity: 1,
                    },
                ],
            },
            night: {
                mainObjectColor: "#ffffff",
                material: {
                    materialType: "standard",
                    metalness: 0.5,
                    roughness: 0.5,
                    emissive: "#000000",
                    emissiveIntensity: 0,
                    transparent: false,
                    opacity: 1,
                },
                background: {
                    type: "void",
                },
                lights: [
                    { type: "ambient", intensity: 0.8 },
                    {
                        type: "directional",
                        position: [10, 10, 5],
                        intensity: 0.5,
                    },
                ],
            },
        };
        onSceneUpdate(defaultConfig);
    }, [onSceneUpdate]);

    // Computed properties for UI
    const themeConfig = sceneConfig[theme];
    const availableBackgrounds = backgrounds || [];
    const availableGeometries = geometries || [];

    return {
        // State
        theme,
        themeConfig,
        isMotionFrozen: isMotionFrozen || false,
        selectedBackgroundId,
        selectedGeometryId,
        currentBackground,
        currentGeometry,
        availableBackgrounds,
        availableGeometries,
        currentBackgroundIndex,
        currentGeometryIndex,

        // Actions
        updateMainObjectColor,
        updateMaterialProperty,
        updateLightProperty,
        updateBackgroundProperty,
        handleBackgroundChange,
        handleGeometryChange,
        handleToggleMotion,
        handleResetScene,

        // Computed
        sceneConfig,
        onSceneUpdate,
    };
};
