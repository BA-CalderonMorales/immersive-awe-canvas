/**
 * Supabase API Client for Client-side
 * 
 * Handles Supabase operations using both the Supabase client and Clean API patterns
 */

import { API } from '@ba-calderonmorales/clean-api';
import type { APIResult } from '@ba-calderonmorales/clean-api';
import { supabase } from '@database/supabase/client';
import type { Database, Json } from '@database/supabase/types';

// Supabase API bucket for client
export const clientSupabaseAPI = new API('supabase-client');

// Database types
type World = Database['public']['Tables']['worlds']['Row'];
type Background = Database['public']['Tables']['backgrounds']['Row'];
type DefaultGeometry = Database['public']['Tables']['default_geometries']['Row'];
type LogEntry = Database['public']['Tables']['logs']['Row'];

/**
 * Client-side Supabase API Client
 * Uses the Supabase client library for optimal performance and auth handling
 */
export class ClientSupabaseAPIClient {
    /**
     * Fetch worlds from Supabase
     */
    async getWorlds(): APIResult<World[]> {
        try {
            const { data, error } = await supabase
                .from('worlds')
                .select('*')
                .eq('is_featured', true)
                .order('id', { ascending: true });

            if (error) {
                return { error: new Error(error.message) };
            }

            return { data: data || [] };
        } catch (error) {
            return { error: error as Error };
        }
    }

    /**
     * Fetch world by slug
     */
    async getWorldBySlug(slug: string): APIResult<World> {
        try {
            const { data, error } = await supabase
                .from('worlds')
                .select('*')
                .eq('slug', slug)
                .eq('is_featured', true)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return { error: new Error('World not found') };
                }
                return { error: new Error(error.message) };
            }

            return { data };
        } catch (error) {
            return { error: error as Error };
        }
    }

    /**
     * Fetch backgrounds from Supabase
     */
    async getBackgrounds(): APIResult<Background[]> {
        try {
            const { data, error } = await supabase
                .from('backgrounds')
                .select('*')
                .eq('is_featured', true)
                .order('sort_order', { ascending: true });

            if (error) {
                return { error: new Error(error.message) };
            }

            return { data: data || [] };
        } catch (error) {
            return { error: error as Error };
        }
    }

    /**
     * Fetch default geometries from Supabase
     */
    async getDefaultGeometries(): APIResult<DefaultGeometry[]> {
        try {
            const { data, error } = await supabase
                .from('default_geometries')
                .select('*')
                .eq('is_featured', true)
                .order('sort_order', { ascending: true });

            if (error) {
                return { error: new Error(error.message) };
            }

            return { data: data || [] };
        } catch (error) {
            return { error: error as Error };
        }
    }

    /**
     * Log an event to Supabase
     */
    async logEvent(params: {
        eventType: string;
        eventSource?: string;
        metadata?: Record<string, unknown>;
    }): APIResult<LogEntry> {
        try {
            // Use the existing client logger logic but with Clean API return pattern
            const { error } = await supabase.from('logs').insert({
                event_type: params.eventType?.slice(0, 100) || 'unknown',
                event_source: params.eventSource?.slice(0, 100),
                metadata: params.metadata as Json || null,
            });

            if (error) {
                return { error: new Error(error.message) };
            }

            // Since Supabase doesn't return the inserted data by default,
            // we'll return a success indicator
            return { data: { event_type: params.eventType } as LogEntry };
        } catch (error) {
            return { error: error as Error };
        }
    }

    /**
     * Generic query method for any table
     */
    async query<T = any>(
        table: keyof Database['public']['Tables'],
        options?: {
            select?: string;
            filters?: Record<string, any>;
            limit?: number;
            orderBy?: string;
        }
    ): APIResult<T[]> {
        try {
            let query = supabase.from(table).select(options?.select || '*') as any;

            // Apply filters
            if (options?.filters) {
                Object.entries(options.filters).forEach(([key, value]) => {
                    query = query.eq(key, value);
                });
            }

            // Apply ordering
            if (options?.orderBy) {
                const [column, direction] = options.orderBy.split(':');
                query = query.order(column, { 
                    ascending: direction !== 'desc' 
                });
            }

            // Apply limit
            if (options?.limit) {
                query = query.limit(options.limit);
            }

            const { data, error } = await query;

            if (error) {
                return { error: new Error(error.message) };
            }

            return { data: data as T[] || [] };
        } catch (error) {
            return { error: error as Error };
        }
    }
}

// Export singleton instance
export const clientSupabaseAPIClient = new ClientSupabaseAPIClient();
