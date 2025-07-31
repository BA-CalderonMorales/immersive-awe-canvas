/**
 * Shared API Types
 *
 * Common types used across both server and client API layers
 * This eliminates duplication and ensures consistency
 */

// Version Management Types
export interface VersionInfo {
    version: string;
    name: string;
    publishedAt: string;
    url: string;
    description: string;
    isLatest: boolean;
}

export interface VersionUpdateInfo {
    hasUpdate: boolean;
    currentVersion: string;
    latestVersion?: string;
    releaseUrl?: string;
}

export interface VersionDetails {
    appVersion: string;
    buildInfo: string;
    fullVersion: string;
}

// GitHub API Types
export interface GitHubRelease {
    tag_name: string;
    name: string;
    published_at: string;
    html_url: string;
    body: string;
}

// Logging Types
export interface LogEventParams {
    eventType: string;
    eventSource?: string;
    metadata?: Record<string, unknown>;
}

// Database Types (re-export for convenience)
export type { Database } from "../database/supabase/types.js";
import type { Database } from "../database/supabase/types.js";

export type World = Database["public"]["Tables"]["worlds"]["Row"];
export type Background = Database["public"]["Tables"]["backgrounds"]["Row"];
export type DefaultGeometry =
    Database["public"]["Tables"]["default_geometries"]["Row"];
export type LogEntry = Database["public"]["Tables"]["logs"]["Row"];

// API Configuration Types
export interface APIEndpoints {
    github: {
        releases: string;
        latestRelease: string;
    };
    supabase: {
        baseUrl: string;
        apiKey: string;
    };
    server?: {
        baseUrl: string;
    };
}

// Query Options Types
export interface QueryOptions {
    select?: string;
    filters?: Record<string, any>;
    limit?: number;
    orderBy?: string;
}

// Performance Monitoring Types
export interface PerformanceMetrics {
    operationName: string;
    duration: number;
    timestamp: number;
    success: boolean;
    error?: string;
}
