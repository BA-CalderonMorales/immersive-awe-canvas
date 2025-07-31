/**
 * GitHub Integration Client
 *
 * Client for GitHub API operations using Clean API architecture
 */

import { API } from "@ba-calderonmorales/clean-api";
import {
    githubIntegrationAPI,
    githubIntegrationClientInstance as configuredClient,
} from "../config.js";

// Create GitHub API bucket
export const githubAPI = new API("github-integration");

/**
 * GitHub Issue Interface
 */
export interface GitHubIssue {
    id?: number;
    number?: number;
    title: string;
    body: string;
    labels?: string[];
    state?: "open" | "closed";
    html_url?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * GitHub Release Interface
 */
export interface GitHubRelease {
    id: number;
    tag_name: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    html_url: string;
}

/**
 * GitHub Integration Client
 * Provides methods for GitHub API operations
 */
export class GitHubIntegrationClient {
    /**
     * Create a new GitHub issue
     */
    async createIssue(
        issue: Omit<
            GitHubIssue,
            "id" | "number" | "state" | "html_url" | "created_at" | "updated_at"
        >
    ): Promise<GitHubIssue> {
        const response = await configuredClient.request<GitHubIssue>({
            url: githubIntegrationAPI.routes.createIssue,
            method: "POST",
            data: issue,
        });

        return response;
    }

    /**
     * Get GitHub issues with optional filtering
     */
    async getIssues(filters?: {
        state?: "open" | "closed" | "all";
        labels?: string;
        sort?: "created" | "updated" | "comments";
        direction?: "asc" | "desc";
        since?: string;
        page?: number;
        per_page?: number;
    }): Promise<GitHubIssue[]> {
        let url = githubIntegrationAPI.routes.getIssues;

        if (filters) {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });
            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }
        }

        const response = await configuredClient.request<GitHubIssue[]>({
            url,
            method: "GET",
        });

        return response;
    }

    /**
     * Get GitHub releases
     */
    async getReleases(options?: {
        page?: number;
        per_page?: number;
    }): Promise<GitHubRelease[]> {
        let url = githubIntegrationAPI.routes.getReleases;

        if (options) {
            const queryParams = new URLSearchParams();
            Object.entries(options).forEach(([key, value]) => {
                if (value !== undefined) {
                    queryParams.append(key, value.toString());
                }
            });
            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }
        }

        const response = await configuredClient.request<GitHubRelease[]>({
            url,
            method: "GET",
        });

        return response;
    }

    /**
     * Get the latest release
     */
    async getLatestRelease(): Promise<GitHubRelease> {
        const releases = await this.getReleases({ per_page: 1 });

        if (releases.length === 0) {
            throw new Error("No releases found");
        }

        return releases[0];
    }

    /**
     * Create a bug report issue with standardized format
     */
    async createBugReport(bugData: {
        title: string;
        location: string;
        expectedBehavior: string;
        actualBehavior?: string;
        device?: string[];
        frequency?: string;
        workaround?: string;
        contactInfo?: {
            canContact: boolean;
            email?: string;
        };
        appVersion?: string;
    }): Promise<GitHubIssue> {
        const body = `
**Bug Report**

**Location:** ${bugData.location}
**Expected Behavior:** ${bugData.expectedBehavior}
${bugData.actualBehavior ? `**Actual Behavior:** ${bugData.actualBehavior}` : ""}
${bugData.device && bugData.device.length > 0 ? `**Device(s):** ${bugData.device.join(", ")}` : ""}
${bugData.frequency ? `**Frequency:** ${bugData.frequency}` : ""}
${bugData.workaround ? `**Workaround:** ${bugData.workaround}` : ""}
${bugData.appVersion ? `**App Version:** ${bugData.appVersion}` : ""}

---
${bugData.contactInfo?.canContact ? `**Contact Permission:** Yes` : "**Contact Permission:** No"}
${bugData.contactInfo?.email ? `**Contact Email:** ${bugData.contactInfo.email}` : ""}
        `.trim();

        return this.createIssue({
            title: `Bug: ${bugData.title}`,
            body,
            labels: ["bug-report"],
        });
    }

    /**
     * Create a feature request issue
     */
    async createFeatureRequest(featureData: {
        title: string;
        description: string;
        useCase?: string;
        priority?: "low" | "medium" | "high";
    }): Promise<GitHubIssue> {
        const body = `
**Feature Request**

${featureData.description}

${featureData.useCase ? `**Use Case:** ${featureData.useCase}` : ""}
${featureData.priority ? `**Priority:** ${featureData.priority}` : ""}
        `.trim();

        return this.createIssue({
            title: `Feature: ${featureData.title}`,
            body,
            labels: [
                "feature-request",
                ...(featureData.priority
                    ? [`priority-${featureData.priority}`]
                    : []),
            ],
        });
    }
}

// Export pre-configured client instance
export const githubIntegrationClient = new GitHubIntegrationClient();
