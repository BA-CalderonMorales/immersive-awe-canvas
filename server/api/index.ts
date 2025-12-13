/**
 * Server API Layer - Layered Architecture using Clean API
 *
 * This module provides a clean, layered architecture for server-side operations:
 * - API Clients: External API communication
 * - Services: Business logic
 * - Repositories: Data access
 * - Controllers: Request/response handling
 */

export type {
    APIClient,
    APIRequest,
    APIResponse,
    APIResult,
    HTTPMethod,
} from "@ba-calderonmorales/clean-api";
// Core Clean API exports
export {
    API,
    APIBase,
    APIError,
    FetchClient,
} from "@ba-calderonmorales/clean-api";
export { githubAPIClient } from "./clients/github-client.js";
// API Clients - External service communication
export * from "./clients/index.js";
export { supabaseAPIClient } from "./clients/supabase-client.js";
// Utilities and configuration
export * from "./config.js";
// Controllers - Request/response handling
export * from "./controllers/index.js";
export { loggingController } from "./controllers/logging-controller.js";
export { sceneController } from "./controllers/scene-controller.js";
// Specific singleton exports for easy access
export { versionController } from "./controllers/version-controller.js";
// Repositories - Data access layer
export * from "./repositories/index.js";
// Services - Business logic layer
export * from "./services/index.js";
export { loggingService } from "./services/logging-service.js";
export { versionService } from "./services/version-service.js";
