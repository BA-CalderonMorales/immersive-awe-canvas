/**
 * Version Service
 *
 * Business logic for version-related operations using shared utilities
 */

import {
    sharedVersionManager,
    type VersionInfo,
    type VersionUpdateInfo,
    type VersionDetails,
} from "../../../shared/index.js";
import type { APIResult } from "@ba-calderonmorales/clean-api";

/**
 * Server Version Service
 * Wrapper around shared version manager for server-specific operations
 */
export class VersionService {
    private static instance: VersionService;

    private constructor() {}

    static getInstance(): VersionService {
        if (!VersionService.instance) {
            VersionService.instance = new VersionService();
        }
        return VersionService.instance;
    }

    /**
     * Get current application version details
     */
    getCurrentVersion(): VersionDetails {
        return sharedVersionManager.getCurrentVersion();
    }

    /**
     * Get app version (legacy compatibility)
     */
    getAppVersion(): string {
        return sharedVersionManager.getCurrentVersion().appVersion;
    }

    /**
     * Get build info (legacy compatibility)
     */
    getBuildInfo(): string {
        return sharedVersionManager.getCurrentVersion().buildInfo;
    }

    /**
     * Get full version (legacy compatibility)
     */
    getFullVersion(): string {
        return sharedVersionManager.getCurrentVersion().fullVersion;
    }

    /**
     * Get the latest version from GitHub
     */
    async getLatestVersion(): APIResult<VersionInfo> {
        return await sharedVersionManager.getLatestVersion();
    }

    /**
     * Get dynamic version info (legacy compatibility)
     */
    async getDynamicVersionInfo(): Promise<VersionInfo> {
        const { data } = await this.getLatestVersion();
        return data!; // Will fallback to local version in shared manager
    }

    /**
     * Get all releases from GitHub
     */
    async getAllReleases(limit: number = 10): APIResult<VersionInfo[]> {
        return await sharedVersionManager.getAllReleases(limit);
    }

    /**
     * Check if current version is the latest
     */
    async isCurrentVersionLatest(): Promise<boolean> {
        return await sharedVersionManager.isCurrentVersionLatest();
    }

    /**
     * Get comprehensive update information
     */
    async getUpdateInfo(): Promise<VersionUpdateInfo> {
        return await sharedVersionManager.getUpdateInfo();
    }

    /**
     * Clear version cache (legacy compatibility)
     */
    clearVersionCache(): void {
        sharedVersionManager.clearCache();
    }

    /**
     * Clear cache (new API)
     */
    clearCache(): void {
        sharedVersionManager.clearCache();
    }
}

// Export singleton instance
export const versionService = VersionService.getInstance();
