import type { Json } from "@database/supabase/types";
import type { SceneConfig, SceneThemeConfig } from "@client/types/scene";

/**
 * Consolidated typeguards for runtime type checking
 * This module serves as the single source of truth for all type validation
 * across client, server, and utility modules.
 */

export function isSceneThemeConfig(
    config: Json | null
): config is SceneThemeConfig {
    if (
        config === null ||
        typeof config !== "object" ||
        Array.isArray(config)
    ) {
        return false;
    }
    const c = config as Record<string, unknown>;
    return (
        "mainObjectColor" in c &&
        typeof c.mainObjectColor === "string" &&
        "material" in c &&
        typeof c.material === "object" &&
        "background" in c &&
        typeof c.background === "object" &&
        "lights" in c &&
        Array.isArray(c.lights)
    );
}

export function isSceneConfig(config: Json | null): config is SceneConfig {
    if (
        config === null ||
        typeof config !== "object" ||
        Array.isArray(config)
    ) {
        return false;
    }
    const c = config as Record<string, unknown>;
    const validSceneTypes = [
        "TorusKnot",
        "WobbleField",
        "DistortionSphere",
        "MorphingIcosahedron",
        "WavyGrid",
        "CrystallineSpire",
        "JellyTorus",
    ];
    return (
        "type" in c &&
        typeof c.type === "string" &&
        validSceneTypes.includes(c.type) &&
        "day" in c &&
        isSceneThemeConfig(c.day as Json) &&
        "night" in c &&
        isSceneThemeConfig(c.night as Json)
    );
}

export const isValidObjectType = (type: unknown): boolean => {
    const validTypes = [
        "torusKnot",
        "distortionSphere",
        "morphingIcosahedron",
        "wavyGrid",
        "crystallineSpire",
        "wobbleField",
        "jellyTorus",
    ];
    return typeof type === "string" && validTypes.includes(type);
};

/**
 * Additional utility type guards for security and validation
 */

export const isDefined = <T>(value: T | null | undefined): value is T => {
    return value !== null && value !== undefined;
};

export const isValidString = (value: unknown): value is string => {
    return typeof value === "string" && value.length > 0;
};