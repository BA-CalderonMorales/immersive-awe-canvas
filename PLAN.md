# Plan: Elegant Simplification & Architectural Harmony

> Transform the immersive-awe-canvas from a working-but-complex app into an elegantly simple, awe-inspiring experience that humans can understand at a glance and AI agents can extend confidently.

## Philosophy

- **LESS CODE** without removing shock, awe, or maintainability
- **KISS** — simple but properly separated where necessary
- **Modules small enough** for future agent sessions to handle confidently
- **Net positive only** — never regress from current working state
- **Human comprehensible** — the beauty of the design must be visible

---

## Steps

### 1. Create an Iconic Favicon & Brand Identity

**Priority:** High | **Complexity:** Low | **Files:** ~3

Replace the generic gray `placeholder.svg` with a custom favicon that evokes 3D immersion (stylized torus knot, geometric crystal, or abstract 3D canvas).

**Current State:**

- `public/placeholder.svg` — generic gray circle with image icon
- `index.html` — missing `<link rel="icon">` tag
- `public/manifest.json` — references placeholder for PWA icons

**Actions:**

- [ ] Design SVG favicon matching dark theme aesthetic
- [ ] Add `<link rel="icon" href="/favicon.svg" type="image/svg+xml">` to `index.html`
- [ ] Create PNG fallbacks (16x16, 32x32, 192x192, 512x512)
- [ ] Update `manifest.json` with proper icon sizes for PWA

**Design Direction Options:**

- Minimalist geometric (single torus knot silhouette)
- Gradient 3D shape (colorful, eye-catching)
- Abstract canvas with depth (represents the "canvas" concept)

---

### 2. Consolidate Experience State into a Single Unified Store

**Priority:** High | **Complexity:** Medium | **Lines Saved:** ~300

Replace 8+ fragmented hooks with ONE `useExperienceStore`.

**Current Fragmentation:**

```
useExperienceState.ts      — 225 lines
useExperienceCallbacks.ts  — 28 lines
useExperienceTransitions.ts — 63 lines
useExperienceEffects.ts    — 92 lines
useExperienceHotkeys.ts    — exists
useHotkeyActions.ts        — exists
```

**Target Architecture:**

```typescript
// Single source of truth
const useExperienceStore = create<ExperienceState>((set, get) => ({
  // Scene state
  sceneConfig: defaultSceneConfig,
  theme: "night",

  // UI state
  isSettingsOpen: false,
  isUiHidden: false,

  // Transitions
  isTransitioning: false,
  showEntryTransition: true,

  // Actions (all in one place)
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "day" ? "night" : "day" })),
  // ...
}));
```

**Actions:**

- [ ] Install Zustand (or use useReducer if preferring zero deps)
- [ ] Create `client/store/experienceStore.ts`
- [ ] Migrate state from fragmented hooks
- [ ] Delete obsolete hook files
- [ ] Update components to use store directly

---

### 3. Flatten the Experience Component Hierarchy

**Priority:** High | **Complexity:** Medium | **Files Affected:** 4

Merge 4-layer chain into 2 clean components.

**Current Chain (too deep):**

```
ExperienceContent.tsx
  └─ ExperienceLogic.tsx (310 lines, 20+ state pieces)
       └─ ExperienceContainer.tsx (50+ props passed)
            └─ ExperienceContainerContent.tsx (201 lines)
```

**Target Structure:**

```
ExperiencePage.tsx        — Orchestration, store connection
  └─ ExperienceView.tsx   — Pure rendering
       ├─ ExperienceLayout.tsx  — (keep as-is, presentational)
       └─ ExperienceUI.tsx      — (keep as-is, presentational)
```

**Actions:**

- [ ] Create `ExperiencePage.tsx` — connects to store, handles routing
- [ ] Create `ExperienceView.tsx` — receives minimal props, renders scene
- [ ] Delete `ExperienceLogic.tsx`, `ExperienceContainer.tsx`, `ExperienceContainerContent.tsx`
- [ ] Preserve `ExperienceLayout.tsx` and `ExperienceUI.tsx` unchanged

---

### 4. Unify Data Hooks with Consistent Patterns

**Priority:** Medium | **Complexity:** Medium | **Lines Saved:** ~150

Merge three identical-pattern hooks into one.

**Current Duplication:**

```typescript
// All three do the same thing with different data:
useWorlds.ts           — fetch, currentIndex, change/jump
useBackgrounds.ts      — fetch, currentIndex, change/jump
useDefaultGeometries.ts — fetch, currentIndex, change/jump
```

**Target:**

```typescript
// Generic, reusable pattern
const useSceneData = () => {
  const backgrounds = useIndexedQuery("backgrounds", fetchBackgrounds);
  const geometries = useIndexedQuery("default_geometries", fetchGeometries);

  return { backgrounds, geometries };
};

// Shared utility hook
const useIndexedQuery = <T>(key: string, fetcher: () => Promise<T[]>) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, isLoading } = useQuery({ queryKey: [key], queryFn: fetcher });

  const current = data?.[currentIndex] ?? null;
  const change = (dir: "next" | "prev") => {
    /* ... */
  };
  const jumpTo = (index: number) => {
    /* ... */
  };

  return { data, current, currentIndex, change, jumpTo, isLoading };
};
```

**Actions:**

- [ ] Create `client/hooks/useIndexedQuery.ts` — generic pattern
- [ ] Create `client/hooks/useSceneData.ts` — unified data access
- [ ] Migrate components to use new hook
- [ ] Delete `useWorlds.ts`, `useBackgrounds.ts`, `useDefaultGeometries.ts`

---

### 5. Establish Clear Vertical Slice Modules

**Priority:** Medium | **Complexity:** Low | **Impact:** High for future agents

Create 4 self-contained feature modules with clear boundaries.

**Target Structure:**

```
client/
  features/
    scene/           # 3D rendering (Three.js, geometries, backgrounds)
      components/
      hooks/
      types.ts
      index.ts       # Public API only

    controls/        # User interaction (keyboard, drag, orbit)
      components/
      hooks/
      types.ts
      index.ts

    settings/        # Configuration UI (panels, forms)
      components/
      hooks/
      types.ts
      index.ts

    data/            # Supabase/API layer
      clients/
      hooks/
      types.ts
      index.ts
```

**Rules:**

- Each module exports ONLY through `index.ts`
- Cross-module imports only via public API
- Types co-located with feature
- Each module < 1000 lines total (agent-friendly)

**Actions:**

- [ ] Create `features/` directory structure
- [ ] Move scene components into `features/scene/`
- [ ] Move control hooks into `features/controls/`
- [ ] Create barrel exports (`index.ts`) for each
- [ ] Update import paths across codebase

---

### 6. Simplify DynamicObject with Registry Pattern

**Priority:** Low | **Complexity:** Low | **Lines Saved:** ~50

Replace 10-case switch with self-registering pattern.

**Current (DynamicObject.tsx):**

```typescript
switch (type) {
  case "TorusKnot": return <TorusKnotObject {...} />;
  case "WobbleField": return <WobbleFieldObject {...} />;
  case "CrystallineSpire": return <CrystallineSpireObject {...} />;
  // ... 7 more cases
}
```

**Target (matches BackgroundRegistry.tsx pattern):**

```typescript
// GeometryRegistry.ts
export const GeometryRegistry = new RegistryClass()
  .register("TorusKnot", { render: (props) => <TorusKnotObject {...props} /> })
  .register("WobbleField", {
    render: (props) => <WobbleFieldObject {...props} />,
  });
// Self-documenting, extensible without touching DynamicObject.tsx

// DynamicObject.tsx (now trivial)
const DynamicObject = ({ type, ...props }) => {
  return GeometryRegistry.render(type, props);
};
```

**Actions:**

- [ ] Create `client/components/scene/objects/GeometryRegistry.tsx`
- [ ] Migrate all geometry registrations
- [ ] Simplify `DynamicObject.tsx` to 10 lines
- [ ] Add TypeScript inference for available geometry types

---

### 7. Purge Debug Artifacts & Consolidate Logging

**Priority:** Low | **Complexity:** Low | **Lines Affected:** ~20 files

Remove scattered `console.log` statements, use structured logging.

**Current Problems:**

- 20+ `console.log` calls across hooks (found via grep)
- Debug output in production builds
- Inconsistent logging patterns

**Actions:**

- [ ] Create `DEBUG` flag in `client/lib/config.ts`
- [ ] Replace all `console.log` with `logEvent` or conditional debug
- [ ] Ensure debug logs stripped in production (via build config)
- [ ] Remove emoji prefixes from logs (🔄, 🌟, etc.)

---

## Further Considerations (Decisions Needed)

### A. State Management Choice

| Option                 | Pros                                  | Cons                                |
| ---------------------- | ------------------------------------- | ----------------------------------- |
| **Keep React Context** | Already working, no new deps          | Boilerplate, prop drilling persists |
| **Migrate to Zustand** | Less boilerplate, devtools, selectors | New dependency                      |
| **URL State**          | Shareable scenes, deep linking        | Complex for nested state            |

**Recommendation:** Zustand — minimal overhead, excellent DX, proven at scale.

### B. The 754-line SceneSettingsPanel

| Option                    | Pros                            | Cons                      |
| ------------------------- | ------------------------------- | ------------------------- |
| **Split into sub-panels** | ~100 lines each, agent-friendly | More files to coordinate  |
| **Keep monolithic**       | Single file to understand       | Too large for quick edits |

**Recommendation:** Split into `ColorSettings`, `GeometrySettings`, `LightSettings`, `ObjectSettings` — each under 150 lines.

### C. Server Layer Simplification

Current: `controllers → services → repositories → clients`

| Option                           | Pros                          | Cons                         |
| -------------------------------- | ----------------------------- | ---------------------------- |
| **Keep layered**                 | Enterprise patterns, testable | Over-engineered for this app |
| **Flatten to services + client** | Simpler, less indirection     | Less "clean architecture"    |

**Recommendation:** Keep layers but ensure each has clear purpose. Current implementation is reasonable.

---

## Success Metrics

| Metric                     | Current      | Target           |
| -------------------------- | ------------ | ---------------- |
| Experience component depth | 4 layers     | 2 layers         |
| Props passed through chain | 50+          | <10              |
| Hook files for experience  | 8+           | 2                |
| Lines in ExperienceLogic   | 310          | 0 (deleted)      |
| Console.log statements     | 20+          | 0                |
| Favicon                    | Generic gray | Custom 3D-themed |

---

## Execution Order

1. **Favicon** (quick win, visual impact)
2. **Experience Store** (foundation for everything else)
3. **Flatten Components** (depends on store)
4. **Unify Data Hooks** (independent)
5. **Vertical Slices** (reorganization)
6. **Geometry Registry** (polish)
7. **Logging Cleanup** (final sweep)

---

## Agent Session Guidelines

Each step above is designed to be completable in a single agent session (~30 min). When implementing:

1. **Start with tests** — ensure existing behavior is captured
2. **One step at a time** — don't combine steps
3. **Verify before deleting** — ensure new code works before removing old
4. **Update imports** — use search/replace for path changes
5. **Run tests after each change** — `bun test` must pass

---

_Last updated: January 10, 2026_
