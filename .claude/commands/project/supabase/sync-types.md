# Sync Supabase Types

Generate and sync TypeScript types from Supabase database schema.

## What This Does

1. Connects to Supabase project
2. Generates TypeScript types from schema
3. Updates type definitions in codebase
4. Validates API layer compatibility
5. Updates client interfaces
6. Regenerates query builders

## Usage

```bash
/sync-types [--env local|staging|production]
```

Examples:
- `/sync-types` - Sync from local Supabase
- `/sync-types --env production` - Sync from production

## Generated Types

### 1. Database Schema Types

```typescript
// database/supabase/types/database.types.ts
export interface Database {
  public: {
    Tables: {
      worlds: {
        Row: {
          id: string;
          name: string;
          config: SceneConfig;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          config: SceneConfig;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          config?: SceneConfig;
          created_at?: string;
        };
      };
      // ... other tables
    };
  };
}
```

### 2. Supabase Client Types

```typescript
// client/api/clients/supabase-client.ts
import type { Database } from '@database/supabase/types/database.types';

const supabase = createClient<Database>(url, key);
```

### 3. API Layer Types

```typescript
// client/api/types/worlds.types.ts
export type World = Database['public']['Tables']['worlds']['Row'];
export type WorldInsert = Database['public']['Tables']['worlds']['Insert'];
export type WorldUpdate = Database['public']['Tables']['worlds']['Update'];
```

## Sync Process

1. **Connect to Supabase**
   - Load environment variables
   - Validate connection
   - Check schema version

2. **Generate Types**
   - Run Supabase type generation
   - Parse schema definitions
   - Create TypeScript interfaces

3. **Update Files**
   - Write database.types.ts
   - Update API layer types
   - Regenerate client interfaces

4. **Validate Changes**
   - Check for breaking changes
   - Validate existing queries
   - Test API compatibility
   - Run type checking

5. **Update Documentation**
   - Document schema changes
   - Update API documentation
   - Note migration needs

## Breaking Change Detection

Automatically detects:
- Removed tables or columns
- Changed column types
- New required fields
- Altered foreign keys

## Integration with API Layer

Updates Clean API layers:
- `client/api/clients/` - Supabase client
- `client/api/repositories/` - Data access
- `client/api/services/` - Business logic
- `client/api/controllers/` - API controllers

## Best Practices

1. **Run After Migrations**
   - Always sync after schema changes
   - Test queries after sync
   - Update tests if needed

2. **Version Control**
   - Commit type changes separately
   - Document breaking changes
   - Tag schema versions

3. **Environment Consistency**
   - Keep local/staging/prod in sync
   - Test migrations in staging first
   - Sync types across all environments

## Troubleshooting

- **Connection Failed**: Check SUPABASE_URL and SUPABASE_ANON_KEY
- **Type Conflicts**: Review breaking changes and update code
- **Missing Tables**: Ensure migrations have been applied
- **Version Mismatch**: Update Supabase CLI to latest version
