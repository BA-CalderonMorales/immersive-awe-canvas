/**
 * Modules Entry Point
 * 
 * This file provides access to both client and server modules,
 * creating a clear separation of concerns for better codebase organization.
 * 
 * Usage:
 * ```typescript
 * // Import client-side functionality
 * import { ComponentName } from '@/modules/client';
 * 
 * // Import server-side functionality
 * import { useWorlds } from '@/modules/server';
 * 
 * // Or import specific modules
 * import { ComponentName } from '@/modules/client/components';
 * import { supabase } from '@/modules/server/database';
 * ```
 */

export * as client from './client';
export * as server from './server';
