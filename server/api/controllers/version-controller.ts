/**
 * Version Controller
 * 
 * Handles version-related API endpoints
 */

import { versionService } from '../services/version-service';

export class VersionController {
    private static instance: VersionController;

    private constructor() {}

    static getInstance(): VersionController {
        if (!VersionController.instance) {
            VersionController.instance = new VersionController();
        }
        return VersionController.instance;
    }

    /**
     * Get application version information
     */
    async getVersion() {
        try {
            return {
                success: true,
                data: {
                    appVersion: versionService.getAppVersion(),
                    buildInfo: versionService.getBuildInfo(),
                    fullVersion: versionService.getFullVersion()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    /**
     * Get dynamic version information from GitHub
     */
    async getDynamicVersion() {
        try {
            const versionInfo = await versionService.getDynamicVersionInfo();
            return {
                success: true,
                data: versionInfo
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to fetch version info'
            };
        }
    }

    /**
     * Get all releases
     */
    async getReleases(limit: number = 10) {
        try {
            const { data, error } = await versionService.getAllReleases(limit);
            
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
                error: error instanceof Error ? error.message : 'Failed to fetch releases'
            };
        }
    }

    /**
     * Check if current version is latest
     */
    async checkLatestVersion() {
        try {
            const isLatest = await versionService.isCurrentVersionLatest();
            return {
                success: true,
                data: {
                    isLatest,
                    currentVersion: versionService.getAppVersion()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to check version'
            };
        }
    }

    /**
     * Clear version cache
     */
    clearCache() {
        try {
            versionService.clearVersionCache();
            return {
                success: true,
                message: 'Version cache cleared'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to clear cache'
            };
        }
    }
}

// Export singleton instance
export const versionController = VersionController.getInstance();
