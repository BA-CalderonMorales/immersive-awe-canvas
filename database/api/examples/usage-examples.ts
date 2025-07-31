/**
 * Database API Integration Example
 * 
 * This example demonstrates how to use the integrated clean-api structure
 * with your database module for common operations.
 */

import {
    // Core API classes
    supabaseEdgeFunctionClient,
    supabaseRestClient,
    databaseLoggingClient,
    githubIntegrationClient,

    // Types and interfaces
    type IssueData,
    type LogEntry,
    type GitHubIssue,

    // Validation utilities
    validateIssueData,
    validateLogEntry,
    validateGitHubIssueData,

    // Error handling
    withErrorHandling,
    DatabaseErrorType,
    type DatabaseError,

    // API helpers
    withRetry,
    sanitizeInputData,
    logApiOperation
} from '../index.js';

/**
 * Example: Create a GitHub issue using the integrated API
 */
export async function createGitHubIssueExample() {
    try {
        // Example issue data
        const issueData: IssueData = {
            issueLocation: 'Experience Scene Component',
            device: ['Desktop Chrome', 'Mobile Safari'],
            inUS: 'yes',
            frequency: 'sometimes',
            expectedBehavior: 'The 3D scene should load smoothly without flickering',
            workaround: 'Refreshing the page sometimes fixes it',
            canContact: 'yes',
            email: 'user@example.com'
        };

        // Validate the issue data
        const validation = validateIssueData(issueData);
        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // Sanitize the input data
        const sanitizedData = sanitizeInputData(issueData);

        // Log the operation and create the issue
        const result = await logApiOperation(
            'create-github-issue',
            () => supabaseEdgeFunctionClient.createGithubIssue(sanitizedData, '1.0.0'),
            { issueLocation: sanitizedData.issueLocation }
        );

        if (result.error) {
            throw new Error(`Failed to create GitHub issue: ${result.error}`);
        }

        console.log('GitHub issue created successfully:', result);
        return result;

    } catch (error) {
        console.error('Error creating GitHub issue:', error);
        throw error;
    }
}

/**
 * Example: Log an event to the database
 */
export async function logEventExample() {
    try {
        // Create a log entry
        const logEntry: Omit<LogEntry, 'id' | 'created_at'> = {
            event_type: 'user_action',
            event_source: 'immersive-experience',
            metadata: {
                action: 'scene_interaction',
                sceneId: 'forest-scene-001',
                duration: 1500,
                successful: true
            }
        };

        // Validate the log entry
        const validation = validateLogEntry(logEntry);
        if (!validation.isValid) {
            throw new Error(`Log validation failed: ${validation.errors.join(', ')}`);
        }

        // Create the log with error handling
        const result = await withErrorHandling(
            () => supabaseRestClient.createLog(logEntry),
            'create-log-entry',
            { eventType: logEntry.event_type }
        );

        console.log('Log entry created:', result);
        return result;

    } catch (error) {
        console.error('Error logging event:', error);
        throw error;
    }
}

/**
 * Example: Get logs with filtering
 */
export async function getLogsExample() {
    try {
        // Get logs with filters using retry mechanism
        const logs = await withRetry(
            () => supabaseRestClient.getLogs({
                event_type: 'user_action',
                event_source: 'immersive-experience'
            }),
            { maxAttempts: 3, delay: 1000, backoffFactor: 2 }
        );

        console.log(`Retrieved ${logs.length} log entries`);
        return logs;

    } catch (error) {
        console.error('Error retrieving logs:', error);
        throw error;
    }
}

/**
 * Example: Create a direct GitHub issue (not via edge function)
 */
export async function createDirectGitHubIssueExample() {
    try {
        const issueData = {
            title: 'Feature Request: Enhanced Scene Navigation',
            body: `## Feature Request

**Description:**
Add keyboard shortcuts for scene navigation to improve user experience.

**Use Case:**
Users frequently need to navigate between different scenes quickly, and mouse-only navigation can be slow.

**Proposed Solution:**
- Arrow keys for basic navigation
- Number keys for quick scene selection
- ESC key to return to main menu

**Priority:** Medium`,
            labels: ['feature-request', 'priority-medium']
        };

        // Validate GitHub issue data
        const validation = validateGitHubIssueData(issueData);
        if (!validation.isValid) {
            throw new Error(`GitHub issue validation failed: ${validation.errors.join(', ')}`);
        }

        // Create the issue with comprehensive error handling
        const issue = await withErrorHandling(
            () => githubIntegrationClient.createIssue(issueData),
            'create-direct-github-issue',
            { title: issueData.title }
        );

        console.log('Direct GitHub issue created:', issue);
        return issue;

    } catch (error) {
        console.error('Error creating direct GitHub issue:', error);
        throw error;
    }
}

/**
 * Example: Comprehensive error handling
 */
export async function errorHandlingExample() {
    try {
        // Simulate an operation that might fail
        await withErrorHandling(
            async () => {
                // This will throw an error to demonstrate error handling
                throw new Error('Simulated API failure');
            },
            'simulated-operation',
            { purpose: 'demonstration' }
        );

    } catch (error) {
        const dbError = error as DatabaseError;
        
        console.log('Caught database error:');
        console.log('- Type:', dbError.type);
        console.log('- Status:', dbError.status);
        console.log('- Message:', dbError.message);
        console.log('- Context:', dbError.context);

        // The error is automatically logged to the database by withErrorHandling
        
        // Handle different error types
        switch (dbError.type) {
            case DatabaseErrorType.NETWORK_ERROR:
                console.log('Handling network error - maybe retry later');
                break;
            case DatabaseErrorType.VALIDATION_ERROR:
                console.log('Handling validation error - fix input data');
                break;
            default:
                console.log('Handling unknown error - log and alert admin');
        }
    }
}

/**
 * Example: Bulk operations with logging
 */
export async function bulkOperationsExample() {
    try {
        const operations = [
            { type: 'user_login', source: 'auth-system' },
            { type: 'scene_load', source: 'experience-engine' },
            { type: 'interaction', source: 'user-interface' }
        ];

        const results = [];

        for (const operation of operations) {
            try {
                const logEntry = {
                    event_type: operation.type,
                    event_source: operation.source,
                    metadata: {
                        timestamp: new Date().toISOString(),
                        batch: true
                    }
                };

                const result = await supabaseRestClient.createLog(logEntry);
                results.push({ success: true, data: result });

                // Log successful operation
                await databaseLoggingClient.logInfo(
                    `Bulk operation completed: ${operation.type}`,
                    { source: operation.source }
                );

            } catch (error) {
                results.push({ 
                    success: false, 
                    error: error instanceof Error ? error.message : 'Unknown error',
                    operation: operation.type
                });

                // Log failed operation
                await databaseLoggingClient.logError(
                    `Bulk operation failed: ${operation.type}`,
                    { 
                        source: operation.source,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    }
                );
            }
        }

        console.log('Bulk operations completed:', {
            total: operations.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
        });

        return results;

    } catch (error) {
        console.error('Error in bulk operations:', error);
        throw error;
    }
}

/**
 * Example: Real-time logging for user interactions
 */
export async function realTimeLoggingExample(userAction: string, sceneId: string, duration: number) {
    // This function would be called from your UI components
    try {
        await databaseLoggingClient.logInfo(
            `User interaction: ${userAction}`,
            {
                sceneId,
                duration,
                timestamp: new Date().toISOString(),
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
            },
            'client-interaction'
        );
    } catch (error) {
        // Don't let logging errors break the user experience
        console.warn('Failed to log user interaction:', error);
    }
}

// Export all examples for easy testing
export const examples = {
    createGitHubIssue: createGitHubIssueExample,
    logEvent: logEventExample,
    getLogs: getLogsExample,
    createDirectGitHubIssue: createDirectGitHubIssueExample,
    errorHandling: errorHandlingExample,
    bulkOperations: bulkOperationsExample,
    realTimeLogging: realTimeLoggingExample
};
