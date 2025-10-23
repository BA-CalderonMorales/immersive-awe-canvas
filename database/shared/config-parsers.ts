import type { Json } from "../supabase/types";
import { isSceneConfig, isBackgroundConfig } from "./typeguards";
import type {
    WorldRow,
    BackgroundRow,
    ParsedWorld,
    ParsedBackground,
} from "./types";

/**
 * Safely parses a JSON value and validates it against a type guard
 */
function safeParseJson<T extends Json>(
    jsonValue: Json | null,
    typeGuard: (value: Json | null) => value is T,
    fallback: T | null = null
): T | null {
    if (jsonValue === null) {
        return fallback;
    }

    try {
        // If it's already an object, validate it directly
        if (typeGuard(jsonValue)) {
            return jsonValue;
        }
        return fallback;
    } catch (error) {
        console.warn("Failed to parse JSON configuration:", error);
        return fallback;
    }
}

/**
 * Parses a world row from the database into a type-safe ParsedWorld
 */
export function parseWorldRow(worldRow: WorldRow): ParsedWorld {
    const sceneConfig = safeParseJson(
        worldRow.scene_config,
        isSceneConfig,
        null
    );

    return {
        id: worldRow.id,
        name: worldRow.name,
        slug: worldRow.slug,
        sceneConfig,
        uiDayColor: worldRow.ui_day_color,
        uiNightColor: worldRow.ui_night_color,
        isFeatured: worldRow.is_featured,
        createdAt: worldRow.created_at,
        description: worldRow.description,
    };
}

/**
 * Parses a background row from the database into a type-safe ParsedBackground
 */
export function parseBackgroundRow(
    backgroundRow: BackgroundRow
): ParsedBackground {
    const backgroundConfig = safeParseJson(
        backgroundRow.background_config,
        isBackgroundConfig,
        null
    );

    return {
        id: backgroundRow.id,
        name: backgroundRow.name,
        backgroundConfig,
        isFeatured: backgroundRow.is_featured,
        sortOrder: backgroundRow.sort_order,
        createdAt: backgroundRow.created_at,
        description: backgroundRow.description,
    };
}

/**
 * Parses an array of world rows into parsed worlds
 */
export function parseWorldRows(worldRows: WorldRow[]): ParsedWorld[] {
    return worldRows.map(parseWorldRow);
}

/**
 * Parses an array of background rows into parsed backgrounds
 */
export function parseBackgroundRows(
    backgroundRows: BackgroundRow[]
): ParsedBackground[] {
    return backgroundRows.map(parseBackgroundRow);
}
