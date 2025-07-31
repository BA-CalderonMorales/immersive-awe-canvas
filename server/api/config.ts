/**
 * API Configuration
 *
 * Central configuration for all API clients and services
 */

import { APIBase, FetchClient } from "@ba-calderonmorales/clean-api";
import type { APIClient } from "@ba-calderonmorales/clean-api";

// API Base Configurations
export const githubAPI = new APIBase();
export const supabaseAPI = new APIBase();
export const internalAPI = new APIBase();

// Default API Client
export const defaultClient: APIClient = new FetchClient();

// GitHub API Configuration
githubAPI.setConfig("baseUrl", "https://api.github.com");
githubAPI.setConfig("headers", {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "immersive-awe-canvas",
});

// Add GitHub routes
githubAPI.addRoute(
    "releases",
    "/repos/BA-CalderonMorales/immersive-awe-canvas/releases"
);
githubAPI.addRoute(
    "latestRelease",
    "/repos/BA-CalderonMorales/immersive-awe-canvas/releases/latest"
);

// Supabase API Configuration
supabaseAPI.setConfig("baseUrl", "https://vpqadqhqphmtdkepvnet.supabase.co");
supabaseAPI.setConfig("headers", {
    "Content-Type": "application/json",
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWFkcWhxcGhtdGRrZXB2bmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDg0OTMsImV4cCI6MjA2NTUyNDQ5M30.cxyPs3buUZsOMyhMiNr25RexN8MZL9QWBbUGX4--084",
});

// Add Supabase routes
supabaseAPI.addRoute("logs", "/rest/v1/logs");
supabaseAPI.addRoute("scenes", "/rest/v1/scenes");
supabaseAPI.addRoute("user_scenes", "/rest/v1/user_scenes");

// Internal API Configuration (for future microservices)
internalAPI.setConfig(
    "baseUrl",
    process.env.INTERNAL_API_URL || "http://localhost:3001"
);
internalAPI.setConfig("headers", {
    "Content-Type": "application/json",
});

// Enhanced HTTP Client with base URL and headers support
export class EnhancedFetchClient extends FetchClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;

    constructor(
        baseUrl: string = "",
        defaultHeaders: Record<string, string> = {}
    ) {
        super();
        this.baseUrl = baseUrl;
        this.defaultHeaders = defaultHeaders;
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
        const fullUrl = url.startsWith("http") ? url : `${this.baseUrl}${url}`;
        const mergedHeaders = { ...this.defaultHeaders, ...headers };

        const response = await fetch(fullUrl, {
            method,
            headers: mergedHeaders,
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }
}

// Create configured clients
export const githubClient = new EnhancedFetchClient(
    githubAPI.config.baseUrl,
    githubAPI.config.headers
);

export const supabaseClient = new EnhancedFetchClient(
    supabaseAPI.config.baseUrl,
    supabaseAPI.config.headers
);
