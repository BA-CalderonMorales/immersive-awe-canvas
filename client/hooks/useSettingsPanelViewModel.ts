/**
 * Settings Panel ViewModel - Proper MVVM Implementation
 * Following TDD principles and MEMORY.md guidelines
 *
 * This ViewModel manages all settings panel state and behavior,
 * providing a clean separation between UI and business logic
 */

import { useCallback, useState } from "react";
import type { SceneConfig } from "@/types/scene";
import { useExperience } from "./useExperience";

type SettingsAction =
    | { type: "UPDATE_MAIN_COLOR"; payload: string }
    | {
          type: "UPDATE_MATERIAL_PROPERTY";
          payload: { property: string; value: string | number | boolean };
      }
    | {
          type: "UPDATE_LIGHT_PROPERTY";
          payload: {
              lightIndex: number;
              property: string;
              value: string | number | boolean | number[];
          };
      }
    | {
          type: "UPDATE_BACKGROUND_PROPERTY";
          payload: { property: string; value: string | number | boolean };
      }
    | { type: "RESET_SCENE" }
    | { type: "TOGGLE_MOTION" };

interface SettingsPanelViewModelOptions {
    sceneConfig: SceneConfig;
    onSceneUpdate: (config: SceneConfig) => void;
    isMotionFrozen?: boolean;
    onToggleMotion?: () => void;
}

/**
 * Default scene configuration for reset functionality
 */
const createDefaultSceneConfig = (): SceneConfig => ({
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
            { type: "directional", position: [10, 10, 5], intensity: 1 },
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
            { type: "directional", position: [10, 10, 5], intensity: 0.5 },
        ],
    },
});

/**
 * Pure function to update scene config immutably
 */
const updateSceneConfig = (
    currentConfig: SceneConfig,
    action: SettingsAction,
    theme: "day" | "night"
): SceneConfig => {
    switch (action.type) {
        case "UPDATE_MAIN_COLOR":
            return {
                ...currentConfig,
                [theme]: {
                    ...currentConfig[theme],
                    mainObjectColor: action.payload,
                },
            };

        case "UPDATE_MATERIAL_PROPERTY":
            return {
                ...currentConfig,
                [theme]: {
                    ...currentConfig[theme],
                    material: {
                        ...currentConfig[theme].material,
                        [action.payload.property]: action.payload.value,
                    },
                },
            };

        case "UPDATE_LIGHT_PROPERTY": {
            const updatedLights = [...currentConfig[theme].lights];
            if (updatedLights[action.payload.lightIndex]) {
                updatedLights[action.payload.lightIndex] = {
                    ...updatedLights[action.payload.lightIndex],
                    [action.payload.property]: action.payload.value,
                };
            }
            return {
                ...currentConfig,
                [theme]: {
                    ...currentConfig[theme],
                    lights: updatedLights,
                },
            };
        }

        case "UPDATE_BACKGROUND_PROPERTY":
            return {
                ...currentConfig,
                [theme]: {
                    ...currentConfig[theme],
                    background: {
                        ...currentConfig[theme].background,
                        [action.payload.property]: action.payload.value,
                    },
                },
            };

        case "RESET_SCENE":
            return createDefaultSceneConfig();

        default:
            return currentConfig;
    }
};

/**
 * Settings Panel ViewModel Hook
 * Implements MVVM pattern with immutable state updates
 */
export const useSettingsPanelViewModel = ({
    sceneConfig,
    onSceneUpdate,
    isMotionFrozen = false,
    onToggleMotion,
}: SettingsPanelViewModelOptions) => {
    const { theme } = useExperience();

    // Internal state for UI interactions
    const [isDirty, setIsDirty] = useState(false);

    // Helper function to dispatch scene updates
    const dispatchSceneUpdate = useCallback(
        (action: SettingsAction) => {
            const updatedConfig = updateSceneConfig(sceneConfig, action, theme);
            onSceneUpdate(updatedConfig);
            setIsDirty(true);

            // Reset dirty flag after a short delay
            setTimeout(() => setIsDirty(false), 100);
        },
        [sceneConfig, onSceneUpdate, theme]
    );

    // Main object color handlers
    const updateMainObjectColor = useCallback(
        (color: string) => {
            dispatchSceneUpdate({ type: "UPDATE_MAIN_COLOR", payload: color });
        },
        [dispatchSceneUpdate]
    );

    // Material property handlers
    const updateMaterialProperty = useCallback(
        (property: string, value: string | number | boolean) => {
            dispatchSceneUpdate({
                type: "UPDATE_MATERIAL_PROPERTY",
                payload: { property, value },
            });
        },
        [dispatchSceneUpdate]
    );

    const updateMaterialType = useCallback(
        (materialType: string) => {
            updateMaterialProperty("materialType", materialType);
        },
        [updateMaterialProperty]
    );

    const updateMaterialMetalness = useCallback(
        (metalness: number) => {
            updateMaterialProperty("metalness", metalness);
        },
        [updateMaterialProperty]
    );

    const updateMaterialRoughness = useCallback(
        (roughness: number) => {
            updateMaterialProperty("roughness", roughness);
        },
        [updateMaterialProperty]
    );

    // Light property handlers
    const updateLightProperty = useCallback(
        (
            lightIndex: number,
            property: string,
            value: string | number | boolean | number[]
        ) => {
            dispatchSceneUpdate({
                type: "UPDATE_LIGHT_PROPERTY",
                payload: { lightIndex, property, value },
            });
        },
        [dispatchSceneUpdate]
    );

    const updateAmbientLightIntensity = useCallback(
        (intensity: number) => {
            // Find ambient light index
            const ambientIndex = sceneConfig[theme].lights.findIndex(
                light => light.type === "ambient"
            );
            if (ambientIndex !== -1) {
                updateLightProperty(ambientIndex, "intensity", intensity);
            }
        },
        [updateLightProperty, sceneConfig, theme]
    );

    const updateDirectionalLightIntensity = useCallback(
        (intensity: number) => {
            // Find directional light index
            const directionalIndex = sceneConfig[theme].lights.findIndex(
                light => light.type === "directional"
            );
            if (directionalIndex !== -1) {
                updateLightProperty(directionalIndex, "intensity", intensity);
            }
        },
        [updateLightProperty, sceneConfig, theme]
    );

    // Background property handlers
    const updateBackgroundProperty = useCallback(
        (property: string, value: string | number | boolean) => {
            dispatchSceneUpdate({
                type: "UPDATE_BACKGROUND_PROPERTY",
                payload: { property, value },
            });
        },
        [dispatchSceneUpdate]
    );

    const updateBackgroundType = useCallback(
        (backgroundType: string) => {
            updateBackgroundProperty("type", backgroundType);
        },
        [updateBackgroundProperty]
    );

    // Scene management handlers
    const resetScene = useCallback(() => {
        dispatchSceneUpdate({ type: "RESET_SCENE" });
    }, [dispatchSceneUpdate]);

    const toggleMotion = useCallback(() => {
        if (onToggleMotion) {
            onToggleMotion();
        }
    }, [onToggleMotion]);

    // Computed values for UI
    const currentThemeConfig = sceneConfig[theme];
    const mainObjectColor = currentThemeConfig.mainObjectColor;
    const materialConfig = currentThemeConfig.material;
    const backgroundConfig = currentThemeConfig.background;
    const lightsConfig = currentThemeConfig.lights;

    // Get specific light values for UI
    const ambientLight = lightsConfig.find(light => light.type === "ambient");
    const directionalLight = lightsConfig.find(
        light => light.type === "directional"
    );

    return {
        // State
        theme,
        isDirty,
        isMotionFrozen,
        mainObjectColor,
        materialConfig,
        backgroundConfig,
        lightsConfig,
        ambientLightIntensity: ambientLight?.intensity || 1,
        directionalLightIntensity: directionalLight?.intensity || 1,

        // Actions - Main Object
        updateMainObjectColor,

        // Actions - Material
        updateMaterialType,
        updateMaterialMetalness,
        updateMaterialRoughness,
        updateMaterialProperty,

        // Actions - Lights
        updateAmbientLightIntensity,
        updateDirectionalLightIntensity,
        updateLightProperty,

        // Actions - Background
        updateBackgroundType,
        updateBackgroundProperty,

        // Actions - Scene Management
        resetScene,
        toggleMotion,

        // Computed Values
        sceneConfig,
        currentThemeConfig,
    };
};
