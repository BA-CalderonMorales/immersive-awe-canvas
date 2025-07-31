/**
 * Supabase API Client
 * 
 * Handles all Supabase database communication using Clean API architecture
 */

import { API } from '@ba-calderonmorales/clean-api';
import type { APIResult } from '@ba-calderonmorales/clean-api';
import { supabaseAPI, supabaseClient } from '../config';

// Supabase API bucket
export const supabaseAPIBucket = new API('supabase');

// Types for database operations
interface LogEntry {
    event_type: string;
    event_source?: string;
    metadata?: Record<string, unknown>;
    created_at?: string;
}

interface LogInsertData {
    event_type: string;
    event_source?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Supabase API Client Class
 */
export class SupabaseAPIClient {
    /**
     * Insert a log entry
     */
    async insertLog(logData: LogInsertData): APIResult<LogEntry> {
        try {
            const url = supabaseAPI.routes.logs;
            const response = await supabaseClient.request({
                url,
                method: 'POST',
                data: logData,
                headers: {
                    'Prefer': 'return=representation'
                }
            });

            return { data: response[0] };
        } catch (error) {
            console.error('Error inserting log:', error);
            return { error: error as Error };
        }
    }

    /**
     * Get logs with optional filtering
     */
    async getLogs(params?: {
        eventType?: string;
        eventSource?: string;
        limit?: number;
        offset?: number;
    }): APIResult<LogEntry[]> {
        try {
            let url = supabaseAPI.routes.logs;
            const queryParams = new URLSearchParams();

            if (params?.eventType) {
                queryParams.append('event_type', `eq.${params.eventType}`);
            }
            if (params?.eventSource) {
                queryParams.append('event_source', `eq.${params.eventSource}`);
            }
            if (params?.limit) {
                queryParams.append('limit', params.limit.toString());
            }
            if (params?.offset) {
                queryParams.append('offset', params.offset.toString());
            }

            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }

            const logs: LogEntry[] = await supabaseClient.request({
                url,
                method: 'GET'
            });

            return { data: logs };
        } catch (error) {
            console.error('Error fetching logs:', error);
            return { error: error as Error };
        }
    }

    /**
     * Generic query method for any Supabase table
     */
    async query<T = any>(
        table: string,
        params?: {
            select?: string;
            filters?: Record<string, string>;
            limit?: number;
            offset?: number;
            orderBy?: string;
        }
    ): APIResult<T[]> {
        try {
            let url = `/rest/v1/${table}`;
            const queryParams = new URLSearchParams();

            if (params?.select) {
                queryParams.append('select', params.select);
            }

            if (params?.filters) {
                Object.entries(params.filters).forEach(([key, value]) => {
                    queryParams.append(key, value);
                });
            }

            if (params?.limit) {
                queryParams.append('limit', params.limit.toString());
            }

            if (params?.offset) {
                queryParams.append('offset', params.offset.toString());
            }

            if (params?.orderBy) {
                queryParams.append('order', params.orderBy);
            }

            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }

            const data: T[] = await supabaseClient.request({
                url,
                method: 'GET'
            });

            return { data };
        } catch (error) {
            console.error(`Error querying ${table}:`, error);
            return { error: error as Error };
        }
    }

    /**
     * Generic insert method for any Supabase table
     */
    async insert<T = any>(table: string, data: any): APIResult<T> {
        try {
            const url = `/rest/v1/${table}`;
            const response = await supabaseClient.request({
                url,
                method: 'POST',
                data,
                headers: {
                    'Prefer': 'return=representation'
                }
            });

            return { data: response[0] };
        } catch (error) {
            console.error(`Error inserting into ${table}:`, error);
            return { error: error as Error };
        }
    }

    /**
     * Generic update method for any Supabase table
     */
    async update<T = any>(
        table: string,
        data: any,
        filters: Record<string, string>
    ): APIResult<T[]> {
        try {
            let url = `/rest/v1/${table}`;
            const queryParams = new URLSearchParams();

            Object.entries(filters).forEach(([key, value]) => {
                queryParams.append(key, value);
            });

            if (queryParams.toString()) {
                url += `?${queryParams.toString()}`;
            }

            const response = await supabaseClient.request({
                url,
                method: 'PATCH',
                data,
                headers: {
                    'Prefer': 'return=representation'
                }
            });

            return { data: response };
        } catch (error) {
            console.error(`Error updating ${table}:`, error);
            return { error: error as Error };
        }
    }
}

// Export singleton instance
export const supabaseAPIClient = new SupabaseAPIClient();
