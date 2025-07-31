/**
 * GitHub API Client
 * 
 * Server-side GitHub API client that leverages shared utilities
 */

import { sharedGitHubClient, type VersionInfo } from '../../../shared/index.js';
import type { APIResult } from '@ba-calderonmorales/clean-api';

/**
 * Server GitHub API Client
 * Wrapper around shared GitHub client for server-specific operations
 */
export class GitHubAPIClient {
    /**
     * Fetch the latest release from GitHub
     */
    async getLatestRelease(): APIResult<VersionInfo> {
        return await sharedGitHubClient.getLatestRelease();
    }

    /**
     * Fetch multiple releases from GitHub
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
export const githubAPIClient = new GitHubAPIClient();
