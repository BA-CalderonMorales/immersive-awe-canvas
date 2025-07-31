/**
 * Scene Repository
 *
 * Data access layer for scene-related operations
 */

import type { APIResult } from "@ba-calderonmorales/clean-api";
import { supabaseAPIClient } from "../clients/supabase-client";

export interface SceneEntity {
    id?: number;
    name: string;
    description?: string;
    config?: Record<string, unknown>;
    is_public?: boolean;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
}

export interface UserSceneEntity {
    id?: number;
    user_id: string;
    scene_id: number;
    is_liked?: boolean;
    is_bookmarked?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface SceneFilters {
    isPublic?: boolean;
    createdBy?: string;
    limit?: number;
    offset?: number;
    searchTerm?: string;
}

export class SceneRepository {
    private static instance: SceneRepository;

    private constructor() {}

    static getInstance(): SceneRepository {
        if (!SceneRepository.instance) {
            SceneRepository.instance = new SceneRepository();
        }
        return SceneRepository.instance;
    }

    /**
     * Create a new scene
     */
    async create(
        sceneData: Omit<SceneEntity, "id" | "created_at" | "updated_at">
    ): APIResult<SceneEntity> {
        return await supabaseAPIClient.insert<SceneEntity>("scenes", sceneData);
    }

    /**
     * Find scene by ID
     */
    async findById(id: number): APIResult<SceneEntity> {
        try {
            const { data, error } = await supabaseAPIClient.query<SceneEntity>(
                "scenes",
                {
                    filters: { id: `eq.${id}` },
                    limit: 1,
                }
            );

            if (error) {
                return { error };
            }

            if (!data || data.length === 0) {
                return { error: new Error("Scene not found") };
            }

            return { data: data[0] };
        } catch (error) {
            return { error: error as Error };
        }
    }

    /**
     * Find scenes with optional filters
     */
    async findMany(filters?: SceneFilters): APIResult<SceneEntity[]> {
        const queryFilters: Record<string, string> = {};

        if (filters?.isPublic !== undefined) {
            queryFilters["is_public"] = `eq.${filters.isPublic}`;
        }

        if (filters?.createdBy) {
            queryFilters["created_by"] = `eq.${filters.createdBy}`;
        }

        if (filters?.searchTerm) {
            queryFilters["name"] = `ilike.%${filters.searchTerm}%`;
        }

        return await supabaseAPIClient.query<SceneEntity>("scenes", {
            filters: queryFilters,
            limit: filters?.limit,
            offset: filters?.offset,
            orderBy: "created_at.desc",
        });
    }

    /**
     * Find public scenes
     */
    async findPublicScenes(limit?: number): APIResult<SceneEntity[]> {
        return this.findMany({ isPublic: true, limit });
    }

    /**
     * Find scenes by user
     */
    async findByUser(userId: string, limit?: number): APIResult<SceneEntity[]> {
        return this.findMany({ createdBy: userId, limit });
    }

    /**
     * Update scene
     */
    async update(
        id: number,
        updates: Partial<SceneEntity>
    ): APIResult<SceneEntity[]> {
        return await supabaseAPIClient.update<SceneEntity>("scenes", updates, {
            id: `eq.${id}`,
        });
    }

    /**
     * Delete scene (soft delete by setting is_public to false)
     */
    async delete(id: number): APIResult<SceneEntity[]> {
        return this.update(id, { is_public: false });
    }

    /**
     * User Scene Operations
     */

    /**
     * Like a scene
     */
    async likeScene(
        userId: string,
        sceneId: number
    ): APIResult<UserSceneEntity> {
        const userSceneData = {
            user_id: userId,
            scene_id: sceneId,
            is_liked: true,
        };

        return await supabaseAPIClient.insert<UserSceneEntity>(
            "user_scenes",
            userSceneData
        );
    }

    /**
     * Unlike a scene
     */
    async unlikeScene(
        userId: string,
        sceneId: number
    ): APIResult<UserSceneEntity[]> {
        return await supabaseAPIClient.update<UserSceneEntity>(
            "user_scenes",
            { is_liked: false },
            {
                user_id: `eq.${userId}`,
                scene_id: `eq.${sceneId}`,
            }
        );
    }

    /**
     * Bookmark a scene
     */
    async bookmarkScene(
        userId: string,
        sceneId: number
    ): APIResult<UserSceneEntity> {
        const userSceneData = {
            user_id: userId,
            scene_id: sceneId,
            is_bookmarked: true,
        };

        return await supabaseAPIClient.insert<UserSceneEntity>(
            "user_scenes",
            userSceneData
        );
    }

    /**
     * Unbookmark a scene
     */
    async unbookmarkScene(
        userId: string,
        sceneId: number
    ): APIResult<UserSceneEntity[]> {
        return await supabaseAPIClient.update<UserSceneEntity>(
            "user_scenes",
            { is_bookmarked: false },
            {
                user_id: `eq.${userId}`,
                scene_id: `eq.${sceneId}`,
            }
        );
    }

    /**
     * Get user's liked scenes
     */
    async getUserLikedScenes(
        userId: string,
        limit?: number
    ): APIResult<SceneEntity[]> {
        // This would require a JOIN query - for now, we'll implement a basic version
        // In a real implementation, you might want to use Supabase's RPC functions
        try {
            const { data: userScenes, error } =
                await supabaseAPIClient.query<UserSceneEntity>("user_scenes", {
                    filters: {
                        user_id: `eq.${userId}`,
                        is_liked: "eq.true",
                    },
                    limit,
                    select: "scene_id",
                });

            if (error || !userScenes) {
                return {
                    error: error || new Error("Failed to fetch user scenes"),
                };
            }

            // Fetch the actual scenes (this is simplified - in production, use JOIN)
            const sceneIds = userScenes.map(us => us.scene_id);
            if (sceneIds.length === 0) {
                return { data: [] };
            }

            return await supabaseAPIClient.query<SceneEntity>("scenes", {
                filters: { id: `in.(${sceneIds.join(",")})` },
            });
        } catch (error) {
            return { error: error as Error };
        }
    }
}

// Export singleton instance
export const sceneRepository = SceneRepository.getInstance();
