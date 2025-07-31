/**
 * Shared API Utilities
 * 
 * Common utilities and types used by both server and client API layers
 * This eliminates redundancy and ensures seamless integration
 */

// Core types
export * from './api-types.js';

// Configuration
export * from './api-config.js';

// Shared clients
export * from './github-client.js';
export * from './version-manager.js';
export * from './logging-utils.js';

// Re-export Clean API core for consistency
export { API, APIBase, FetchClient, APIError } from '@ba-calderonmorales/clean-api';
export type { APIClient, HTTPMethod, APIRequest, APIResponse, APIResult } from '@ba-calderonmorales/clean-api';
