/**
 * Performance Utilities
 *
 * Performance monitoring and optimization utilities for the client API layer
 */

import { clientLoggingAPIClient } from "../clients/logging-client";

/**
 * Performance timer utility
 */
export class PerformanceTimer {
    private startTime: number;
    private endTime?: number;
    private label: string;

    constructor(label: string) {
        this.label = label;
        this.startTime = performance.now();
    }

    end(): number {
        this.endTime = performance.now();
        return this.getDuration();
    }

    getDuration(): number {
        const endTime = this.endTime || performance.now();
        return endTime - this.startTime;
    }

    async logPerformance(metadata?: Record<string, unknown>) {
        const duration = this.end();
        await clientLoggingAPIClient.logPerformance(
            this.label,
            duration,
            "ms",
            metadata
        );
        return duration;
    }
}

/**
 * Create a performance timer
 */
export const createTimer = (label: string) => new PerformanceTimer(label);

/**
 * Higher-order function to measure API call performance
 */
export const withPerformanceMonitoring = <
    T extends (...args: any[]) => Promise<any>,
>(
    fn: T,
    label: string
): T => {
    return (async (...args: any[]) => {
        const timer = createTimer(label);
        try {
            const result = await fn(...args);
            await timer.logPerformance({ success: true });
            return result;
        } catch (error) {
            await timer.logPerformance({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw error;
        }
    }) as T;
};

/**
 * API call performance monitoring decorator
 */
export const monitorAPICall = (label: string) => {
    return function <T extends (...args: any[]) => Promise<any>>(
        target: any,
        propertyKey: string,
        descriptor: TypedPropertyDescriptor<T>
    ) {
        const originalMethod = descriptor.value!;

        descriptor.value = withPerformanceMonitoring(
            originalMethod,
            `${label}:${propertyKey}`
        ) as T;

        return descriptor;
    };
};

/**
 * Batch performance logging
 */
export class PerformanceBatch {
    private metrics: Array<{
        label: string;
        duration: number;
        metadata?: Record<string, unknown>;
    }> = [];

    add(label: string, duration: number, metadata?: Record<string, unknown>) {
        this.metrics.push({ label, duration, metadata });
    }

    async flush() {
        const promises = this.metrics.map(metric =>
            clientLoggingAPIClient.logPerformance(
                metric.label,
                metric.duration,
                "ms",
                metric.metadata
            )
        );

        await Promise.allSettled(promises);
        this.metrics = [];
    }

    clear() {
        this.metrics = [];
    }
}

/**
 * Global performance batch instance
 */
export const performanceBatch = new PerformanceBatch();

/**
 * Utility to measure React component render performance
 */
export const measureComponentRender = (componentName: string) => {
    const timer = createTimer(`component-render:${componentName}`);

    return {
        end: () => timer.end(),
        log: (metadata?: Record<string, unknown>) =>
            timer.logPerformance({ component: componentName, ...metadata }),
    };
};
