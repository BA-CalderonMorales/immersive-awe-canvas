/**
 * Types for user-saved scenes functionality
 * Ready for database persistence when enabled
 */

import { SceneConfig } from "./scene";

export interface UserScene {
    id: string;
    name: string;
    description?: string;
    sceneConfig: SceneConfig;
    baseGeometryId?: number; // Reference to default_geometries.id if based on a default
    isPublic: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    // Future: userId when auth is implemented
}

export interface UserSceneCreateInput {
    name: string;
    description?: string;
    sceneConfig: SceneConfig;
    baseGeometryId?: number;
    isPublic?: boolean;
    tags?: string[];
}

export interface UserSceneUpdateInput {
    name?: string;
    description?: string;
    sceneConfig?: SceneConfig;
    isPublic?: boolean;
    tags?: string[];
}

export interface UserScenesState {
    scenes: UserScene[];
    isLoading: boolean;
    error: string | null;
    selectedSceneId: string | null;
}

export interface UserScenesActions {
    saveScene: (input: UserSceneCreateInput) => Promise<UserScene>;
    updateScene: (
        id: string,
        input: UserSceneUpdateInput
    ) => Promise<UserScene>;
    deleteScene: (id: string) => Promise<void>;
    loadScene: (id: string) => Promise<UserScene>;
    duplicateScene: (id: string, newName: string) => Promise<UserScene>;
    exportScene: (id: string) => Promise<string>; // JSON export
    importScene: (jsonData: string) => Promise<UserScene>;
}
