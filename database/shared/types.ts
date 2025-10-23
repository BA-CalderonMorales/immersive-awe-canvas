import type { Database } from "@database/supabase/types";
import type { SceneConfig, BackgroundConfig } from "@client/types/scene";

// Database row types
export type WorldRow = Database["public"]["Tables"]["worlds"]["Row"];
export type BackgroundRow = Database["public"]["Tables"]["backgrounds"]["Row"];

// Parsed configuration types
export interface ParsedWorld {
    id: number;
    name: string;
    slug: string | null;
    sceneConfig: SceneConfig | null;
    uiDayColor: string | null;
    uiNightColor: string | null;
    isFeatured: boolean | null;
    createdAt: string;
    description: string | null;
}

export interface ParsedBackground {
    id: number;
    name: string;
    backgroundConfig: BackgroundConfig | null;
    isFeatured: boolean | null;
    sortOrder: number | null;
    createdAt: string;
    description: string | null;
}

// Hook return types
export interface UseWorldsReturn {
    worlds: ParsedWorld[];
    isLoading: boolean;
    isError: boolean;
    worldData: ParsedWorld | null;
    currentWorldIndex: number;
    isTransitioning: boolean;
    changeWorld: (direction: "next" | "prev") => void;
    jumpToWorld: (index: number) => void;
    jumpToWorldBySlug: (slug: string) => void;
    initialWorld: ParsedWorld | null;
}

export interface UseBackgroundsReturn {
    backgrounds: ParsedBackground[];
    isLoading: boolean;
    isError: boolean;
    currentBackground: ParsedBackground | null;
    currentBackgroundIndex: number;
    isTransitioning: boolean;
    changeBackground: (direction: "next" | "prev") => void;
    jumpToBackground: (index: number) => void;
}
