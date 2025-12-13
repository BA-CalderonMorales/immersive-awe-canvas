/**
 * Database API Clients
 *
 * Centralized exports for all database API clients
 */

// Re-export key types for convenience
export type {
    EdgeFunctionResponse,
    IssueData,
} from "./edge-function-client.js";
export * from "./edge-function-client.js";
export type {
    GitHubIssue,
    GitHubRelease,
} from "./github-integration-client.js";
export * from "./github-integration-client.js";
export type { DatabaseLogEntry } from "./logging-client.js";
export * from "./logging-client.js";
export type { LogEntry, User } from "./supabase-rest-client.js";
export * from "./supabase-rest-client.js";
