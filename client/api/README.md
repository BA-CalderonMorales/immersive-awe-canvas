# Client API Layer Documentation

## Overview

The Client API Layer provides a clean, consistent interface for all client-side API operations using the `@ba-calderonmorales/clean-api` package. This layer standardizes how the client communicates with external APIs, databases, and internal services.

## Architecture

The client API layer mirrors the server API architecture with these components:

1. **Configuration** (`config.ts`) - API endpoints and client setup
2. **Clients** (`clients/`) - API communication classes
3. **Hooks** (`hooks/`) - React hooks for API integration
4. **Utils** (`utils/`) - Migration helpers and performance utilities

## Getting Started

### Basic Import

```typescript
// Import specific hooks
import { useAPIWorlds, useLatestVersion, useAPILogging } from '@client/api';

// Import specific clients
import { clientVersionAPIClient, clientSupabaseAPIClient } from '@client/api';

// Import migration utilities
import { createAPIMigration } from '@client/api';
```

## React Hooks

### Data Fetching Hooks

#### `useAPIWorlds()`
Replaces the existing `useWorlds` hook with better error handling:

```typescript
import { useAPIWorlds } from '@client/api';

const MyComponent = () => {
    const { data: worlds, isLoading, error } = useAPIWorlds({
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: true
    });

    if (error) {
        console.error('Failed to load worlds:', error);
    }

    return <div>Found {worlds?.length} worlds</div>;
};
```

#### `useAPIBackgrounds()`
Fetch backgrounds with React Query caching:

```typescript
import { useAPIBackgrounds } from '@client/api';

const BackgroundSelector = () => {
    const { data: backgrounds, isLoading } = useAPIBackgrounds();
    
    return (
        <select>
            {backgrounds?.map(bg => (
                <option key={bg.id} value={bg.id}>{bg.name}</option>
            ))}
        </select>
    );
};
```

#### `useLatestVersion()`
Get latest version from GitHub with caching:

```typescript
import { useLatestVersion, useCurrentVersion } from '@client/api';

const VersionChecker = () => {
    const currentVersion = useCurrentVersion();
    const { data: latestVersion, isLoading } = useLatestVersion({
        refetchInterval: 30 * 60 * 1000 // Check every 30 minutes
    });

    const hasUpdate = latestVersion && 
        latestVersion.version !== `v${currentVersion.appVersion}`;

    return (
        <div>
            <p>Current: {currentVersion.fullVersion}</p>
            <p>Latest: {latestVersion?.version}</p>
            {hasUpdate && <button>Update Available!</button>}
        </div>
    );
};
```

### Logging Hooks

#### `useAPILogging()`
Comprehensive logging with automatic error handling:

```typescript
import { useAPILogging } from '@client/api';

const InteractiveComponent = () => {
    const { logUserAction, logError, logSceneInteraction } = useAPILogging();

    const handleClick = async () => {
        try {
            // Your logic here
            await someOperation();
            
            // Log successful user action
            await logUserAction('button_clicked', 'user123', {
                buttonId: 'main-cta',
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            // Automatic error logging
            await logError(error, 'InteractiveComponent', {
                action: 'button_click',
                buttonId: 'main-cta'
            });
        }
    };

    const handleSceneChange = (sceneData: any) => {
        logSceneInteraction('scene_changed', sceneData, {
            previousScene: 'world-1',
            newScene: 'world-2'
        });
    };

    return <button onClick={handleClick}>Interactive Button</button>;
};
```

## Direct API Clients

### Version Client

```typescript
import { clientVersionAPIClient } from '@client/api';

// Get current version (synchronous)
const currentVersion = clientVersionAPIClient.getCurrentVersion();
console.log(currentVersion.fullVersion); // "v1.0.0 (07-31-2025-00:30:56-CDT-dev)"

// Get latest version from GitHub (async)
const { data: latestVersion, error } = await clientVersionAPIClient.getLatestVersion();
if (latestVersion) {
    console.log('Latest version:', latestVersion.version);
}

// Check for updates
const updateInfo = await clientVersionAPIClient.getUpdateInfo();
if (updateInfo.hasUpdate) {
    console.log(`Update available: ${updateInfo.latestVersion}`);
}
```

### Supabase Client

```typescript
import { clientSupabaseAPIClient } from '@client/api';

// Get worlds with error handling
const { data: worlds, error } = await clientSupabaseAPIClient.getWorlds();
if (error) {
    console.error('Failed to fetch worlds:', error.message);
} else {
    console.log('Loaded worlds:', worlds);
}

// Generic query
const { data: featuredItems } = await clientSupabaseAPIClient.query('worlds', {
    filters: { is_featured: true },
    orderBy: 'created_at:desc',
    limit: 10
});
```

### Logging Client

```typescript
import { clientLoggingAPIClient } from '@client/api';

// Log custom event
await clientLoggingAPIClient.logEvent({
    eventType: 'custom_event',
    eventSource: 'my-component',
    metadata: { customData: 'value' }
});

// Log performance metric
await clientLoggingAPIClient.logPerformance('api_call_duration', 150, 'ms', {
    endpoint: '/api/worlds',
    success: true
});
```

## Migration Guide

### Migrating from Old Patterns

The client API layer provides migration utilities to help transition from existing patterns:

```typescript
import { createAPIMigration } from '@client/api';

// Create migration helper
const migration = createAPIMigration();

// Show migration guide in console
migration.showMigrationGuide();

// Use migration helpers for gradual transition
const { data: worlds } = await migration.worlds.fetchWorlds();
const { data: version } = await migration.version.fetchLatestRelease();
await migration.logging.logEvent({
    eventType: 'migration_test',
    eventSource: 'migration-helper'
});
```

### Before and After Examples

#### Old Way (Before Clean API)
```typescript
// Scattered imports and manual error handling
import { useWorlds } from '@/hooks/useWorlds';
import { logEvent } from '@/lib/logger';
import { fetchLatestRelease } from '@utils/github-api';

const OldComponent = () => {
    const { data: worlds, isLoading } = useWorlds();
    
    useEffect(() => {
        // Manual API calls with inconsistent error handling
        fetchLatestRelease().then(version => {
            console.log(version);
        }).catch(error => {
            console.error('Version fetch failed:', error);
        });
        
        // Manual logging
        logEvent({
            eventType: 'component_mounted',
            eventSource: 'OldComponent'
        });
    }, []);
    
    return <div>{worlds?.length} worlds</div>;
};
```

#### New Way (With Clean API)
```typescript
// Centralized imports with consistent patterns
import { useAPIWorlds, useLatestVersion, useAPILogging } from '@client/api';

const NewComponent = () => {
    const { data: worlds, isLoading, error } = useAPIWorlds();
    const { data: version } = useLatestVersion();
    const { logUserAction, logError } = useAPILogging();
    
    // Automatic error handling
    useEffect(() => {
        if (error) {
            logError(error, 'NewComponent', { section: 'worlds' });
        }
    }, [error, logError]);
    
    // Enhanced logging
    useEffect(() => {
        logUserAction('component_mounted', undefined, {
            component: 'NewComponent',
            worldsCount: worlds?.length,
            latestVersion: version?.version
        });
    }, [worlds, version, logUserAction]);
    
    return <div>{worlds?.length} worlds (Latest: {version?.version})</div>;
};
```

## Performance Monitoring

The client API includes built-in performance monitoring:

```typescript
import { withPerformanceMonitoring, createTimer, PerformanceTimer } from '@client/api';

// Wrap functions with performance monitoring
const monitoredFunction = withPerformanceMonitoring(
    async () => {
        // Your async operation
        await someExpensiveOperation();
    },
    'expensive-operation'
);

// Manual timing
const timer = createTimer('manual-operation');
await someOperation();
await timer.logPerformance({ success: true });

// Component render monitoring
const ComponentWithMonitoring = () => {
    const renderTimer = measureComponentRender('ComponentWithMonitoring');
    
    useEffect(() => {
        renderTimer.log({ propsCount: Object.keys(props).length });
    }, []);
    
    return <div>Monitored component</div>;
};
```

## Error Handling Patterns

The client API provides consistent error handling across all operations:

```typescript
import { useErrorLogging } from '@client/api';

const ComponentWithErrorHandling = () => {
    const { logError } = useErrorLogging();
    
    const handleOperation = async () => {
        try {
            await riskyOperation();
        } catch (error) {
            // Automatically logs error with context
            logError(error, 'ComponentWithErrorHandling', {
                operation: 'riskyOperation',
                timestamp: new Date().toISOString()
            });
            
            // Handle error in UI
            setErrorState(error.message);
        }
    };
    
    return <button onClick={handleOperation}>Safe Operation</button>;
};
```

## Configuration

The client API can be configured through environment variables and config files:

```typescript
// Development vs Production endpoints
const isDev = process.env.NODE_ENV === 'development';
const serverBaseUrl = isDev ? 'http://localhost:3001' : 'https://api.yourapp.com';

// Custom client configuration
import { ClientAPIClient } from '@client/api';

const customClient = new ClientAPIClient(
    'https://custom-api.com', 
    { 'Authorization': 'Bearer token' },
    3 // retry count
);
```

## Testing

The client API layer includes utilities for testing:

```typescript
// Test function available in browser
if (typeof window !== 'undefined') {
    window.testClientAPI(); // Runs comprehensive API tests
}

// Mock clients for unit tests
const mockVersionClient = {
    getCurrentVersion: () => ({ appVersion: '1.0.0' }),
    getLatestVersion: () => Promise.resolve({ data: mockVersionData })
};
```

## Best Practices

1. **Use React Hooks** for data fetching instead of direct client calls in components
2. **Handle Errors Consistently** using the provided error logging utilities
3. **Monitor Performance** for expensive operations using the performance utilities
4. **Migrate Gradually** using the migration helpers to transition from old patterns
5. **Cache Appropriately** by configuring `staleTime` and `refetchInterval` in hooks
6. **Log User Actions** to track application usage and debug issues
7. **Type Safety** - All API methods return properly typed results with `APIResult<T>`

This client API layer provides a foundation for scalable, maintainable client-side API management while maintaining consistency with the server-side architecture.
