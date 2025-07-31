# Server API Reference

## Controllers

### VersionController

Handles version-related operations and GitHub integration.

#### Methods

##### `getVersion()`
Returns current application version information.

**Returns:**
```typescript
{
    success: true,
    data: {
        appVersion: string,      // "1.0.0"
        buildInfo: string,       // "07-31-2025-00:30:56-CDT-dev"
        fullVersion: string      // "v1.0.0 (07-31-2025-00:30:56-CDT-dev)"
    }
}
```

##### `getDynamicVersion()`
Fetches latest version information from GitHub.

**Returns:**
```typescript
{
    success: true,
    data: {
        version: string,         // "v4.0.2"
        name: string,           // "Release name"
        publishedAt: string,    // "Jul 30, 2025"
        url: string,            // GitHub release URL
        description: string,    // Release notes
        isLatest: boolean       // true
    }
}
```

##### `getReleases(limit?: number)`
Fetches multiple releases from GitHub.

**Parameters:**
- `limit` (optional): Number of releases to fetch (default: 10)

**Returns:**
```typescript
{
    success: true,
    data: VersionInfo[]
}
```

##### `checkLatestVersion()`
Checks if current version matches latest GitHub release.

**Returns:**
```typescript
{
    success: true,
    data: {
        isLatest: boolean,
        currentVersion: string
    }
}
```

##### `clearCache()`
Clears version information cache.

**Returns:**
```typescript
{
    success: true,
    message: "Version cache cleared"
}
```

---

### LoggingController

Handles application logging and event tracking.

#### Methods

##### `logEvent(params: LogEventParams)`
Logs an application event.

**Parameters:**
```typescript
interface LogEventParams {
    eventType: string;           // Required: Type of event
    eventSource?: string;        // Optional: Source of event
    metadata?: Record<string, unknown>; // Optional: Additional data
}
```

**Returns:**
```typescript
{
    success: true,
    data: LogEntry,
    message: "Event logged successfully"
}
```

##### `queryLogs(params?: LogQueryParams)`
Queries logs with optional filtering.

**Parameters:**
```typescript
interface LogQueryParams {
    eventType?: string;
    eventSource?: string;
    limit?: number;             // Default: 100
    offset?: number;            // Default: 0
    startDate?: Date;
    endDate?: Date;
}
```

**Returns:**
```typescript
{
    success: true,
    data: LogEntry[]
}
```

##### `getLogsByEventType(eventType: string, limit?: number)`
Gets logs filtered by event type.

**Parameters:**
- `eventType`: The event type to filter by
- `limit` (optional): Number of logs to return (default: 50)

##### `getLogsByEventSource(eventSource: string, limit?: number)`
Gets logs filtered by event source.

**Parameters:**
- `eventSource`: The event source to filter by  
- `limit` (optional): Number of logs to return (default: 50)

##### `getRecentLogs(limit?: number)`
Gets most recent logs.

**Parameters:**
- `limit` (optional): Number of logs to return (default: 100)

---

## Services

### VersionService

Business logic for version management.

#### Methods

##### `getAppVersion(): string`
Returns the current application version.

##### `getBuildInfo(): string`
Returns build information including timestamp and commit hash.

##### `getFullVersion(): string`
Returns formatted full version string.

##### `getDynamicVersionInfo(): Promise<VersionInfo>`
Gets latest version from GitHub with caching.

##### `getAllReleases(limit?: number): APIResult<VersionInfo[]>`
Gets all releases from GitHub.

##### `clearVersionCache(): void`
Clears the version information cache.

##### `isCurrentVersionLatest(): Promise<boolean>`
Checks if current version matches latest GitHub release.

---

### LoggingService

Business logic for application logging.

#### Methods

##### `logEvent(params: LogEventParams): APIResult<any>`
Logs an event with automatic sanitization.

##### `queryLogs(params?: LogQueryParams): APIResult<any[]>`
Queries logs with filtering options.

##### `logApplicationStartup(metadata?: Record<string, unknown>): APIResult<any>`
Logs application startup event.

##### `logUserAction(action: string, userId?: string, metadata?: Record<string, unknown>): APIResult<any>`
Logs user action event.

##### `logError(error: Error | string, source?: string, metadata?: Record<string, unknown>): APIResult<any>`
Logs error event.

##### `logPerformance(metric: string, value: number, unit?: string, metadata?: Record<string, unknown>): APIResult<any>`
Logs performance metric.

---

## API Clients

### GitHubAPIClient

Handles GitHub API communication.

#### Methods

##### `getLatestRelease(): APIResult<VersionInfo>`
Fetches latest release from GitHub.

##### `getReleases(limit?: number): APIResult<VersionInfo[]>`
Fetches multiple releases from GitHub.

---

### SupabaseAPIClient

Handles Supabase database communication.

#### Methods

##### `insertLog(logData: LogInsertData): APIResult<LogEntry>`
Inserts a log entry into the database.

##### `getLogs(params?: LogQueryParams): APIResult<LogEntry[]>`
Queries logs from the database.

##### `query<T>(table: string, params?: QueryParams): APIResult<T[]>`
Generic query method for any Supabase table.

##### `insert<T>(table: string, data: any): APIResult<T>`
Generic insert method for any Supabase table.

##### `update<T>(table: string, data: any, filters: Record<string, string>): APIResult<T[]>`
Generic update method for any Supabase table.

---

## Types and Interfaces

### VersionInfo
```typescript
interface VersionInfo {
    version: string;            // "v4.0.2"
    name: string;              // Release name
    publishedAt: string;       // Formatted date
    url: string;               // GitHub URL
    description: string;       // Release notes
    isLatest: boolean;         // Is this the latest version
}
```

### LogEventParams
```typescript
interface LogEventParams {
    eventType: string;                      // Required event type
    eventSource?: string;                   // Optional event source
    metadata?: Record<string, unknown>;     // Optional metadata
}
```

### LogQueryParams
```typescript
interface LogQueryParams {
    eventType?: string;         // Filter by event type
    eventSource?: string;       // Filter by event source
    limit?: number;             // Limit results
    offset?: number;            // Offset for pagination
    startDate?: Date;           // Filter by start date
    endDate?: Date;             // Filter by end date
}
```

### APIResult<T>
```typescript
type APIResult<T> = Promise<{ data?: T; error?: Error }>;
```

---

## Usage Examples

### Getting Version Information
```typescript
import { versionController } from '@server/api';

// Get current version
const current = await versionController.getVersion();

// Get latest from GitHub  
const latest = await versionController.getDynamicVersion();

// Check for updates
const updateCheck = await versionController.checkLatestVersion();
```

### Logging Events
```typescript
import { loggingController } from '@server/api';

// Log a user action
await loggingController.logEvent({
    eventType: 'user_action',
    eventSource: 'client',
    metadata: {
        action: 'scene_created',
        userId: 'user123',
        timestamp: new Date().toISOString()
    }
});

// Query recent logs
const recentLogs = await loggingController.getRecentLogs(50);
```

### Direct Service Usage
```typescript
import { versionService, loggingService } from '@server/api';

// Use services directly for business logic
const isLatest = await versionService.isCurrentVersionLatest();

await loggingService.logError(
    new Error('Something went wrong'),
    'payment_service',
    { userId: 'user123', amount: 100 }
);
```
