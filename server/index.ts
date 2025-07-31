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
export * from "../database/supabase/client";
export * from "../database/supabase/types";

// Server Utilities
export * from "./logger";
export * from "./security";
// Type guards consolidated to @database/shared
export * from "@database/shared/typeguards";
export * from "./version";
