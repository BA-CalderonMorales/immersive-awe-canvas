/**
 * Client API Layer
 * 
 * Client-side API management using Clean API architecture.
 * This layer provides a consistent interface for all API calls,
 * whether they're going to external services, Supabase, or internal servers.
 */

// Core Clean API exports for client use
export { API, APIBase, FetchClient, APIError } from '@ba-calderonmorales/clean-api';
export type { APIClient, HTTPMethod, APIRequest, APIResponse, APIResult } from '@ba-calderonmorales/clean-api';

// Client API configuration
export * from './config.js';

// API clients for different services
export * from './clients/index.js';

// React hooks for API integration
export * from './hooks/index.js';

// Utilities and helpers
export * from './utils/index.js';

// Specific exports for easy access
export { clientVersionAPIClient } from './clients/version-client.js';
export { clientGitHubAPIClient } from './clients/github-client.js';
export { clientLoggingAPIClient } from './clients/logging-client.js';
export { clientSupabaseAPIClient } from './clients/supabase-client.js';
export { createAPIMigration } from './utils/migration-helpers.js';
