/**
 * Log Repository
 *
 * Data access layer for log operations
 */

import type { APIResult } from "@ba-calderonmorales/clean-api";
import { supabaseAPIClient } from "../clients/supabase-client";

export interface LogEntity {
    id?: number;
    event_type: string;
    event_source?: string;
    metadata?: Record<string, unknown>;
    created_at?: string;
    updated_at?: string;
}

export interface LogFilters {
    eventType?: string;
    eventSource?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
}

export class LogRepository {
    private static instance: LogRepository;

    private constructor() {}

    static getInstance(): LogRepository {
        if (!LogRepository.instance) {
            LogRepository.instance = new LogRepository();
        }
        return LogRepository.instance;
    }

    /**
     * Create a new log entry
     */
    async create(
        logData: Omit<LogEntity, "id" | "created_at" | "updated_at">
    ): APIResult<LogEntity> {
        return await supabaseAPIClient.insert<LogEntity>("logs", logData);
    }

    /**
     * Find logs with optional filters
     */
    async findMany(filters?: LogFilters): APIResult<LogEntity[]> {
        const queryFilters: Record<string, string> = {};

        if (filters?.eventType) {
            queryFilters["event_type"] = `eq.${filters.eventType}`;
        }

        if (filters?.eventSource) {
            queryFilters["event_source"] = `eq.${filters.eventSource}`;
        }

        if (filters?.startDate) {
            queryFilters["created_at"] = `gte.${filters.startDate}`;
        }

        if (filters?.endDate) {
            queryFilters["created_at"] = `lte.${filters.endDate}`;
        }

        return await supabaseAPIClient.query<LogEntity>("logs", {
            filters: queryFilters,
            limit: filters?.limit,
            offset: filters?.offset,
            orderBy: "created_at.desc",
        });
    }

    /**
     * Find logs by event type
     */
    async findByEventType(
        eventType: string,
        limit?: number
    ): APIResult<LogEntity[]> {
        return this.findMany({ eventType, limit });
    }

    /**
     * Find logs by event source
     */
    async findByEventSource(
        eventSource: string,
        limit?: number
    ): APIResult<LogEntity[]> {
        return this.findMany({ eventSource, limit });
    }

    /**
     * Find recent logs
     */
    async findRecent(limit: number = 100): APIResult<LogEntity[]> {
        return this.findMany({ limit });
    }

    /**
     * Count logs with optional filters
     */
    async count(
        filters?: Omit<LogFilters, "limit" | "offset">
    ): APIResult<number> {
        try {
            const queryFilters: Record<string, string> = {};

            if (filters?.eventType) {
                queryFilters["event_type"] = `eq.${filters.eventType}`;
            }

            if (filters?.eventSource) {
                queryFilters["event_source"] = `eq.${filters.eventSource}`;
            }

            if (filters?.startDate) {
                queryFilters["created_at"] = `gte.${filters.startDate}`;
            }

            if (filters?.endDate) {
                queryFilters["created_at"] = `lte.${filters.endDate}`;
            }

            const { data, error } = await supabaseAPIClient.query<{
                count: number;
            }>("logs", {
                select: "count()",
                filters: queryFilters,
            });

            if (error) {
                return { error };
            }

            return { data: data?.[0]?.count || 0 };
        } catch (error) {
            return { error: error as Error };
        }
    }
}

// Export singleton instance
export const logRepository = LogRepository.getInstance();
