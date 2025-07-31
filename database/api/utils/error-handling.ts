/**
 * Database API Error Handling Utilities
 * 
 * Centralized error handling for database API operations
 */

import { APIError } from '@ba-calderonmorales/clean-api';
import { databaseLoggingClient } from '../clients/logging-client.js';

/**
 * Error types for database operations
 */
export enum DatabaseErrorType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
    AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
    NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
    CONFLICT_ERROR = 'CONFLICT_ERROR',
    RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
    SERVER_ERROR = 'SERVER_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Enhanced error interface with additional context
 */
export interface DatabaseError extends Error {
    type: DatabaseErrorType;
    status: number;
    context?: Record<string, any>;
    originalError?: Error;
}

/**
 * Create a standardized database error
 */
export function createDatabaseError(
    message: string,
    type: DatabaseErrorType,
    status: number,
    context?: Record<string, any>,
    originalError?: Error
): DatabaseError {
    const error = new Error(message) as DatabaseError;
    error.type = type;
    error.status = status;
    error.context = context;
    error.originalError = originalError;
    return error;
}

/**
 * Map HTTP status codes to error types
 */
export function mapStatusToErrorType(status: number): DatabaseErrorType {
    switch (status) {
        case 400:
            return DatabaseErrorType.VALIDATION_ERROR;
        case 401:
            return DatabaseErrorType.AUTHENTICATION_ERROR;
        case 403:
            return DatabaseErrorType.AUTHORIZATION_ERROR;
        case 404:
            return DatabaseErrorType.NOT_FOUND_ERROR;
        case 409:
            return DatabaseErrorType.CONFLICT_ERROR;
        case 429:
            return DatabaseErrorType.RATE_LIMIT_ERROR;
        case 500:
        case 502:
        case 503:
        case 504:
            return DatabaseErrorType.SERVER_ERROR;
        default:
            return DatabaseErrorType.UNKNOWN_ERROR;
    }
}

/**
 * Handle and log API errors
 */
export async function handleApiError(
    error: any,
    operation: string,
    context?: Record<string, any>
): Promise<DatabaseError> {
    let databaseError: DatabaseError;

    if (error instanceof APIError) {
        databaseError = createDatabaseError(
            error.message,
            mapStatusToErrorType(error.status || 500),
            error.status || 500,
            { ...context, apiError: true },
            error
        );
    } else if (error instanceof Error) {
        databaseError = createDatabaseError(
            error.message,
            DatabaseErrorType.UNKNOWN_ERROR,
            500,
            { ...context, originalMessage: error.message },
            error
        );
    } else {
        databaseError = createDatabaseError(
            'Unknown error occurred',
            DatabaseErrorType.UNKNOWN_ERROR,
            500,
            { ...context, rawError: JSON.stringify(error) }
        );
    }

    // Log the error
    await databaseLoggingClient.logError(
        `API operation failed: ${operation}`,
        {
            errorType: databaseError.type,
            status: databaseError.status,
            message: databaseError.message,
            context: databaseError.context
        }
    );

    return databaseError;
}

/**
 * Wrapper for async operations with error handling
 */
export async function withErrorHandling<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: Record<string, any>
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        const databaseError = await handleApiError(error, operationName, context);
        throw databaseError;
    }
}

/**
 * Error response formatter for API responses
 */
export interface ErrorResponse {
    error: string;
    type: DatabaseErrorType;
    status: number;
    timestamp: string;
    context?: Record<string, any>;
}

/**
 * Format error for API response
 */
export function formatErrorForResponse(error: DatabaseError): ErrorResponse {
    return {
        error: error.message,
        type: error.type,
        status: error.status,
        timestamp: new Date().toISOString(),
        context: error.context
    };
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: DatabaseError): boolean {
    return [
        DatabaseErrorType.NETWORK_ERROR,
        DatabaseErrorType.RATE_LIMIT_ERROR,
        DatabaseErrorType.SERVER_ERROR
    ].includes(error.type);
}

/**
 * Get retry delay based on error type
 */
export function getRetryDelay(error: DatabaseError, attempt: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds

    let multiplier = 1;
    switch (error.type) {
        case DatabaseErrorType.RATE_LIMIT_ERROR:
            multiplier = 5; // Longer delay for rate limits
            break;
        case DatabaseErrorType.SERVER_ERROR:
            multiplier = 2;
            break;
        case DatabaseErrorType.NETWORK_ERROR:
            multiplier = 1.5;
            break;
        default:
            multiplier = 1;
    }

    const delay = Math.min(baseDelay * multiplier * Math.pow(2, attempt - 1), maxDelay);
    return delay;
}

/**
 * Validation error helper
 */
export function createValidationError(
    message: string,
    validationErrors: string[],
    context?: Record<string, any>
): DatabaseError {
    return createDatabaseError(
        message,
        DatabaseErrorType.VALIDATION_ERROR,
        400,
        { ...context, validationErrors }
    );
}

/**
 * Not found error helper
 */
export function createNotFoundError(
    resource: string,
    identifier?: string,
    context?: Record<string, any>
): DatabaseError {
    const message = identifier 
        ? `${resource} with identifier '${identifier}' not found`
        : `${resource} not found`;
    
    return createDatabaseError(
        message,
        DatabaseErrorType.NOT_FOUND_ERROR,
        404,
        { ...context, resource, identifier }
    );
}

/**
 * Authentication error helper
 */
export function createAuthenticationError(
    message = 'Authentication required',
    context?: Record<string, any>
): DatabaseError {
    return createDatabaseError(
        message,
        DatabaseErrorType.AUTHENTICATION_ERROR,
        401,
        context
    );
}

/**
 * Authorization error helper
 */
export function createAuthorizationError(
    message = 'Insufficient permissions',
    context?: Record<string, any>
): DatabaseError {
    return createDatabaseError(
        message,
        DatabaseErrorType.AUTHORIZATION_ERROR,
        403,
        context
    );
}

/**
 * Rate limit error helper
 */
export function createRateLimitError(
    message = 'Rate limit exceeded',
    retryAfter?: number,
    context?: Record<string, any>
): DatabaseError {
    return createDatabaseError(
        message,
        DatabaseErrorType.RATE_LIMIT_ERROR,
        429,
        { ...context, retryAfter }
    );
}
