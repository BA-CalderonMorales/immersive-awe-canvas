/**
 * Shared API Utilities
 *
 * Common utilities and types used by both server and client API layers
 * This eliminates redundancy and ensures seamless integration
 */

export type {
    APIClient,
    APIRequest,
    APIResponse,
    APIResult,
    HTTPMethod,
} from "@ba-calderonmorales/clean-api";
// Re-export Clean API core for consistency
export {
    API,
    APIBase,
    APIError,
    FetchClient,
} from "@ba-calderonmorales/clean-api";
// Configuration
export * from "./api-config.js";
// Core types
export * from "./api-types.js";
// Shared clients
export * from "./github-client.js";
export * from "./logging-utils.js";
export * from "./version-manager.js";
