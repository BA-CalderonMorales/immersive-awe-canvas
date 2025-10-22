/**
 * Database API Helpers
 *
 * Utility functions for database API operations
 */

import { APIError } from "@ba-calderonmorales/clean-api";
import { sanitizeString, isValidEmail } from "../../shared/security";
import { databaseLoggingClient } from "../clients/logging-client";

/**
 * Retry configuration interface
 */
export interface RetryConfig {
    maxAttempts: number;
    delay: number;
    backoffFactor: number;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxAttempts: 3,
    delay: 1000,
    backoffFactor: 2,
};

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
    fn: () => Promise<T>,
    config: Partial<RetryConfig> = {}
): Promise<T> {
    const { maxAttempts, delay, backoffFactor } = {
        ...DEFAULT_RETRY_CONFIG,
        ...config,
    };
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError =
                error instanceof Error ? error : new Error("Unknown error");

            if (attempt === maxAttempts) {
                await databaseLoggingClient.logError(
                    `Function failed after ${maxAttempts} attempts`,
                    { error: lastError.message, attempts: attempt }
                );
                break;
            }

            const waitTime = delay * backoffFactor ** (attempt - 1);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }

    throw lastError!;
}

/**
 * Sanitize input data for database operations
 */
export function sanitizeInputData<T extends Record<string, any>>(data: T): T {
    const sanitized = {} as T;

    for (const [key, value] of Object.entries(data)) {
        if (typeof value === "string") {
            sanitized[key as keyof T] = sanitizeString(value) as T[keyof T];
        } else if (Array.isArray(value)) {
            sanitized[key as keyof T] = value.map(item =>
                typeof item === "string" ? sanitizeString(item) : item
            ) as T[keyof T];
        } else if (value && typeof value === "object") {
            sanitized[key as keyof T] = sanitizeInputData(value) as T[keyof T];
        } else {
            sanitized[key as keyof T] = value;
        }
    }

    return sanitized;
}

/**
 * Validate email in input data
 */
export function validateEmailInData(data: any, emailField = "email"): boolean {
    if (!data || typeof data !== "object") {
        return false;
    }

    const email = data[emailField];
    return email ? isValidEmail(email) : true; // Email is optional
}

/**
 * Create API error with logging
 */
export async function createAPIError(
    message: string,
    status = 500,
    context?: Record<string, any>
): Promise<APIError> {
    await databaseLoggingClient.logError(message, { status, ...context });
    return new APIError(message, { status });
}

/**
 * Format error response
 */
export function formatErrorResponse(
    error: Error | APIError,
    context?: Record<string, any>
) {
    const response = {
        error: error.message,
        timestamp: new Date().toISOString(),
        ...(context && { context }),
    };

    if (error instanceof APIError) {
        return {
            ...response,
            status: error.status,
        };
    }

    return response;
}

/**
 * Log API operation with timing
 */
export async function logApiOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    context?: Record<string, any>
): Promise<T> {
    const startTime = Date.now();

    try {
        const result = await fn();
        const duration = Date.now() - startTime;

        await databaseLoggingClient.logInfo(
            `API operation completed: ${operation}`,
            { duration: `${duration}ms`, success: true, ...context }
        );

        return result;
    } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";

        await databaseLoggingClient.logError(
            `API operation failed: ${operation}`,
            {
                duration: `${duration}ms`,
                error: errorMessage,
                success: false,
                ...context,
            }
        );

        throw error;
    }
}

/**
 * Build query parameters for REST API calls
 */
export function buildQueryParams(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
                value.forEach(item => queryParams.append(key, item.toString()));
            } else {
                queryParams.append(key, value.toString());
            }
        }
    });

    return queryParams.toString();
}

/**
 * Parse error from API response
 */
export function parseApiError(response: any): string {
    if (typeof response === "string") {
        return response;
    }

    if (response && typeof response === "object") {
        return response.message || response.error || JSON.stringify(response);
    }

    return "Unknown API error";
}
