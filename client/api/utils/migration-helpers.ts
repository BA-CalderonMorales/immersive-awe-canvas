/**
 * Migration Helpers
 * 
 * Utilities to help migrate from existing patterns to the new Clean API architecture
 */

import { clientSupabaseAPIClient } from '../clients/supabase-client';
import { clientVersionAPIClient } from '../clients/version-client';
import { clientLoggingAPIClient } from '../clients/logging-client';

/**
 * Migration utility to replace existing useWorlds hook
 * This provides the same interface as the existing hook but uses the new API layer
 */
export const createMigratedWorldsHook = () => {
    return {
        // Direct API methods that can replace existing fetch functions
        fetchWorlds: () => clientSupabaseAPIClient.getWorlds(),
        fetchWorldBySlug: (slug: string) => clientSupabaseAPIClient.getWorldBySlug(slug),
        
        // Utility to migrate existing queries
        migrateQuery: (existingQueryFn: () => Promise<any>) => {
            console.warn('Consider migrating to useAPIWorlds for better error handling and consistency');
            return existingQueryFn;
        }
    };
};

/**
 * Migration utility to replace existing version functions
 */
export const createMigratedVersionUtils = () => {
    return {
        // Replace utils/github-api functions
        fetchLatestRelease: () => clientVersionAPIClient.getLatestVersion(),
        fetchReleases: (limit?: number) => clientVersionAPIClient.getAllReleases(limit),
        getVersionInfo: () => clientVersionAPIClient.getLatestVersion(),
        
        // New utilities
        getCurrentVersion: () => clientVersionAPIClient.getCurrentVersion(),
        checkForUpdates: () => clientVersionAPIClient.getUpdateInfo(),
    };
};

/**
 * Migration utility to replace existing logging
 */
export const createMigratedLoggingUtils = () => {
    return {
        // Replace existing logEvent function
        logEvent: (params: {
            eventType: string;
            eventSource?: string;
            metadata?: Record<string, unknown>;
        }) => clientLoggingAPIClient.logEvent(params),
        
        // Enhanced logging methods
        logUserAction: (action: string, userId?: string, metadata?: Record<string, unknown>) => 
            clientLoggingAPIClient.logUserAction(action, userId, metadata),
        logError: (error: Error | string, source?: string, metadata?: Record<string, unknown>) => {
            const errorObj = typeof error === 'string' ? new Error(error) : error;
            return clientLoggingAPIClient.logError(errorObj, source, metadata);
        },
    };
};

/**
 * Create a unified migration object for easy replacement
 */
export const createAPIMigration = () => {
    return {
        worlds: createMigratedWorldsHook(),
        version: createMigratedVersionUtils(),
        logging: createMigratedLoggingUtils(),
        
        // Helper to show migration path
        showMigrationGuide: () => {
            console.group('🚀 Clean API Migration Guide');
            console.log('Replace existing patterns with new API hooks:');
            console.log('1. useWorlds → useAPIWorlds');
            console.log('2. useBackgrounds → useAPIBackgrounds');
            console.log('3. Direct fetch calls → API client methods');
            console.log('4. Manual logging → useAPILogging');
            console.log('5. Version utils → useLatestVersion, useCurrentVersion');
            console.groupEnd();
        }
    };
};
