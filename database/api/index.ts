/**
 * Database API Layer
 * 
 * Centralized API management for database operations using Clean API architecture.
 * This layer provides consistent interfaces for all database-related API calls,
 * including Supabase edge functions, direct database operations, and external integrations.
 */

// Core Clean API exports for database operations
export { API, APIBase, FetchClient, APIError } from '@ba-calderonmorales/clean-api';
export type { APIClient, HTTPMethod, APIRequest, APIResponse, APIResult } from '@ba-calderonmorales/clean-api';

// Database API configuration
export * from './config.js';

// API clients for different database services
export * from './clients/index.js';

// Database-specific utilities and helpers
export * from './utils/index.js';

// Shared database utilities
export * from '../shared/index.js';

// Specific exports for easy access
export { supabaseEdgeFunctionClient } from './clients/edge-function-client.js';
export { supabaseRestClient } from './clients/supabase-rest-client.js';
export { databaseLoggingClient } from './clients/logging-client.js';
export { githubIntegrationClient } from './clients/github-integration-client.js';
