/**
 * Database Logging Client
 *
 * Specialized client for database logging operations using Clean API architecture
 */

import { API } from "@ba-calderonmorales/clean-api";
import {
    databaseLoggingAPI,
    supabaseRestClient as configuredClient,
} from "../config.js";
import { Logger, LogLevel } from "../../shared/logger.js";

// Create Logging API bucket
export const loggingAPI = new API("database-logging");

/**
 * Log Entry for Database Operations
 */
export interface DatabaseLogEntry {
    id?: string;
    event_type: string;
    event_source: string;
    level: LogLevel;
    message: string;
    metadata?: Record<string, any>;
    timestamp: string;
    created_at?: string;
}

/**
 * Database Logging Client
 * Provides centralized logging functionality for database operations
 */
export class DatabaseLoggingClient {
    private logger: Logger;

    constructor() {
        this.logger = Logger.getInstance();
    }

    /**
     * Log an error event
     */
    async logError(
        message: string,
        context?: Record<string, any>,
        eventSource = "database-api"
    ): Promise<void> {
        const logEntry: Omit<DatabaseLogEntry, "id" | "created_at"> = {
            event_type: "error",
            event_source: eventSource,
            level: LogLevel.ERROR,
            message,
            metadata: context,
            timestamp: new Date().toISOString(),
        };

        try {
            await configuredClient.request({
                url: databaseLoggingAPI.routes.createLog,
                method: "POST",
                data: logEntry,
            });

            // Also log locally
            this.logger.error(message, context);
        } catch (error) {
            // Fallback to console logging if database logging fails
            console.error("Failed to log error to database:", error);
            this.logger.error(message, context);
        }
    }

    /**
     * Log a warning event
     */
    async logWarning(
        message: string,
        context?: Record<string, any>,
        eventSource = "database-api"
    ): Promise<void> {
        const logEntry: Omit<DatabaseLogEntry, "id" | "created_at"> = {
            event_type: "warning",
            event_source: eventSource,
            level: LogLevel.WARN,
            message,
            metadata: context,
            timestamp: new Date().toISOString(),
        };

        try {
            await configuredClient.request({
                url: databaseLoggingAPI.routes.createLog,
                method: "POST",
                data: logEntry,
            });

            this.logger.warn(message, context);
        } catch (error) {
            console.warn("Failed to log warning to database:", error);
            this.logger.warn(message, context);
        }
    }

    /**
     * Log an info event
     */
    async logInfo(
        message: string,
        context?: Record<string, any>,
        eventSource = "database-api"
    ): Promise<void> {
        const logEntry: Omit<DatabaseLogEntry, "id" | "created_at"> = {
            event_type: "info",
            event_source: eventSource,
            level: LogLevel.INFO,
            message,
            metadata: context,
            timestamp: new Date().toISOString(),
        };

        try {
            await configuredClient.request({
                url: databaseLoggingAPI.routes.createLog,
                method: "POST",
                data: logEntry,
            });

            this.logger.info(message, context);
        } catch (error) {
            console.info("Failed to log info to database:", error);
            this.logger.info(message, context);
        }
    }

    /**
     * Log a debug event
     */
    async logDebug(
        message: string,
        context?: Record<string, any>,
        eventSource = "database-api"
    ): Promise<void> {
        const logEntry: Omit<DatabaseLogEntry, "id" | "created_at"> = {
            event_type: "debug",
            event_source: eventSource,
            level: LogLevel.DEBUG,
            message,
            metadata: context,
            timestamp: new Date().toISOString(),
        };

        try {
            await configuredClient.request({
                url: databaseLoggingAPI.routes.createLog,
                method: "POST",
                data: logEntry,
            });

            this.logger.debug(message, context);
        } catch (error) {
            console.debug("Failed to log debug to database:", error);
            this.logger.debug(message, context);
        }
    }

    /**
     * Get logs from database
     */
    async getLogs(filters?: Record<string, any>): Promise<DatabaseLogEntry[]> {
        let url = databaseLoggingAPI.routes.getLogs;

        if (filters) {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                queryParams.append(key, `eq.${value}`);
            });
            url += `?${queryParams.toString()}`;
        }

        try {
            const response = await configuredClient.request<DatabaseLogEntry[]>(
                {
                    url,
                    method: "GET",
                }
            );

            return response;
        } catch (error) {
            this.logger.error("Failed to retrieve logs from database", {
                error: error instanceof Error ? error.message : "Unknown error",
            });
            return [];
        }
    }

    /**
     * Log API request/response for debugging
     */
    async logApiCall(
        method: string,
        url: string,
        requestData?: any,
        responseData?: any,
        duration?: number,
        success = true
    ): Promise<void> {
        const context = {
            method,
            url,
            requestData: requestData
                ? JSON.stringify(requestData).slice(0, 1000)
                : undefined,
            responseData: responseData
                ? JSON.stringify(responseData).slice(0, 1000)
                : undefined,
            duration: duration ? `${duration}ms` : undefined,
            success,
        };

        if (success) {
            await this.logInfo(
                `API Call: ${method} ${url}`,
                context,
                "api-client"
            );
        } else {
            await this.logError(
                `API Call Failed: ${method} ${url}`,
                context,
                "api-client"
            );
        }
    }
}

// Export pre-configured client instance
export const databaseLoggingClient = new DatabaseLoggingClient();
