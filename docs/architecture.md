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

### Refactoring Phases

- **Phase 1**: Structural cleanup and consolidation (Current)
- **Phase 2**: Performance optimization and dead code elimination
- **Phase 3**: Testing infrastructure improvements
- **Phase 4**: Documentation and deployment enhancements

## Next Steps

See [roadmap.md](./roadmap.md) for planned architectural improvements.