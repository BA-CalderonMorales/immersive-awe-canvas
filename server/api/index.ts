/**
 * Server API Layer - Layered Architecture using Clean API
 * 
 * This module provides a clean, layered architecture for server-side operations:
 * - API Clients: External API communication
 * - Services: Business logic
 * - Repositories: Data access
 * - Controllers: Request/response handling
 */

// Core Clean API exports
export { API, APIBase, FetchClient, APIError } from '@ba-calderonmorales/clean-api';
export type { APIClient, HTTPMethod, APIRequest, APIResponse, APIResult } from '@ba-calderonmorales/clean-api';

// API Clients - External service communication
export * from './clients/index.js';

// Services - Business logic layer
export * from './services/index.js';

// Repositories - Data access layer
export * from './repositories/index.js';

// Controllers - Request/response handling
export * from './controllers/index.js';

// Utilities and configuration
export * from './config.js';

// Specific singleton exports for easy access
export { versionController } from './controllers/version-controller.js';
export { loggingController } from './controllers/logging-controller.js';
export { sceneController } from './controllers/scene-controller.js';
export { versionService } from './services/version-service.js';
export { loggingService } from './services/logging-service.js';
export { githubAPIClient } from './clients/github-client.js';
export { supabaseAPIClient } from './clients/supabase-client.js';
