/**
 * Shared Version Utilities
 *
 * Common version management logic used by both server and client
 * This eliminates duplicate version handling code
 */

import { sharedGitHubClient } from "./github-client.js";
import type {
    VersionInfo,
    VersionUpdateInfo,
    VersionDetails,
} from "./api-types.js";
import type { APIResult } from "@ba-calderonmorales/clean-api";

// Package version (should be dynamically imported in real implementation)
const PACKAGE_VERSION = "1.0.0";

/**
 * Shared Version Manager
 * Provides consistent version operations across server and client
 */
export class SharedVersionManager {
    private cachedVersionInfo: VersionInfo | null = null;
    private readonly packageVersion: string;

    constructor(packageVersion: string = PACKAGE_VERSION) {
        this.packageVersion = packageVersion;
    }

    /**
     * Get current application version details
     */
    getCurrentVersion(): VersionDetails {
        // Environment-specific build info
        const isClient = typeof window !== "undefined";
        const commitHash = isClient
            ? (import.meta as any)?.env?.VITE_GIT_COMMIT_HASH || "dev"
            : process.env.GIT_COMMIT_HASH || "dev";

        const buildDate = new Date().toLocaleDateString();
        const buildInfo = `${buildDate}-${commitHash}`;

        return {
            appVersion: this.packageVersion,
            buildInfo,
            fullVersion: `v${this.packageVersion} (${buildInfo})`,
        };
    }

    /**
     * Get latest version from GitHub with caching
     */
    async getLatestVersion(): APIResult<VersionInfo> {
        if (this.cachedVersionInfo) {
            return { data: this.cachedVersionInfo };
        }

        const { data, error } = await sharedGitHubClient.getLatestRelease();

        if (data) {
            this.cachedVersionInfo = data;
            return { data };
        }

        // Return fallback version on error
        const fallbackVersion: VersionInfo = {
            version: `v${this.packageVersion}`,
            name: `Version ${this.packageVersion}`,
            publishedAt: "Local Build",
            url: "https://github.com/BA-CalderonMorales/immersive-awe-canvas",
            description: "Local development version",
            isLatest: false,
        };

        return { data: fallbackVersion };
    }

    /**
     * Get all releases from GitHub
     */
    async getAllReleases(limit: number = 10): APIResult<VersionInfo[]> {
        return await sharedGitHubClient.getReleases(limit);
    }

    /**
     * Check if current version is the latest
     */
    async isCurrentVersionLatest(): Promise<boolean> {
        const { data: latestVersion } = await this.getLatestVersion();
        return latestVersion?.version === `v${this.packageVersion}`;
    }

    /**
     * Get comprehensive update information
     */
    async getUpdateInfo(): Promise<VersionUpdateInfo> {
        const currentVersion = this.getCurrentVersion();
        const { data: latestVersion } = await this.getLatestVersion();

        const hasUpdate = latestVersion
            ? latestVersion.version !== `v${currentVersion.appVersion}`
            : false;

        return {
            hasUpdate,
            currentVersion: currentVersion.fullVersion,
            latestVersion: latestVersion?.version,
            releaseUrl: latestVersion?.url,
        };
    }

    /**
     * Clear version cache
     */
    clearCache(): void {
        this.cachedVersionInfo = null;
    }

    /**
     * Compare two version strings
     */
    compareVersions(version1: string, version2: string): number {
        // Remove 'v' prefix if present
        const v1 = version1.replace(/^v/, "");
        const v2 = version2.replace(/^v/, "");

        const parts1 = v1.split(".").map(Number);
        const parts2 = v2.split(".").map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;

            if (part1 > part2) return 1;
            if (part1 < part2) return -1;
        }

        return 0;
    }
}

// Export singleton instance
export const sharedVersionManager = new SharedVersionManager();
