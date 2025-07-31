# Architecture Documentation

## Project Structure

This document outlines the architectural structure of the Immersive Awe Canvas project after Phase 1 refactoring.

### Core Module Structure

```
├── client/                  # Frontend React application
│   ├── components/         # React components organized by feature
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Client-side utilities
│   └── types/             # Client-specific type definitions
├── database/              # Database layer (consolidated)
│   ├── supabase/         # Supabase configuration and types
│   │   ├── migrations/   # All database migrations (consolidated)
│   │   └── types.ts      # Generated database types
│   └── shared/           # Shared database utilities
├── server/               # Backend server code
│   ├── api/              # Layered API architecture
│   │   ├── clients/      # External API clients (GitHub, Supabase)
│   │   ├── services/     # Business logic layer
│   │   ├── repositories/ # Data access layer
│   │   ├── controllers/  # Request/response handling
│   │   └── config.ts     # API configuration
│   ├── logger.ts         # Application logging
│   ├── security.ts       # Security utilities
│   └── version.ts        # Version management
├── utils/                # Cross-platform utilities
└── docs/                 # Unified documentation
    ├── archive/          # Archived development artifacts
    └── *.md             # Documentation files
```

### Design Principles

1. **Module Consolidation**: Related functionality grouped into logical modules
2. **Single Source of Truth**: No duplicate files or scattered configurations
3. **Clear Separation**: Client, server, database, and utility concerns separated
4. **Documentation First**: All architecture decisions documented

### Database Layer

The database module serves as the single source of truth for all database-related code:

- **Supabase Integration**: Centralized configuration and type definitions
- **Migration Management**: All migrations consolidated in one location
- **Shared Utilities**: Common database operations and type guards

### Server API Layer

The server module implements a clean, layered architecture using the `@ba-calderonmorales/clean-api` package:

#### Layer Structure
1. **Controllers**: Handle HTTP requests/responses and input validation
2. **Services**: Contain business logic and orchestrate between layers  
3. **Repositories**: Manage data access and database operations
4. **Clients**: Handle external API communication (GitHub, Supabase REST API)

#### Key Features
- **Clean API Integration**: Leverages clean-api package for consistent API patterns
- **Singleton Pattern**: Controllers and services use singleton instances for efficiency
- **Error Handling**: Consistent error handling across all layers
- **Type Safety**: Full TypeScript support with proper type definitions
- **Separation of Concerns**: Clear boundaries between different responsibilities

#### Available Services
- **VersionService**: Manages application versioning and GitHub release information
- **LoggingService**: Handles structured application logging and event tracking
- **SceneService**: Manages scene-related operations (future implementation)

### Refactoring Phases

- **Phase 1**: Structural cleanup and consolidation (Current)
- **Phase 2**: Performance optimization and dead code elimination
- **Phase 3**: Testing infrastructure improvements
- **Phase 4**: Documentation and deployment enhancements

## Next Steps

See [roadmap.md](./roadmap.md) for planned architectural improvements.