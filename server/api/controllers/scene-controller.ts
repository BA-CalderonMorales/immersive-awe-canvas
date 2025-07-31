/**
 * Scene Controller
 * 
 * Handles scene-related API endpoints
 */

import { sceneRepository, type SceneEntity, type SceneFilters } from '../repositories/scene-repository';

export class SceneController {
    private static instance: SceneController;

    private constructor() {}

    static getInstance(): SceneController {
        if (!SceneController.instance) {
            SceneController.instance = new SceneController();
        }
        return SceneController.instance;
    }

    /**
     * Create a new scene
     */
    async createScene(sceneData: Omit<SceneEntity, 'id' | 'created_at' | 'updated_at'>) {
        try {
            const { data, error } = await sceneRepository.create(sceneData);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data,
                message: 'Scene created successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create scene'
            };
        }
    }

    /**
     * Get scene by ID
     */
    async getScene(id: number) {
        try {
            const { data, error } = await sceneRepository.findById(id);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get scene'
            };
        }
    }

    /**
     * Get scenes with optional filters
     */
    async getScenes(filters?: SceneFilters) {
        try {
            const { data, error } = await sceneRepository.findMany(filters);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data,
                count: data?.length || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get scenes'
            };
        }
    }

    /**
     * Get public scenes
     */
    async getPublicScenes(limit?: number) {
        try {
            const { data, error } = await sceneRepository.findPublicScenes(limit);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data,
                count: data?.length || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get public scenes'
            };
        }
    }

    /**
     * Get scenes by user
     */
    async getUserScenes(userId: string, limit?: number) {
        try {
            const { data, error } = await sceneRepository.findByUser(userId, limit);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data,
                userId,
                count: data?.length || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get user scenes'
            };
        }
    }

    /**
     * Update scene
     */
    async updateScene(id: number, updates: Partial<SceneEntity>) {
        try {
            const { data, error } = await sceneRepository.update(id, updates);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data: data?.[0],
                message: 'Scene updated successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to update scene'
            };
        }
    }

    /**
     * Delete scene
     */
    async deleteScene(id: number) {
        try {
            const { data, error } = await sceneRepository.delete(id);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data: data?.[0],
                message: 'Scene deleted successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to delete scene'
            };
        }
    }

    /**
     * Like a scene
     */
    async likeScene(userId: string, sceneId: number) {
        try {
            const { data, error } = await sceneRepository.likeScene(userId, sceneId);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data,
                message: 'Scene liked successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to like scene'
            };
        }
    }

    /**
     * Unlike a scene
     */
    async unlikeScene(userId: string, sceneId: number) {
        try {
            const { data, error } = await sceneRepository.unlikeScene(userId, sceneId);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data: data?.[0],
                message: 'Scene unliked successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to unlike scene'
            };
        }
    }

    /**
     * Bookmark a scene
     */
    async bookmarkScene(userId: string, sceneId: number) {
        try {
            const { data, error } = await sceneRepository.bookmarkScene(userId, sceneId);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data,
                message: 'Scene bookmarked successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to bookmark scene'
            };
        }
    }

    /**
     * Unbookmark a scene
     */
    async unbookmarkScene(userId: string, sceneId: number) {
        try {
            const { data, error } = await sceneRepository.unbookmarkScene(userId, sceneId);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data: data?.[0],
                message: 'Scene unbookmarked successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to unbookmark scene'
            };
        }
    }

    /**
     * Get user's liked scenes
     */
    async getUserLikedScenes(userId: string, limit?: number) {
        try {
            const { data, error } = await sceneRepository.getUserLikedScenes(userId, limit);
            
            if (error) {
                return {
                    success: false,
                    error: error.message
                };
            }

            return {
                success: true,
                data,
                userId,
                count: data?.length || 0
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get user liked scenes'
            };
        }
    }
}

// Export singleton instance
export const sceneController = SceneController.getInstance();
