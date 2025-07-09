/**
 * Server Module Entry Point
 * 
 * This module contains all backend-related code including:
 * - Database client and configuration
 * - Data fetching and mutations
 * - Server-side utilities
 * - API integrations
 * - Backend types and schemas
 */

// Database Integration
export * from './integrations/supabase/client';
export * from './integrations/supabase/types';

// Server Utilities
export * from './github-api';
export * from './logger';
export * from './security';
