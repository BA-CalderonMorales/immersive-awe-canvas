# Server API Module

## Overview

The Server API module implements a clean, layered architecture for backend operations using the `@ba-calderonmorales/clean-api` package. This architecture provides clear separation of concerns, type safety, and maintainable code structure.

## Architecture Layers

### 1. Controllers Layer (`/server/api/controllers/`)

Controllers handle HTTP request/response cycles and input validation.

**Key Classes:**
- `VersionController`: Manages version-related endpoints
- `LoggingController`: Handles logging and event tracking endpoints  
- `SceneController`: Manages scene-related operations

**Example Usage:**
```typescript
import { versionController } from '@server/api';

// Get current application version
const version = await versionController.getVersion();
console.log(version.data.fullVersion); // "v1.0.0 (07-31-2025-00:30:56-CDT-dev)"
```

### 2. Services Layer (`/server/api/services/`)

Services contain business logic and orchestrate between different layers.

**Key Classes:**
- `VersionService`: Version management and GitHub integration
- `LoggingService`: Structured logging and event tracking

**Example Usage:**
```typescript
import { versionService, loggingService } from '@server/api';

// Get dynamic version info from GitHub
const latestVersion = await versionService.getDynamicVersionInfo();

// Log an application event
await loggingService.logEvent({
    eventType: 'user_action',
    eventSource: 'client',
    metadata: { action: 'scene_created', userId: 'user123' }
});
```

### 3. Repositories Layer (`/server/api/repositories/`)

Repositories manage data access and database operations.

**Key Classes:**
- `LogRepository`: Database operations for logs
- `SceneRepository`: Database operations for scenes

### 4. Clients Layer (`/server/api/clients/`)

Clients handle external API communication using the Clean API architecture.

**Key Classes:**
- `GitHubAPIClient`: GitHub API integration for releases and version info
- `SupabaseAPIClient`: Direct Supabase REST API communication

**Example Usage:**
```typescript
import { githubAPIClient } from '@server/api';

// Fetch latest release from GitHub
const { data, error } = await githubAPIClient.getLatestRelease();
if (data) {
    console.log(`Latest version: ${data.version}`);
}
```

## Configuration

The API layer uses centralized configuration in `/server/api/config.ts`:

```typescript
import { githubAPI, supabaseAPI, githubClient, supabaseClient } from '@server/api/config';

// GitHub API is pre-configured with:
// - Base URL: https://api.github.com
// - Repository: BA-CalderonMorales/immersive-awe-canvas
// - Proper headers and user agent

// Supabase API is pre-configured with:
// - Base URL: Your Supabase project URL
// - API keys and authentication headers
```

## Usage Patterns

### 1. Simple Version Check
```typescript
import { versionController } from '@server/api';

const versionInfo = await versionController.getCurrentVersion();
// Returns: { appVersion, buildInfo, fullVersion }
```

### 2. Event Logging
```typescript
import { loggingService } from '@server/api';

await loggingService.logUserAction('scene_created', 'user123', {
    sceneId: 'scene456',
    timestamp: new Date().toISOString()
});
```

### 3. GitHub Integration
```typescript
import { versionService } from '@server/api';

// Check if current version is latest
const isLatest = await versionService.isCurrentVersionLatest();

// Get all releases
const { data: releases } = await versionService.getAllReleases(5);
```

## Error Handling

All API methods return consistent error structures:

```typescript
// Success response
{
    success: true,
    data: { /* response data */ },
    message?: string
}

// Error response  
{
    success: false,
    error: string
}
```

## Clean API Integration

This architecture leverages the `@ba-calderonmorales/clean-api` package for:

- **Consistent API patterns**: Standardized request/response handling
- **Type safety**: Full TypeScript support with proper interfaces
- **Flexible clients**: Easy to swap HTTP clients or add new endpoints  
- **Error handling**: Consistent error patterns across all API calls

## Development Guidelines

### Adding a New Service

1. Create the service class in `/server/api/services/`
2. Implement singleton pattern for instance management
3. Use dependency injection for clients and repositories
4. Add proper TypeScript types and interfaces
5. Export from services index and main API index

### Adding a New Client

1. Create client class extending clean-api patterns
2. Configure base URLs and headers in config.ts
3. Implement APIResult return types for consistency
4. Add comprehensive error handling
5. Export from clients index

### Adding a New Controller

1. Create controller class with singleton pattern
2. Inject required services and validate inputs
3. Return consistent response formats
4. Handle errors gracefully with proper messages
5. Export from controllers index

## Future Enhancements

- **Caching Layer**: Add redis or in-memory caching for frequently accessed data
- **Rate Limiting**: Implement rate limiting for external API calls
- **Monitoring**: Add performance monitoring and metrics collection
- **Authentication**: Integrate JWT or session-based authentication
- **API Documentation**: Generate OpenAPI/Swagger documentation from code
