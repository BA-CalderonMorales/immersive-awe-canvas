/**
 * Database API Clients
 *
 * Centralized exports for all database API clients
 */

export * from "./edge-function-client.js";
export * from "./supabase-rest-client.js";
export * from "./logging-client.js";
export * from "./github-integration-client.js";

// Re-export key types for convenience
export type {
    IssueData,
    EdgeFunctionResponse,
} from "./edge-function-client.js";
export type { LogEntry, User } from "./supabase-rest-client.js";
export type { DatabaseLogEntry } from "./logging-client.js";
export type {
    GitHubIssue,
    GitHubRelease,
} from "./github-integration-client.js";
