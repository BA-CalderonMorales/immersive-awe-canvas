/**
 * GitHub API Client for Client-side
 *
 * Client-side GitHub API client that leverages shared utilities
 */

import { sharedGitHubClient, type VersionInfo } from "../../../shared/index.js";
import type { APIResult } from "@ba-calderonmorales/clean-api";

// Export the VersionInfo type for use in other modules
export type { VersionInfo };

/**
 * Client GitHub API Client
 * Wrapper around shared GitHub client for client-specific operations
 */
export class ClientGitHubAPIClient {
    /**
     * Get the latest release from GitHub
     */
    async getLatestRelease(): APIResult<VersionInfo> {
        return await sharedGitHubClient.getLatestRelease();
    }

    /**
     * Get multiple releases from GitHub
     */
    async getReleases(limit: number = 10): APIResult<VersionInfo[]> {
        return await sharedGitHubClient.getReleases(limit);
    }

    /**
     * Check if a version is the latest
     */
    async isVersionLatest(version: string): APIResult<boolean> {
        return await sharedGitHubClient.isVersionLatest(version);
    }
}

// Export singleton instance
export const clientGitHubAPIClient = new ClientGitHubAPIClient();
