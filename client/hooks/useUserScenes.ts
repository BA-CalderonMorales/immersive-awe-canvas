/**
 * Hook for managing user-saved scenes
 * Currently uses localStorage, ready for database persistence
 */

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
    UserScene,
    UserSceneCreateInput,
    UserSceneUpdateInput,
    UserScenesState,
    UserScenesActions,
} from "@/types/userScenes";

const STORAGE_KEY = "immersive-awe-user-scenes";

// Simulated database operations (ready for real DB integration)
class UserScenesService {
    private async delay(ms: number = 100): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private getStoredScenes(): UserScene[] {
        if (typeof window === "undefined") return [];

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Failed to load user scenes:", error);
            return [];
        }
    }

    private saveStoredScenes(scenes: UserScene[]): void {
        if (typeof window === "undefined") return;

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes));
        } catch (error) {
            console.error("Failed to save user scenes:", error);
            throw new Error("Failed to save scene");
        }
    }

    async getAllScenes(): Promise<UserScene[]> {
        await this.delay(); // Simulate network delay
        return this.getStoredScenes();
    }

    async createScene(input: UserSceneCreateInput): Promise<UserScene> {
        await this.delay();

        const scenes = this.getStoredScenes();
        const newScene: UserScene = {
            id: `scene_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: input.name,
            description: input.description,
            sceneConfig: input.sceneConfig,
            baseGeometryId: input.baseGeometryId,
            isPublic: input.isPublic ?? false,
            tags: input.tags ?? [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        scenes.push(newScene);
        this.saveStoredScenes(scenes);

        return newScene;
    }

    async updateScene(
        id: string,
        input: UserSceneUpdateInput
    ): Promise<UserScene> {
        await this.delay();

        const scenes = this.getStoredScenes();
        const sceneIndex = scenes.findIndex(s => s.id === id);

        if (sceneIndex === -1) {
            throw new Error("Scene not found");
        }

        const updatedScene: UserScene = {
            ...scenes[sceneIndex],
            ...input,
            updatedAt: new Date().toISOString(),
        };

        scenes[sceneIndex] = updatedScene;
        this.saveStoredScenes(scenes);

        return updatedScene;
    }

    async deleteScene(id: string): Promise<void> {
        await this.delay();

        const scenes = this.getStoredScenes();
        const filteredScenes = scenes.filter(s => s.id !== id);

        if (filteredScenes.length === scenes.length) {
            throw new Error("Scene not found");
        }

        this.saveStoredScenes(filteredScenes);
    }

    async getScene(id: string): Promise<UserScene> {
        await this.delay();

        const scenes = this.getStoredScenes();
        const scene = scenes.find(s => s.id === id);

        if (!scene) {
            throw new Error("Scene not found");
        }

        return scene;
    }
}

const userScenesService = new UserScenesService();

export const useUserScenes = () => {
    const [state, setState] = useState<UserScenesState>({
        scenes: [],
        isLoading: false,
        error: null,
        selectedSceneId: null,
    });

    // Load scenes on mount
    useEffect(() => {
        const loadScenes = async () => {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const scenes = await userScenesService.getAllScenes();
                setState(prev => ({ ...prev, scenes, isLoading: false }));
            } catch (error) {
                setState(prev => ({
                    ...prev,
                    error:
                        error instanceof Error
                            ? error.message
                            : "Failed to load scenes",
                    isLoading: false,
                }));
            }
        };

        loadScenes();
    }, []);

    const saveScene = useCallback(
        async (input: UserSceneCreateInput): Promise<UserScene> => {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const newScene = await userScenesService.createScene(input);

                setState(prev => ({
                    ...prev,
                    scenes: [...prev.scenes, newScene],
                    isLoading: false,
                    selectedSceneId: newScene.id,
                }));

                toast.success("🎨 Scene saved successfully!", {
                    description: `"${newScene.name}" has been saved to your collection`,
                    duration: 3000,
                });

                return newScene;
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to save scene";
                setState(prev => ({
                    ...prev,
                    error: errorMessage,
                    isLoading: false,
                }));

                toast.error("❌ Failed to save scene", {
                    description: errorMessage,
                });

                throw error;
            }
        },
        []
    );

    const updateScene = useCallback(
        async (id: string, input: UserSceneUpdateInput): Promise<UserScene> => {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            try {
                const updatedScene = await userScenesService.updateScene(
                    id,
                    input
                );

                setState(prev => ({
                    ...prev,
                    scenes: prev.scenes.map(s =>
                        s.id === id ? updatedScene : s
                    ),
                    isLoading: false,
                }));

                toast.success("✅ Scene updated successfully!", {
                    description: `"${updatedScene.name}" has been updated`,
                });

                return updatedScene;
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to update scene";
                setState(prev => ({
                    ...prev,
                    error: errorMessage,
                    isLoading: false,
                }));

                toast.error("❌ Failed to update scene", {
                    description: errorMessage,
                });

                throw error;
            }
        },
        []
    );

    const deleteScene = useCallback(async (id: string): Promise<void> => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            await userScenesService.deleteScene(id);

            setState(prev => ({
                ...prev,
                scenes: prev.scenes.filter(s => s.id !== id),
                isLoading: false,
                selectedSceneId:
                    prev.selectedSceneId === id ? null : prev.selectedSceneId,
            }));

            toast.success("🗑️ Scene deleted successfully!");
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to delete scene";
            setState(prev => ({
                ...prev,
                error: errorMessage,
                isLoading: false,
            }));

            toast.error("❌ Failed to delete scene", {
                description: errorMessage,
            });

            throw error;
        }
    }, []);

    const loadScene = useCallback(async (id: string): Promise<UserScene> => {
        try {
            const scene = await userScenesService.getScene(id);
            setState(prev => ({ ...prev, selectedSceneId: id }));
            return scene;
        } catch (error) {
            toast.error("❌ Failed to load scene");
            throw error;
        }
    }, []);

    const duplicateScene = useCallback(
        async (id: string, newName: string): Promise<UserScene> => {
            try {
                const originalScene = await userScenesService.getScene(id);
                const duplicateInput: UserSceneCreateInput = {
                    name: newName,
                    description: originalScene.description,
                    sceneConfig: originalScene.sceneConfig,
                    baseGeometryId: originalScene.baseGeometryId,
                    isPublic: false, // Duplicates are private by default
                    tags: [...originalScene.tags],
                };

                return await saveScene(duplicateInput);
            } catch (error) {
                toast.error("❌ Failed to duplicate scene");
                throw error;
            }
        },
        [saveScene]
    );

    const exportScene = useCallback(async (id: string): Promise<string> => {
        try {
            const scene = await userScenesService.getScene(id);
            const exportData = {
                ...scene,
                exportedAt: new Date().toISOString(),
                version: "1.0.0",
            };

            return JSON.stringify(exportData, null, 2);
        } catch (error) {
            toast.error("❌ Failed to export scene");
            throw error;
        }
    }, []);

    const importScene = useCallback(
        async (jsonData: string): Promise<UserScene> => {
            try {
                const importedData = JSON.parse(jsonData);

                // Validate imported data structure
                if (!importedData.name || !importedData.sceneConfig) {
                    throw new Error("Invalid scene data format");
                }

                const importInput: UserSceneCreateInput = {
                    name: `${importedData.name} (Imported)`,
                    description: importedData.description,
                    sceneConfig: importedData.sceneConfig,
                    baseGeometryId: importedData.baseGeometryId,
                    isPublic: false, // Imported scenes are private by default
                    tags: [...(importedData.tags || []), "imported"],
                };

                return await saveScene(importInput);
            } catch (error) {
                toast.error("❌ Failed to import scene", {
                    description: "Please check the file format and try again",
                });
                throw error;
            }
        },
        [saveScene]
    );

    const actions: UserScenesActions = {
        saveScene,
        updateScene,
        deleteScene,
        loadScene,
        duplicateScene,
        exportScene,
        importScene,
    };

    return {
        ...state,
        actions,
    };
};
