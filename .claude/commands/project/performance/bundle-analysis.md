# Bundle Size Analysis

Analyze and optimize bundle size for faster loading and better performance.

## What This Does

1. Analyzes production bundle composition
2. Identifies large dependencies
3. Detects duplicate dependencies
4. Suggests code splitting opportunities
5. Finds unused dependencies
6. Provides optimization recommendations

## Usage

```bash
/bundle-analysis [--interactive]
```

Examples:
- `/bundle-analysis` - Generate report
- `/bundle-analysis --interactive` - Open interactive visualizer

## Bundle Analysis Process

### 1. Build Analysis Bundle

```bash
BUNDLE_ANALYZE=1 bun run build
```

Generates:
- Bundle size report
- Dependency tree
- Asset manifest
- Source maps

### 2. Analyze Dependencies

Checks for:
- Large libraries (> 100KB)
- Duplicate dependencies
- Unused dependencies
- Tree-shaking opportunities

### 3. Code Splitting Analysis

Identifies:
- Route-level splits
- Component lazy loading
- Dynamic imports
- Vendor chunks

### 4. Asset Optimization

Reviews:
- Image compression
- Font subsetting
- SVG optimization
- CSS purging

## Size Targets

- **Initial Bundle**: < 500KB gzipped
- **Vendor Chunk**: < 300KB gzipped
- **Route Chunks**: < 100KB gzipped each
- **Total Bundle**: < 1MB gzipped

## Common Optimizations

### 1. Replace Large Dependencies

```typescript
// BEFORE (moment.js ~300KB)
import moment from 'moment';

// AFTER (date-fns ~70KB, tree-shakeable)
import { format } from 'date-fns';
```

### 2. Dynamic Imports

```typescript
// BEFORE
import HeavyComponent from './HeavyComponent';

// AFTER
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### 3. Three.js Tree Shaking

```typescript
// BEFORE (imports entire Three.js)
import * as THREE from 'three';

// AFTER (only imports needed modules)
import { Mesh, BoxGeometry, MeshStandardMaterial } from 'three';
```

### 4. Vendor Chunk Optimization

```typescript
// rsbuild.config.ts
export default {
  performance: {
    chunkSplit: {
      strategy: 'split-by-experience',
      override: {
        chunks: 'all',
        cacheGroups: {
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'vendor-three',
            priority: 10,
          },
          react: {
            test: /[\\/]node_modules[\\/]react[\\/]/,
            name: 'vendor-react',
            priority: 10,
          },
        },
      },
    },
  },
};
```

### 5. Remove Unused Code

```typescript
// Remove unused imports
// Remove dead code branches
// Remove console.logs in production
// Purge unused Tailwind classes
```

## Report Output

### 1. Size Summary

```
Total Bundle Size: 850KB (320KB gzipped)
  - Vendor: 450KB (180KB gzipped)
  - Application: 300KB (110KB gzipped)
  - Assets: 100KB (30KB gzipped)

Status: ⚠️ Warning (Target: < 1MB gzipped)
```

### 2. Largest Dependencies

```
1. three.js - 150KB (60KB gzipped) - Required
2. react-dom - 120KB (45KB gzipped) - Required
3. @radix-ui/* - 80KB (30KB gzipped) - Consider alternatives
4. framer-motion - 70KB (25KB gzipped) - Consider code splitting
5. lil-gui - 50KB (18KB gzipped) - Lazy load for settings
```

### 3. Optimization Opportunities

```
High Priority:
  - Split lil-gui to settings chunk (-50KB)
  - Lazy load dialog components (-30KB)
  - Remove unused Radix UI components (-20KB)

Medium Priority:
  - Optimize Three.js imports (-15KB)
  - Code split scene objects (-25KB)
  - Compress PNG assets (-10KB)

Low Priority:
  - Subset fonts (-5KB)
  - Optimize SVG icons (-3KB)
```

### 4. Detailed Breakdown

Interactive visualizer shows:
- Treemap of bundle composition
- Dependency relationships
- Load time estimates
- Size over time trends

## Continuous Monitoring

1. **Pre-Commit Checks**
   - Warn on bundle size increase > 10%
   - Block on size increase > 25%

2. **CI/CD Integration**
   - Track bundle size in PRs
   - Generate size comparison reports
   - Alert on regressions

3. **Performance Budgets**
   - Set budgets per route
   - Monitor loading metrics
   - Track Core Web Vitals

## Tools Used

- RSBuild bundle analyzer
- webpack-bundle-analyzer
- source-map-explorer
- bundlephobia API
- Package Phobia
