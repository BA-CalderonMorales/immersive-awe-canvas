/**
 * Server Module Entry Point
 *
 * This module contains all backend-related code including:
 * - Clean API layered architecture
 * - Database client and configuration
 * - Data fetching and mutations
 * - Server-side utilities
 * - API integrations
 * - Backend types and schemas
 */

// Type guards consolidated to @database/shared
export * from "@database/shared/typeguards";

// Database Integration
export * from "../database/supabase/client";
export * from "../database/supabase/types";
// New Layered API Architecture
export * from "./api";
// Server Utilities
export * from "./logger";
export * from "./security";
export * from "./version";
