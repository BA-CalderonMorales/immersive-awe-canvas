/**
 * Client Library Entry Point
 *
 * This module contains all client-side utilities including:
 * - UI utilities and helpers
 * - Client-side validation
 * - Type guards
 * - Utility functions
 */

// Client-specific utilities
export * from "./keyboardUtils";
// Logging utilities
export * from "./logger";
export * from "./sceneConfigUtils";
// Security utilities
export * from "./security";
// Type guards consolidated to @database/shared
export * from "@database/shared/typeguards";
export * from "./version";
