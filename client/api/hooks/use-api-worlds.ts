/**
 * Worlds API React Hook
 * 
 * React hook for world operations using Clean API architecture
 */

import { useQuery } from '@tanstack/react-query';
import { clientSupabaseAPIClient } from '../clients/supabase-client';
import type { Database } from '@database/supabase/types';

type World = Database['public']['Tables']['worlds']['Row'];

/**
 * Hook to get all worlds with React Query caching
 */
export const useAPIWorlds = (options?: {
    enabled?: boolean;
    staleTime?: number;
    refetchInterval?: number;
}) => {
    return useQuery<World[]>({
        queryKey: ['worlds'],
        queryFn: async () => {
            const { data, error } = await clientSupabaseAPIClient.getWorlds();
            if (error) throw error;
            return data!;
        },
        staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 minutes
        refetchInterval: options?.refetchInterval,
        enabled: options?.enabled ?? true,
    });
};

/**
 * Hook to get world by slug
 */
export const useAPIWorldBySlug = (slug: string, options?: {
    enabled?: boolean;
    staleTime?: number;
}) => {
    return useQuery<World>({
        queryKey: ['worlds', 'by-slug', slug],
        queryFn: async () => {
            const { data, error } = await clientSupabaseAPIClient.getWorldBySlug(slug);
            if (error) throw error;
            return data!;
        },
        staleTime: options?.staleTime ?? 10 * 60 * 1000, // 10 minutes
        enabled: (options?.enabled ?? true) && Boolean(slug),
    });
};
