# Project-Specific Claude Code Commands

Curated slash commands tailored for Immersive Awe Canvas development with Three.js, React, Supabase, TypeScript, and GitHub Pages.

## Overview

These commands streamline common development workflows specific to this project's tech stack. They complement the generic Claude Flow coordination commands with project-specific automation.

## Command Categories

### Three.js Development
- `/debug-scene` - Debug Three.js scene rendering and performance issues
- `/optimize-scene` - Optimize scene for 60fps target performance
- `/profile-scene` - Profile scene with detailed performance metrics

### React Development
- `/refactor-component` - Refactor components using project patterns (MVVM, hooks)
- `/fix-common` - Auto-detect and fix common React/Three.js bugs
- `/add-ui-component` - Generate shadcn/ui component with boilerplate

### Supabase/Database
- `/migration-workflow` - Create and apply Supabase migrations
- `/sync-types` - Generate TypeScript types from Supabase schema

### TypeScript
- `/strict-type-check` - Eliminate 'any' types and improve type safety

### Deployment & Build
- `/deploy-gh-pages` - Build and deploy to GitHub Pages
- `/build-check` - Run comprehensive quality checks (types, lint, tests)
- `/bundle-analysis` - Analyze and optimize bundle size

### Performance
- `/profile-scene` - Profile Three.js scene performance
- `/bundle-analysis` - Bundle size and optimization analysis

### Generators
- `/add-scene-object` - Generate new Three.js scene object with boilerplate
- `/add-ui-component` - Generate shadcn/ui component

## Quick Start

### Debugging a Scene Issue

```bash
# Debug the entire scene for common issues
/debug-scene

# Debug a specific component
/debug-scene CrystallineSpire
```

### Adding New Features

```bash
# Add a new 3D scene object
/add-scene-object FloatingCrystals --type animated

# Add a new UI component
/add-ui-component PerformancePanel --primitive sheet
```

### Before Deploying

```bash
# Run all quality checks
/build-check --fix

# Optimize bundle size
/bundle-analysis

# Deploy to GitHub Pages
/deploy-gh-pages
```

### Database Changes

```bash
# Create a new migration
/migration-workflow "add user_preferences table"

# Sync TypeScript types
/sync-types
```

## Detailed Command Documentation

### Three.js Commands

#### `/debug-scene [component-name]`

Analyzes Three.js components for:
- Memory leaks (undisposed geometries/materials)
- Missing cleanup in useFrame/useEffect
- Shader compilation errors
- Performance bottlenecks
- React Three Fiber anti-patterns

**Example Output:**
```
Scene Analysis: CrystallineSpire
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Issues Found: 3

[CRITICAL] Memory Leak in CrystallineSpire.tsx:45
  - Geometry created but never disposed
  - Fix: Add geometry.dispose() in cleanup

[WARNING] Inefficient Re-render at line 78
  - useFrame callback recreated on every render
  - Fix: Wrap in useCallback with proper dependencies

[INFO] Missing null check at line 102
  - meshRef.current accessed without null check
  - Fix: Add if (meshRef.current) guard
```

#### `/optimize-scene [target-fps]`

Optimizes scene for target FPS:
- Reduces geometry complexity
- Optimizes materials and shaders
- Implements LOD (Level of Detail)
- Adds frustum culling
- Suggests React optimizations

**Example Output:**
```
Scene Optimization Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Current Performance:
  Average FPS: 45fps
  Frame Time: 22ms
  Draw Calls: 156

Target Performance: 60fps

Optimizations Applied:
  ✓ Reduced polygon count by 40% (-120KB)
  ✓ Merged 12 geometries into 3 InstancedMeshes
  ✓ Simplified shader complexity (-5ms per frame)
  ✓ Added React.memo to 5 components
  ✓ Implemented frustum culling

Expected Improvements:
  Estimated FPS: 62fps
  Frame Time: 16ms
  Draw Calls: 48 (-69%)
```

### React Commands

#### `/refactor-component <path>`

Refactors React components following project patterns:
- MVVM pattern separation
- Custom hooks extraction
- Performance optimization (memo, useMemo, useCallback)
- TypeScript improvements

**Example:**
```bash
/refactor-component client/components/experience/ExperienceLayout.tsx
```

**Output:**
```
Refactoring: ExperienceLayout.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Changes Applied:

1. Extracted ViewModel
   Created: ExperienceLayoutViewModel.ts
   - Moved complex logic to ViewModel
   - Added unit testable logic layer

2. Performance Optimizations
   - Added React.memo wrapper
   - Memoized 3 expensive calculations
   - Stabilized 5 callback functions

3. TypeScript Improvements
   - Strengthened 8 prop types
   - Added 4 missing return types
   - Removed 2 'any' types

Files Modified:
  - ExperienceLayout.tsx (simplified)
  - ExperienceLayoutViewModel.ts (new)
  - ExperienceLayout.test.tsx (updated)
```

### Database Commands

#### `/migration-workflow <description>`

Creates complete migration workflow:
- Generates timestamped SQL file
- Validates schema changes
- Tests locally
- Generates TypeScript types
- Documents changes

**Example:**
```bash
/migration-workflow "add likes_count to worlds table"
```

**Output:**
```
Migration Workflow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Created: 20251106120000-add-likes-count-to-worlds.sql
✓ Validated SQL syntax
✓ Applied to local database
✓ Generated TypeScript types
✓ Updated API layer interfaces

Migration Preview:
  ALTER TABLE worlds
    ADD COLUMN likes_count INTEGER DEFAULT 0 NOT NULL;

  CREATE INDEX idx_worlds_likes_count
    ON worlds(likes_count DESC);

Breaking Changes: None
Files Updated: 3
  - database/supabase/migrations/20251106120000-add-likes-count-to-worlds.sql
  - database/supabase/types/database.types.ts
  - client/api/types/worlds.types.ts

Next Steps:
  1. Review migration file
  2. Test with existing data
  3. Deploy to staging
  4. Run: /sync-types --env production
```

### Deployment Commands

#### `/deploy-gh-pages [--skip-tests]`

Complete deployment workflow:
- Type checking
- Linting
- Testing
- Production build
- Asset optimization
- GitHub Pages deployment
- Verification

**Output:**
```
GitHub Pages Deployment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pre-Deploy Checks:
  ✓ TypeScript compilation
  ✓ Biome linting
  ✓ Test suite (54 tests passed)
  ✓ No console.log in code

Build:
  ✓ Production build complete
  ✓ Asset prefix configured: /immersive-awe-canvas/
  ✓ Bundle size: 850KB gzipped (target: <1MB)

Deploy:
  ✓ Pushed to gh-pages branch
  ✓ Deployment triggered

Verification:
  ✓ Site loads correctly
  ✓ Assets load without 404s
  ✓ No console errors
  ✓ Three.js scenes render

Deployment URL:
  https://yourusername.github.io/immersive-awe-canvas/

Status: ✅ Deployment Successful
```

## Performance Optimization Workflow

### Step 1: Profile Current Performance

```bash
/profile-scene
```

### Step 2: Analyze Bundle Size

```bash
/bundle-analysis --interactive
```

### Step 3: Optimize Scene

```bash
/optimize-scene 60
```

### Step 4: Verify Improvements

```bash
/profile-scene 30
```

## Development Workflow Examples

### Adding a New Feature

```bash
# 1. Create new scene object
/add-scene-object PulsatingOrb --type animated

# 2. Test in development
bun run dev

# 3. Profile performance
/profile-scene PulsatingOrb

# 4. Fix any issues
/debug-scene PulsatingOrb

# 5. Run quality checks
/build-check --fix

# 6. Deploy
/deploy-gh-pages
```

### Fixing Performance Issues

```bash
# 1. Profile to identify bottlenecks
/profile-scene 30

# 2. Optimize scene
/optimize-scene 60

# 3. Fix common bugs
/fix-common --path client/components/scene

# 4. Verify improvements
/profile-scene 10

# 5. Check bundle size
/bundle-analysis
```

### Refactoring a Component

```bash
# 1. Run type checking
/strict-type-check --path client/components/experience

# 2. Refactor component
/refactor-component client/components/experience/ExperienceLayout.tsx

# 3. Fix common issues
/fix-common --path client/components/experience

# 4. Run tests
bun run test

# 5. Build check
/build-check
```

## Integration with Claude Flow

These project commands work seamlessly with Claude Flow coordination:

```bash
# Initialize swarm for complex refactoring
npx claude-flow@alpha swarm init --topology hierarchical --agents 5

# Use project command within swarm context
/refactor-component client/components/scene/DynamicScene.tsx

# The swarm coordinates while project commands execute
```

## Best Practices

1. **Run checks before committing**
   ```bash
   /build-check --fix
   ```

2. **Profile after major changes**
   ```bash
   /profile-scene
   ```

3. **Keep types in sync with database**
   ```bash
   /sync-types
   ```

4. **Monitor bundle size**
   ```bash
   /bundle-analysis
   ```

5. **Test deployment locally**
   ```bash
   bun run build && bun run preview
   ```

## Customization

All commands are defined in Markdown files under `.claude/commands/project/`. You can:

1. Modify existing commands
2. Add new commands
3. Adjust parameters and outputs
4. Create project-specific aliases

## Support

- Project Documentation: `README.md`
- Claude Flow Docs: `.claude/commands/README.md`
- Tech Stack Docs: `.claude/project-metaprompt.md`

## Contributing

When adding new commands:

1. Place in appropriate category directory
2. Follow existing command format
3. Include usage examples
4. Document expected output
5. Add to this README

---

**Note**: These commands are designed to work with Claude Code and leverage the project's specific tech stack and architecture patterns.
