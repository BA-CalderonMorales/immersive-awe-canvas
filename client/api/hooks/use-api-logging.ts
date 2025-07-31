/**
 * Logging API React Hook
 * 
 * React hook for logging operations using Clean API architecture
 */

import { useCallback } from 'react';
import { clientLoggingAPIClient, type LogEventParams } from '../clients/logging-client';

/**
 * Hook for logging operations
 */
export const useAPILogging = () => {
    const logEvent = useCallback(async (params: LogEventParams) => {
        return await clientLoggingAPIClient.logEvent(params);
    }, []);

    const logUserAction = useCallback(async (
        action: string,
        userId?: string,
        metadata?: Record<string, unknown>
    ) => {
        return await clientLoggingAPIClient.logUserAction(action, userId, metadata);
    }, []);

    const logError = useCallback(async (
        error: Error | string,
        source?: string,
        metadata?: Record<string, unknown>
    ) => {
        const errorObj = typeof error === 'string' ? new Error(error) : error;
        return await clientLoggingAPIClient.logError(errorObj, source, metadata);
    }, []);

    const logPerformance = useCallback(async (
        metric: string,
        value: number,
        unit: string = 'ms',
        metadata?: Record<string, unknown>
    ) => {
        return await clientLoggingAPIClient.logPerformance(metric, value, unit, metadata);
    }, []);

    const logPageView = useCallback(async (
        page: string,
        metadata?: Record<string, unknown>
    ) => {
        return await clientLoggingAPIClient.logPageView(page, metadata);
    }, []);

    const logSceneInteraction = useCallback(async (
        interactionType: string,
        sceneData?: Record<string, unknown>,
        metadata?: Record<string, unknown>
    ) => {
        return await clientLoggingAPIClient.logSceneInteraction(interactionType, sceneData, metadata);
    }, []);

    return {
        logEvent,
        logUserAction,
        logError,
        logPerformance,
        logPageView,
        logSceneInteraction,
    };
};

/**
 * Hook specifically for error logging with automatic error handling
 */
export const useErrorLogging = () => {
    const { logError } = useAPILogging();

    const logErrorSafe = useCallback((
        error: Error | string,
        source?: string,
        metadata?: Record<string, unknown>
    ) => {
        logError(error, source, metadata).catch(loggingError => {
            // Fallback to console if logging fails
            console.error('Failed to log error:', loggingError);
            console.error('Original error:', error);
        });
    }, [logError]);

    return { logError: logErrorSafe };
};
