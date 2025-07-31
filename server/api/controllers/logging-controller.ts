/**
 * Logging Controller
 *
 * Handles logging-related API endpoints
 */

import {
    loggingService,
    type LogEventParams,
    type LogQueryParams,
} from "../services/logging-service";

export class LoggingController {
    private static instance: LoggingController;

    private constructor() {}

    static getInstance(): LoggingController {
        if (!LoggingController.instance) {
            LoggingController.instance = new LoggingController();
        }
        return LoggingController.instance;
    }

    /**
     * Log an event
     */
    async logEvent(params: LogEventParams) {
        try {
            const { data, error } = await loggingService.logEvent(params);

            if (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                success: true,
                data,
                message: "Event logged successfully",
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to log event",
            };
        }
    }

    /**
     * Query logs
     */
    async queryLogs(params?: LogQueryParams) {
        try {
            const { data, error } = await loggingService.queryLogs(params);

            if (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                success: true,
                data,
                count: data?.length || 0,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to query logs",
            };
        }
    }

    /**
     * Get logs by event type
     */
    async getLogsByEventType(eventType: string, limit: number = 50) {
        try {
            const { data, error } = await loggingService.getLogsByEventType(
                eventType,
                limit
            );

            if (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                success: true,
                data,
                eventType,
                count: data?.length || 0,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to get logs by event type",
            };
        }
    }

    /**
     * Get logs by event source
     */
    async getLogsByEventSource(eventSource: string, limit: number = 50) {
        try {
            const { data, error } = await loggingService.getLogsByEventSource(
                eventSource,
                limit
            );

            if (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                success: true,
                data,
                eventSource,
                count: data?.length || 0,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to get logs by event source",
            };
        }
    }

    /**
     * Get recent logs
     */
    async getRecentLogs(limit: number = 100) {
        try {
            const { data, error } = await loggingService.getRecentLogs(limit);

            if (error) {
                return {
                    success: false,
                    error: error.message,
                };
            }

            return {
                success: true,
                data,
                count: data?.length || 0,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to get recent logs",
            };
        }
    }

    /**
     * Log user action (convenience method)
     */
    async logUserAction(
        action: string,
        userId?: string,
        metadata?: Record<string, unknown>
    ) {
        return this.logEvent({
            eventType: "user_action",
            eventSource: "client",
            metadata: {
                action,
                userId,
                timestamp: new Date().toISOString(),
                ...metadata,
            },
        });
    }

    /**
     * Log error (convenience method)
     */
    async logError(
        error: Error | string,
        source?: string,
        metadata?: Record<string, unknown>
    ) {
        const errorMessage = typeof error === "string" ? error : error.message;
        const errorStack = typeof error === "string" ? undefined : error.stack;

        return this.logEvent({
            eventType: "error",
            eventSource: source || "unknown",
            metadata: {
                message: errorMessage,
                stack: errorStack,
                timestamp: new Date().toISOString(),
                ...metadata,
            },
        });
    }

    /**
     * Log performance metric (convenience method)
     */
    async logPerformance(
        metric: string,
        value: number,
        unit: string = "ms",
        metadata?: Record<string, unknown>
    ) {
        return this.logEvent({
            eventType: "performance",
            eventSource: "client",
            metadata: {
                metric,
                value,
                unit,
                timestamp: new Date().toISOString(),
                ...metadata,
            },
        });
    }
}

// Export singleton instance
export const loggingController = LoggingController.getInstance();
