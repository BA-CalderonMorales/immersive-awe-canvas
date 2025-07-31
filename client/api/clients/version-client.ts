/**
 * Version API Client for Client-side
 * 
 * Client-side version operations using shared utilities
 */

import { sharedVersionManager, type VersionInfo, type VersionUpdateInfo, type VersionDetails } from '../../../shared/index.js';
import type { APIResult } from '@ba-calderonmorales/clean-api';

/**
 * Client-side Version API Client
 * Wrapper around shared version manager for client-specific operations
 */
export class ClientVersionAPIClient {
    /**
     * Get current application version (static)
     */
    getCurrentVersion(): VersionDetails {
        return sharedVersionManager.getCurrentVersion();
    }

    /**
     * Get latest version from GitHub with caching
     */
    async getLatestVersion(): APIResult<VersionInfo> {
        return await sharedVersionManager.getLatestVersion();
    }

    /**
     * Get all releases from GitHub
     */
    async getAllReleases(limit: number = 10): APIResult<VersionInfo[]> {
        return await sharedVersionManager.getAllReleases(limit);
    }

    /**
     * Check if current version is latest
     */
    async isCurrentVersionLatest(): Promise<boolean> {
        return await sharedVersionManager.isCurrentVersionLatest();
    }

    /**
     * Get version update info
     */
    async getUpdateInfo(): Promise<VersionUpdateInfo> {
        return await sharedVersionManager.getUpdateInfo();
    }

    /**
     * Clear version cache
     */
    clearCache(): void {
        sharedVersionManager.clearCache();
    }
}

// Export singleton instance
export const clientVersionAPIClient = new ClientVersionAPIClient();
