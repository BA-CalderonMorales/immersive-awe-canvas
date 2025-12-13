/**
 * Client API Layer
 *
 * Client-side API management using Clean API architecture.
 * This layer provides a consistent interface for all API calls,
 * whether they're going to external services, Supabase, or internal servers.
 */

export type {
    APIClient,
    APIRequest,
    APIResponse,
    APIResult,
    HTTPMethod,
} from "@ba-calderonmorales/clean-api";
// Core Clean API exports for client use
export {
    API,
    APIBase,
    APIError,
    FetchClient,
} from "@ba-calderonmorales/clean-api";
export { clientGitHubAPIClient } from "./clients/github-client.js";

// API clients for different services
export * from "./clients/index.js";
export { clientLoggingAPIClient } from "./clients/logging-client.js";
export { clientSupabaseAPIClient } from "./clients/supabase-client.js";

// Specific exports for easy access
export { clientVersionAPIClient } from "./clients/version-client.js";
// Client API configuration
export * from "./config.js";
// React hooks for API integration
export * from "./hooks/index.js";
// Utilities and helpers
export * from "./utils/index.js";
export { createAPIMigration } from "./utils/migration-helpers.js";
