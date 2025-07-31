/**
 * Shared API Configuration
 *
 * Centralized configuration for both server and client API layers
 * This eliminates duplicate configuration and ensures consistency
 */

import { APIBase } from "@ba-calderonmorales/clean-api";
import type { APIEndpoints } from "./api-types.js";

// Environment Detection
export const isServer = typeof window === "undefined";
export const isClient = typeof window !== "undefined";

// API Endpoints Configuration
export const API_ENDPOINTS: APIEndpoints = {
    github: {
        releases: "/repos/BA-CalderonMorales/immersive-awe-canvas/releases",
        latestRelease:
            "/repos/BA-CalderonMorales/immersive-awe-canvas/releases/latest",
    },
    supabase: {
        baseUrl: "https://vpqadqhqphmtdkepvnet.supabase.co",
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcWFkcWhxcGhtdGRrZXB2bmV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDg0OTMsImV4cCI6MjA2NTUyNDQ5M30.cxyPs3buUZsOMyhMiNr25RexN8MZL9QWBbUGX4--084",
    },
    server: {
        baseUrl:
            process.env.NODE_ENV === "development"
                ? "http://localhost:3001"
                : "",
    },
};

// Shared API Base Configurations
export const createGitHubAPI = () => {
    const api = new APIBase();
    api.setConfig("baseUrl", "https://api.github.com");
    api.setConfig("headers", {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": `immersive-awe-canvas-${isServer ? "server" : "client"}`,
    });

    // Add routes
    api.addRoute("releases", API_ENDPOINTS.github.releases);
    api.addRoute("latestRelease", API_ENDPOINTS.github.latestRelease);

    return api;
};

export const createSupabaseAPI = () => {
    const api = new APIBase();
    api.setConfig("baseUrl", API_ENDPOINTS.supabase.baseUrl);
    api.setConfig("headers", {
        "Content-Type": "application/json",
        apikey: API_ENDPOINTS.supabase.apiKey,
    });

    // Add Supabase REST routes
    api.addRoute("logs", "/rest/v1/logs");
    api.addRoute("worlds", "/rest/v1/worlds");
    api.addRoute("backgrounds", "/rest/v1/backgrounds");
    api.addRoute("defaultGeometries", "/rest/v1/default_geometries");

    return api;
};

export const createServerAPI = () => {
    const api = new APIBase();
    if (API_ENDPOINTS.server?.baseUrl) {
        api.setConfig("baseUrl", API_ENDPOINTS.server.baseUrl);
    }
    api.setConfig("headers", {
        "Content-Type": "application/json",
    });

    // Add server routes
    api.addRoute("version", "/api/version");
    api.addRoute("logs", "/api/logs");

    return api;
};

// Retry Configuration
export const RETRY_CONFIG = {
    github: 1, // 1 retry for GitHub API
    supabase: 0, // No retries for Supabase (use native client)
    server: 2, // 2 retries for server calls
};

// Cache Configuration
export const CACHE_CONFIG = {
    version: {
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchInterval: 30 * 60 * 1000, // 30 minutes
    },
    worlds: {
        staleTime: 5 * 60 * 1000, // 5 minutes
    },
    backgrounds: {
        staleTime: 10 * 60 * 1000, // 10 minutes
    },
};
