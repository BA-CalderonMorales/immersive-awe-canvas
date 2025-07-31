/**
 * Backgrounds API React Hook
 * 
 * React hook for background operations using Clean API architecture
 */

import { useQuery } from '@tanstack/react-query';
import { clientSupabaseAPIClient } from '../clients/supabase-client';
import type { Database } from '@database/supabase/types';

type Background = Database['public']['Tables']['backgrounds']['Row'];
type DefaultGeometry = Database['public']['Tables']['default_geometries']['Row'];

/**
 * Hook to get all backgrounds with React Query caching
 */
export const useAPIBackgrounds = (options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
}) => {
    return useQuery<Background[]>({
        queryKey: ['backgrounds'],
        queryFn: async () => {
            const { data, error } = await clientSupabaseAPIClient.getBackgrounds();
            if (error) throw error;
            return data!;
        },
        staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
        refetchInterval: options?.refetchInterval,
        enabled: options?.enabled ?? true,
    });
};

/**
 * Hook to get all default geometries with React Query caching
 */
export const useAPIDefaultGeometries = (options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
}) => {
    return useQuery<DefaultGeometry[]>({
        queryKey: ['default_geometries'],
        queryFn: async () => {
            const { data, error } = await clientSupabaseAPIClient.getDefaultGeometries();
            if (error) throw error;
            return data!;
        },
        staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
        refetchInterval: options?.refetchInterval,
        enabled: options?.enabled ?? true,
    });
};
