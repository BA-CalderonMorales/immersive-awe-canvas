/**
 * Shared Logging Utilities
 *
 * Common logging operations used by both server and client
 * This eliminates duplicate logging logic
 */

import type { APIResult } from "@ba-calderonmorales/clean-api";
import type { LogEventParams, LogEntry } from "./api-types.js";

/**
 * Shared Logger Interface
 * Common interface for both server and client logging implementations
 */
export interface SharedLogger {
    logEvent(params: LogEventParams): Promise<APIResult<LogEntry>>;
    logUserAction(
        action: string,
        userId?: string,
        metadata?: Record<string, unknown>
    ): Promise<APIResult<LogEntry>>;
    logError(
        error: Error,
        source?: string,
        metadata?: Record<string, unknown>
    ): Promise<APIResult<LogEntry>>;
    logPerformance(
        operationName: string,
        duration: number,
        metadata?: Record<string, unknown>
    ): Promise<APIResult<LogEntry>>;
}

/**
 * Base Logger Implementation
 * Common logging logic shared between server and client
 */
export abstract class BaseLogger implements SharedLogger {
    protected abstract executeLogEvent(
        params: LogEventParams
    ): Promise<APIResult<LogEntry>>;

    /**
     * Sanitize log data to prevent injection attacks
     */
    protected sanitizeLogData(
        data: Record<string, unknown>
    ): Record<string, unknown> {
        const sanitized: Record<string, unknown> = {};

        for (const [key, value] of Object.entries(data)) {
            // Limit key length
            const sanitizedKey = key.slice(0, 50);

            // Sanitize value based on type
            if (typeof value === "string") {
                sanitized[sanitizedKey] = value.slice(0, 1000); // Limit string length
            } else if (typeof value === "number") {
                sanitized[sanitizedKey] = isFinite(value) ? value : 0;
            } else if (typeof value === "boolean") {
                sanitized[sanitizedKey] = value;
            } else if (value === null || value === undefined) {
                sanitized[sanitizedKey] = null;
            } else if (typeof value === "object") {
                // Recursively sanitize nested objects (max depth 3)
                sanitized[sanitizedKey] = this.sanitizeNestedObject(value, 3);
            } else {
                // Convert other types to string
                sanitized[sanitizedKey] = String(value).slice(0, 100);
            }
        }

        return sanitized;
    }

    private sanitizeNestedObject(obj: any, maxDepth: number): any {
        if (maxDepth <= 0 || obj === null || obj === undefined) {
            return null;
        }

        if (Array.isArray(obj)) {
            return obj
                .slice(0, 10)
                .map(item => this.sanitizeNestedObject(item, maxDepth - 1));
        }

        if (typeof obj === "object") {
            const sanitized: any = {};
            let count = 0;
            for (const [key, value] of Object.entries(obj)) {
                if (count >= 20) break; // Limit object properties
                sanitized[key.slice(0, 50)] = this.sanitizeNestedObject(
                    value,
                    maxDepth - 1
                );
                count++;
            }
            return sanitized;
        }

        return typeof obj === "string" ? obj.slice(0, 100) : obj;
    }

    /**
     * Log a generic event
     */
    async logEvent(params: LogEventParams): Promise<APIResult<LogEntry>> {
        try {
            const sanitizedParams: LogEventParams = {
                eventType: params.eventType?.slice(0, 100) || "unknown",
                eventSource: params.eventSource?.slice(0, 100),
                metadata: params.metadata
                    ? this.sanitizeLogData(params.metadata)
                    : undefined,
            };

            return await this.executeLogEvent(sanitizedParams);
        } catch (error) {
            console.error("Failed to log event:", error);
            return { error: error as Error };
        }
    }

    /**
     * Log user action
     */
    async logUserAction(
        action: string,
        userId?: string,
        metadata?: Record<string, unknown>
    ): Promise<APIResult<LogEntry>> {
        return this.logEvent({
            eventType: "user_action",
            eventSource: typeof window !== "undefined" ? "client" : "server",
            metadata: {
                action: action.slice(0, 100),
                userId: userId?.slice(0, 50),
                timestamp: new Date().toISOString(),
                ...metadata,
            },
        });
    }

    /**
     * Log error
     */
    async logError(
        error: Error,
        source?: string,
        metadata?: Record<string, unknown>
    ): Promise<APIResult<LogEntry>> {
        return this.logEvent({
            eventType: "error",
            eventSource:
                source || (typeof window !== "undefined" ? "client" : "server"),
            metadata: {
                message: error.message.slice(0, 500),
                stack: error.stack?.slice(0, 1000),
                name: error.name,
                timestamp: new Date().toISOString(),
                ...metadata,
            },
        });
    }

    /**
     * Log performance metrics
     */
    async logPerformance(
        operationName: string,
        duration: number,
        metadata?: Record<string, unknown>
    ): Promise<APIResult<LogEntry>> {
        return this.logEvent({
            eventType: "performance",
            eventSource: typeof window !== "undefined" ? "client" : "server",
            metadata: {
                operation: operationName.slice(0, 100),
                duration: Math.round(duration),
                timestamp: new Date().toISOString(),
                ...metadata,
            },
        });
    }
}

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
    private startTimes = new Map<string, number>();

    /**
     * Start timing an operation
     */
    start(operationName: string): void {
        this.startTimes.set(operationName, Date.now());
    }

    /**
     * End timing and return duration
     */
    end(operationName: string): number {
        const startTime = this.startTimes.get(operationName);
        if (!startTime) {
            console.warn(`No start time found for operation: ${operationName}`);
            return 0;
        }

        const duration = Date.now() - startTime;
        this.startTimes.delete(operationName);
        return duration;
    }

    /**
     * End timing and automatically log performance
     */
    async endAndLog(
        operationName: string,
        logger: SharedLogger,
        metadata?: Record<string, unknown>
    ): Promise<number> {
        const duration = this.end(operationName);
        await logger.logPerformance(operationName, duration, metadata);
        return duration;
    }
}

// Export singleton performance monitor
export const performanceMonitor = new PerformanceMonitor();
