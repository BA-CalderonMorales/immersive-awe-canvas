# Supabase Migration Workflow

Create, test, and apply Supabase database migrations with proper validation and rollback support.

## What This Does

1. Generates timestamp-based migration files
2. Validates SQL syntax and schema changes
3. Checks for breaking changes in existing queries
4. Tests migration locally before deployment
5. Generates TypeScript types from new schema
6. Provides rollback migration if needed

## Usage

```bash
/db-migrate [description]
```

Examples:
- `/db-migrate "add user preferences table"`
- `/db-migrate "add likes_count to worlds"`

## Workflow Steps

1. **Create Migration File**
   - Generate timestamped SQL file
   - Add descriptive comment header
   - Include rollback SQL

2. **Validate Schema**
   - Check SQL syntax
   - Validate foreign key references
   - Check for naming conflicts
   - Ensure proper indexing

3. **Test Locally**
   - Apply migration to local Supabase
   - Run existing queries to check compatibility
   - Verify no breaking changes

4. **Generate Types**
   - Update TypeScript types from new schema
   - Regenerate Supabase client types
   - Update API layer interfaces

5. **Documentation**
   - Document schema changes
   - Update API documentation
   - Note any breaking changes

## File Locations

- Migrations: `database/supabase/migrations/`
- Types: `database/supabase/types/`
- Format: `YYYYMMDDHHMISS-description.sql`

## Best Practices

- Always include rollback SQL in comments
- Use descriptive migration names
- Test with existing data patterns
- Update types immediately after migration
- Document breaking changes clearly
