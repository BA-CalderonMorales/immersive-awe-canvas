/**
 * Supabase REST Client
 *
 * Client for direct Supabase REST API operations using Clean API architecture
 */

import { API } from "@ba-calderonmorales/clean-api";
import {
    supabaseRestAPI,
    supabaseRestClient as configuredClient,
} from "../config.js";

// Create REST API bucket
export const supabaseRestAPI_bucket = new API("supabase-rest");

/**
 * Log Entry Interface
 */
export interface LogEntry {
    id?: string;
    event_type: string;
    event_source: string;
    metadata?: Record<string, any>;
    created_at?: string;
}

/**
 * User Interface
 */
export interface User {
    id?: string;
    email?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Supabase REST Client
 * Provides methods for direct Supabase REST API operations
 */
export class SupabaseRestClient {
    /**
     * Create a log entry
     */
    async createLog(
        logEntry: Omit<LogEntry, "id" | "created_at">
    ): Promise<LogEntry> {
        const response = await configuredClient.request<LogEntry>({
            url: supabaseRestAPI.routes.logs,
            method: "POST",
            data: logEntry,
        });

        return response;
    }

    /**
     * Get logs with optional filtering
     */
    async getLogs(filters?: Record<string, any>): Promise<LogEntry[]> {
        let url = supabaseRestAPI.routes.logs;

        if (filters) {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                queryParams.append(key, `eq.${value}`);
            });
            url += `?${queryParams.toString()}`;
        }

        const response = await configuredClient.request<LogEntry[]>({
            url,
            method: "GET",
        });

        return response;
    }

    /**
     * Update a log entry
     */
    async updateLog(id: string, updates: Partial<LogEntry>): Promise<LogEntry> {
        const response = await configuredClient.request<LogEntry>({
            url: `${supabaseRestAPI.routes.logs}?id=eq.${id}`,
            method: "PATCH",
            data: updates,
        });

        return response;
    }

    /**
     * Get users
     */
    async getUsers(): Promise<User[]> {
        const response = await configuredClient.request<User[]>({
            url: supabaseRestAPI.routes.users,
            method: "GET",
        });

        return response;
    }

    /**
     * Create a user
     */
    async createUser(
        userData: Omit<User, "id" | "created_at" | "updated_at">
    ): Promise<User> {
        const response = await configuredClient.request<User>({
            url: supabaseRestAPI.routes.users,
            method: "POST",
            data: userData,
        });

        return response;
    }

    /**
     * Get analytics data
     */
    async getAnalytics(filters?: Record<string, any>): Promise<any[]> {
        let url = supabaseRestAPI.routes.analytics;

        if (filters) {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                queryParams.append(key, `eq.${value}`);
            });
            url += `?${queryParams.toString()}`;
        }

        const response = await configuredClient.request<any[]>({
            url,
            method: "GET",
        });

        return response;
    }
}

// Export pre-configured client instance
export const supabaseRestClient = new SupabaseRestClient();
