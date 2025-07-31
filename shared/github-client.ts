/**
 * Shared GitHub API Client
 *
 * Common GitHub API operations used by both server and client
 * This eliminates duplicate GitHub API logic
 */

import { API, FetchClient } from "@ba-calderonmorales/clean-api";
import type { APIResult } from "@ba-calderonmorales/clean-api";
import { createGitHubAPI, RETRY_CONFIG, isClient } from "./api-config.js";
import type { VersionInfo, GitHubRelease } from "./api-types.js";

// Enhanced HTTP Client with retries
class EnhancedGitHubClient extends FetchClient {
    private retries: number;

    constructor(retries: number = RETRY_CONFIG.github) {
        super();
        this.retries = retries;
    }

    async request<T = any>({
        url,
        method,
        data,
        headers = {},
    }: {
        url: string;
        method: string;
        data?: any;
        headers?: Record<string, string>;
    }): Promise<T> {
        let lastError: Error;

        for (let attempt = 0; attempt <= this.retries; attempt++) {
            try {
                const response = await fetch(url, {
                    method,
                    headers: { ...headers },
                    body: data ? JSON.stringify(data) : undefined,
                });

                if (!response.ok) {
                    throw new Error(
                        `HTTP ${response.status}: ${response.statusText}`
                    );
                }

                return response.json();
            } catch (error) {
                lastError = error as Error;

                // Don't retry on client errors (4xx)
                if (
                    error instanceof Error &&
                    error.message.includes("HTTP 4")
                ) {
                    throw error;
                }

                // Wait before retry (exponential backoff)
                if (attempt < this.retries) {
                    await new Promise(resolve =>
                        setTimeout(resolve, Math.pow(2, attempt) * 1000)
                    );
                }
            }
        }

        throw lastError!;
    }
}

/**
 * Shared GitHub API Client
 * Used by both server and client layers
 */
export class SharedGitHubClient {
    private api: ReturnType<typeof createGitHubAPI>;
    private client: EnhancedGitHubClient;
    private apiInstance: API;

    constructor() {
        this.api = createGitHubAPI();
        this.client = new EnhancedGitHubClient();
        this.apiInstance = new API(`github-${isClient ? "client" : "server"}`);
    }

    /**
     * Convert GitHub release to VersionInfo
     */
    private convertReleaseToVersionInfo(
        release: GitHubRelease,
        isLatest: boolean = false
    ): VersionInfo {
        return {
            version: release.tag_name,
            name: release.name || release.tag_name,
            publishedAt: new Date(release.published_at).toLocaleDateString(),
            url: release.html_url,
            description: release.body || "No description available",
            isLatest,
        };
    }

    /**
     * Get the latest release from GitHub
     */
    async getLatestRelease(): APIResult<VersionInfo> {
        try {
            const url = `${this.api.config.baseUrl}${this.api.routes.latestRelease}`;
            const release: GitHubRelease = await this.client.request({
                url,
                method: "GET",
                headers: this.api.config.headers,
            });

            const versionInfo = this.convertReleaseToVersionInfo(release, true);
            return { data: versionInfo };
        } catch (error) {
            return { error: error as Error };
        }
    }

    /**
     * Get multiple releases from GitHub
     */
    async getReleases(limit: number = 10): APIResult<VersionInfo[]> {
        try {
            const url = `${this.api.config.baseUrl}${this.api.routes.releases}?per_page=${limit}`;
            const releases: GitHubRelease[] = await this.client.request({
                url,
                method: "GET",
                headers: this.api.config.headers,
            });

            const versionInfos = releases.map((release, index) =>
                this.convertReleaseToVersionInfo(release, index === 0)
            );

            return { data: versionInfos };
        } catch (error) {
            return { error: error as Error };
        }
    }

    /**
     * Check if a given version is the latest
     */
    async isVersionLatest(version: string): APIResult<boolean> {
        const { data: latestVersion, error } = await this.getLatestRelease();

        if (error) {
            return { error };
        }

        return { data: latestVersion!.version === version };
    }
}

// Export singleton instance
export const sharedGitHubClient = new SharedGitHubClient();
