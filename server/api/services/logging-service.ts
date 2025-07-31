/**
 * Logging Service
 *
 * Server-side logging service
 */

import type { APIResult } from "@ba-calderonmorales/clean-api";

export interface LogEventParams {
    eventType: string;
    eventSource?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Server Logging Service (Minimal Implementation)
 */
export class LoggingService {
    private static instance: LoggingService;

    private constructor() {}

    static getInstance(): LoggingService {
        if (!LoggingService.instance) {
            LoggingService.instance = new LoggingService();
        }
        return LoggingService.instance;
    }

    /**
     * Log an event
     */
    async logEvent(params: LogEventParams): APIResult<any> {
        try {
            // Simple console logging for now
            console.log("📝 Server Log:", {
                type: params.eventType,
                source: params.eventSource || "server",
                metadata: params.metadata,
                timestamp: new Date().toISOString(),
            });

            return { data: { success: true } };
        } catch (error) {
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
    ): APIResult<any> {
        return this.logEvent({
            eventType: "user_action",
            eventSource: "server",
            metadata: {
                action,
                userId,
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
    ): APIResult<any> {
        return this.logEvent({
            eventType: "error",
            eventSource: source || "server",
            metadata: {
                message: error.message,
                stack: error.stack,
                name: error.name,
                timestamp: new Date().toISOString(),
                ...metadata,
            },
        });
    }
}

// Export singleton instance
export const loggingService = LoggingService.getInstance();
