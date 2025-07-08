/**
 * Server Module
 * 
 * This module contains all backend-related code including:
 * - Database client and configuration
 * - Data fetching and mutations
 * - Server-side utilities
 * - API integrations
 * - Backend types and schemas
 * 
 * The server module is responsible for data persistence,
 * external API communication, and server-side logic.
 */

// Re-export all server-side functionality
export * from './database';
export * from './api';
export * from './utils';
export * from './types';
