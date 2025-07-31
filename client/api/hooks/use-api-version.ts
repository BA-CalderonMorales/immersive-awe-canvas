/**
 * Version API React Hook
 * 
 * React hook for version management using Clean API architecture
 */

import { useQuery } from '@tanstack/react-query';
import { clientVersionAPIClient } from '../clients/version-client';
import type { VersionInfo } from '../clients/github-client';

/**
 * Hook to get current application version
 */
export const useCurrentVersion = () => {
    return clientVersionAPIClient.getCurrentVersion();
};

/**
 * Hook to get latest version from GitHub with React Query caching
 */
export const useLatestVersion = (options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
}) => {
    return useQuery<VersionInfo>({
        queryKey: ['version', 'latest'],
        queryFn: async () => {
            const { data, error } = await clientVersionAPIClient.getLatestVersion();
            if (error) throw error;
            return data!;
        },
        staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
        refetchInterval: options?.refetchInterval ?? 30 * 60 * 1000, // 30 minutes
        enabled: options?.enabled ?? true,
    });
};

/**
 * Hook to get all releases from GitHub
 */
export const useAllReleases = (limit: number = 10, options?: {
    enabled?: boolean;
    staleTime?: number;
}) => {
    return useQuery<VersionInfo[]>({
        queryKey: ['version', 'releases', limit],
        queryFn: async () => {
            const { data, error } = await clientVersionAPIClient.getAllReleases(limit);
            if (error) throw error;
            return data!;
        },
        staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
        enabled: options?.enabled ?? true,
    });
};

/**
 * Hook to check for version updates
 */
export const useVersionUpdate = (options?: {
    enabled?: boolean;
    checkInterval?: number;
}) => {
    return useQuery({
        queryKey: ['version', 'update-check'],
        queryFn: () => clientVersionAPIClient.getUpdateInfo(),
        staleTime: 15 * 60 * 1000, // 15 minutes
        refetchInterval: options?.checkInterval ?? 60 * 60 * 1000, // 1 hour
        enabled: options?.enabled ?? true,
    });
};

/**
 * Hook to clear version cache
 */
export const useClearVersionCache = () => {
    return () => {
        clientVersionAPIClient.clearCache();
    };
};
