/**
 * Logging API Client for Client-side
 * 
 * Client-side logging client (Minimal Implementation)
 */

import type { APIResult } from '@ba-calderonmorales/clean-api';

export interface LogEventParams {
    eventType: string;
    eventSource?: string;
    metadata?: Record<string, unknown>;
}

/**
 * Client-side Logging API Client (Minimal Implementation)
 */
export class ClientLoggingAPIClient {
    /**
     * Log an event
     */
    async logEvent(params: LogEventParams): APIResult<any> {
        try {
            // Simple console logging for now
            console.log('📱 Client Log:', {
                type: params.eventType,
                source: params.eventSource || 'client',
                metadata: params.metadata,
                timestamp: new Date().toISOString()
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
            eventType: 'user_action',
            eventSource: 'client',
            metadata: {
                action,
                userId,
                timestamp: new Date().toISOString(),
                ...metadata
            }
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
            eventType: 'error',
            eventSource: source || 'client',
            metadata: {
                message: error.message,
                stack: error.stack,
                name: error.name,
                timestamp: new Date().toISOString(),
                ...metadata
            }
        });
    }

    /**
     * Log performance metric
     */
    async logPerformance(
        metric: string,
        value: number,
        unit: string,
        metadata?: Record<string, unknown>
    ): APIResult<any> {
        return this.logEvent({
            eventType: 'performance',
            eventSource: 'client',
            metadata: {
                metric,
                value,
                unit,
                timestamp: new Date().toISOString(),
                ...metadata
            }
        });
    }

    /**
     * Log page view
     */
    async logPageView(
        page: string,
        metadata?: Record<string, unknown>
    ): APIResult<any> {
        return this.logEvent({
            eventType: 'page_view',
            eventSource: 'client',
            metadata: {
                page,
                timestamp: new Date().toISOString(),
                ...metadata
            }
        });
    }

    /**
     * Log scene interaction
     */
    async logSceneInteraction(
        interactionType: string,
        sceneData?: any,
        metadata?: Record<string, unknown>
    ): APIResult<any> {
        return this.logEvent({
            eventType: 'scene_interaction',
            eventSource: 'client',
            metadata: {
                interactionType,
                sceneData,
                timestamp: new Date().toISOString(),
                ...metadata
            }
        });
    }
}

// Export singleton instance
export const clientLoggingAPIClient = new ClientLoggingAPIClient();
