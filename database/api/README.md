# Database API Layer - Clean API Integration

This module integrates the structure and principles from [`ba-calderonmorales/clean-api`](https://github.com/ba-calderonmorales/clean-api) with your database operations, providing a clean, maintainable, and scalable API layer for database-related functionality.

## 🏗️ Architecture Overview

The database API layer follows Clean API principles:

```
database/
├── api/                           # Clean API integration layer
│   ├── index.ts                  # Main exports
│   ├── config.ts                 # API configuration and clients
│   ├── clients/                  # API client implementations
│   │   ├── edge-function-client.ts      # Supabase Edge Functions
│   │   ├── supabase-rest-client.ts      # Direct Supabase REST API
│   │   ├── logging-client.ts            # Database logging operations
│   │   └── github-integration-client.ts # GitHub API integration
│   ├── utils/                    # Utility functions
│   │   ├── api-helpers.ts        # Common API helpers
│   │   ├── validation.ts         # Input validation
│   │   └── error-handling.ts     # Error management
│   └── examples/                 # Usage examples
├── shared/                       # Shared utilities
└── supabase/                    # Supabase-specific code
```

## 🚀 Key Features

### Clean API Architecture
- **API Buckets**: Organized endpoints by functionality (`edge-functions`, `supabase-rest`, `github`)
- **Configuration Management**: Centralized API configuration with `APIBase`
- **Swappable Clients**: Easy to test and customize with `APIClient` interface
- **Type Safety**: Full TypeScript support with comprehensive interfaces

### Enhanced Error Handling
- **Structured Errors**: Consistent error types and handling
- **Automatic Logging**: All errors are logged to the database
- **Retry Mechanisms**: Built-in retry logic with exponential backoff
- **Validation**: Input validation for all API operations

### Security & Reliability
- **Input Sanitization**: All inputs are sanitized before processing
- **Rate Limiting**: Built-in rate limiting for API calls
- **Security Headers**: Proper security headers for all responses
- **Authentication**: Integrated with Supabase authentication

## 📋 Quick Start

### Installation

The database API layer uses the existing `@ba-calderonmorales/clean-api` package:

```bash
npm install @ba-calderonmorales/clean-api
```

### Basic Usage

```typescript
import {
    supabaseEdgeFunctionClient,
    supabaseRestClient,
    databaseLoggingClient,
    githubIntegrationClient
} from './database/api/index.js';

// Create a GitHub issue via Edge Function
const issueData = {
    issueLocation: 'Scene Component',
    device: ['Desktop Chrome'],
    inUS: 'yes',
    frequency: 'sometimes',
    expectedBehavior: 'Scene should load smoothly',
    canContact: 'no'
};

const result = await supabaseEdgeFunctionClient.createGithubIssue(issueData, '1.0.0');

// Log an event to the database
await databaseLoggingClient.logInfo('User completed tutorial', { 
    userId: 'user123', 
    duration: 300 
});

// Get logs with filtering
const logs = await supabaseRestClient.getLogs({ 
    event_type: 'user_action' 
});
```

## 🎯 Core Components

### 1. Edge Function Client

Interact with Supabase Edge Functions:

```typescript
import { supabaseEdgeFunctionClient } from './database/api/index.js';

// Create GitHub issue
await supabaseEdgeFunctionClient.createGithubIssue(issueData, appVersion);

// Process logs
await supabaseEdgeFunctionClient.processLogs(logData);

// Validate user
await supabaseEdgeFunctionClient.validateUser(userData);
```

### 2. Supabase REST Client

Direct Supabase database operations:

```typescript
import { supabaseRestClient } from './database/api/index.js';

// Create log entry
const log = await supabaseRestClient.createLog({
    event_type: 'user_action',
    event_source: 'client',
    metadata: { action: 'click', element: 'button' }
});

// Get logs with filtering
const logs = await supabaseRestClient.getLogs({ 
    event_type: 'error' 
});

// Analytics data
const analytics = await supabaseRestClient.getAnalytics({
    date: '2025-01-01'
});
```

### 3. Database Logging Client

Centralized logging with automatic database persistence:

```typescript
import { databaseLoggingClient } from './database/api/index.js';

// Different log levels
await databaseLoggingClient.logError('Something went wrong', { 
    userId: 'user123', 
    error: 'Connection timeout' 
});

await databaseLoggingClient.logWarning('Performance issue detected', { 
    loadTime: 5000 
});

await databaseLoggingClient.logInfo('User logged in', { 
    userId: 'user123' 
});

await databaseLoggingClient.logDebug('Debug info', { 
    state: currentState 
});

// API call logging
await databaseLoggingClient.logApiCall(
    'POST', 
    '/api/users', 
    requestData, 
    responseData, 
    duration, 
    success
);
```

### 4. GitHub Integration Client

Direct GitHub API operations:

```typescript
import { githubIntegrationClient } from './database/api/index.js';

// Create GitHub issue
const issue = await githubIntegrationClient.createIssue({
    title: 'Bug Report',
    body: 'Description of the bug...',
    labels: ['bug', 'high-priority']
});

// Get issues
const issues = await githubIntegrationClient.getIssues({
    state: 'open',
    labels: 'bug'
});

// Create standardized bug report
const bugReport = await githubIntegrationClient.createBugReport({
    title: 'Scene Loading Issue',
    location: 'Experience Component',
    expectedBehavior: 'Scene loads in under 2 seconds',
    device: ['Desktop Chrome'],
    frequency: 'always'
});
```

## 🛠️ Validation & Error Handling

### Input Validation

```typescript
import { 
    validateIssueData, 
    validateLogEntry, 
    validateGitHubIssueData 
} from './database/api/index.js';

// Validate issue data
const validation = validateIssueData(issueData);
if (!validation.isValid) {
    console.error('Validation errors:', validation.errors);
    return;
}
```

### Error Handling

```typescript
import { 
    withErrorHandling, 
    DatabaseErrorType, 
    type DatabaseError 
} from './database/api/index.js';

try {
    const result = await withErrorHandling(
        () => someApiOperation(),
        'operation-name',
        { userId: 'user123' }
    );
} catch (error) {
    const dbError = error as DatabaseError;
    
    switch (dbError.type) {
        case DatabaseErrorType.VALIDATION_ERROR:
            // Handle validation error
            break;
        case DatabaseErrorType.NETWORK_ERROR:
            // Handle network error
            break;
        default:
            // Handle other errors
    }
}
```

### Retry Mechanisms

```typescript
import { withRetry } from './database/api/index.js';

const result = await withRetry(
    () => unstableApiCall(),
    { 
        maxAttempts: 3, 
        delay: 1000, 
        backoffFactor: 2 
    }
);
```

## 🔧 Configuration

### Environment Variables

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# GitHub Integration
GITHUB_REPO=your-username/your-repo
GITHUB_ACCESS_TOKEN=your-github-token
```

### Custom Configuration

```typescript
import { 
    supabaseEdgeFunctionAPI, 
    supabaseRestAPI, 
    githubIntegrationAPI 
} from './database/api/config.js';

// Add custom routes
supabaseEdgeFunctionAPI.addRoute('customFunction', '/custom-function');

// Set custom configuration
supabaseRestAPI.setConfig('timeout', 10000);

// Custom headers
githubIntegrationAPI.setConfig('headers', {
    ...githubIntegrationAPI.config.headers,
    'X-Custom-Header': 'value'
});
```

## 📊 Logging & Analytics

### Automatic API Logging

```typescript
import { logApiOperation } from './database/api/index.js';

// Automatically log API operations with timing
const result = await logApiOperation(
    'user-authentication',
    () => authenticateUser(credentials),
    { method: 'login', userId: 'user123' }
);
```

### Bulk Operations

```typescript
// Example: Process multiple log entries
const operations = [
    { type: 'user_login', data: loginData },
    { type: 'scene_load', data: sceneData },
    { type: 'interaction', data: interactionData }
];

for (const operation of operations) {
    try {
        await supabaseRestClient.createLog({
            event_type: operation.type,
            event_source: 'bulk-processor',
            metadata: operation.data
        });
    } catch (error) {
        await databaseLoggingClient.logError(
            `Bulk operation failed: ${operation.type}`,
            { error: error.message }
        );
    }
}
```

## 🧪 Testing

The integrated system supports easy testing with mocks:

```typescript
// Test setup
const mockClient = {
    request: jest.fn()
};

// Mock successful response
mockClient.request.mockResolvedValue({
    message: 'Success',
    data: testData
});

// Test your functions
const result = await yourFunction();
expect(result).toEqual(expectedResult);
```

## 📈 Performance & Monitoring

### Built-in Performance Monitoring

All API calls are automatically monitored for:
- **Response Time**: How long each API call takes
- **Success Rate**: Percentage of successful vs failed calls
- **Error Types**: Categorization of different error types
- **Retry Attempts**: How often retries are needed

### Metrics Collection

```typescript
// Metrics are automatically logged to the database
// Query them like this:
const performanceMetrics = await supabaseRestClient.getLogs({
    event_source: 'api-client',
    event_type: 'info'
});

// Analyze API performance
const apiCalls = performanceMetrics.filter(log => 
    log.metadata?.duration && log.metadata?.success !== undefined
);
```

## 🤝 Integration with Existing Code

### Client API Integration

Your existing client API can seamlessly use the database API:

```typescript
// client/api/clients/database-client.ts
import { 
    supabaseEdgeFunctionClient,
    databaseLoggingClient 
} from '../../../database/api/index.js';

export class ClientDatabaseAPI {
    async reportIssue(issueData: IssueData) {
        try {
            const result = await supabaseEdgeFunctionClient.createGithubIssue(
                issueData, 
                process.env.APP_VERSION
            );
            
            await databaseLoggingClient.logInfo('Issue reported successfully', {
                issueUrl: result.data?.issue?.html_url
            });
            
            return result;
        } catch (error) {
            await databaseLoggingClient.logError('Failed to report issue', {
                error: error.message,
                issueData: issueData.issueLocation
            });
            throw error;
        }
    }
}
```

### Server Integration

Your server can use the same API layer:

```typescript
// server/api/database.ts
import { 
    supabaseRestClient,
    databaseLoggingClient,
    withErrorHandling 
} from '../../database/api/index.js';

export async function getServerLogs(filters: any) {
    return withErrorHandling(
        () => supabaseRestClient.getLogs(filters),
        'get-server-logs',
        { source: 'server', filters }
    );
}
```

## 📚 Examples

See the `database/api/examples/` directory for comprehensive usage examples including:

- **usage-examples.ts**: Practical examples for all major operations
- **enhanced-github-issue-edge-function.ts**: Enhanced edge function implementation

## 🔮 Future Enhancements

The integrated structure enables easy extension:

1. **Additional API Clients**: Add new clients for other services
2. **Advanced Caching**: Implement caching layers using the same patterns
3. **Real-time Features**: Add WebSocket support using clean-api structure
4. **Analytics Dashboard**: Build analytics using the logged data
5. **Performance Optimization**: Add request batching and connection pooling

## 🚨 Migration Guide

To migrate existing code to use the integrated system:

1. **Replace direct API calls** with the corresponding client methods
2. **Add validation** using the provided validation functions
3. **Wrap operations** with error handling utilities
4. **Update imports** to use the centralized database API exports

### Before:
```typescript
const response = await fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify(logData)
});
```

### After:
```typescript
import { supabaseRestClient } from './database/api/index.js';

const log = await supabaseRestClient.createLog(logData);
```

This integration provides a robust, scalable, and maintainable foundation for all your database API operations while maintaining consistency with clean-api principles.
