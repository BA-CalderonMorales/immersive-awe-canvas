# Comprehensive Diagnosis: Geometry Uniqueness Issue

## Problem Statement
Database returns unique geometry types (TorusKnot, DistortionSphere, WobbleField, etc.) but only TorusKnot renders visually, regardless of world changes.

## Data Flow Analysis

### ✓ CONFIRMED WORKING: Database → React State
```
1. Supabase returns: worlds[n].scene_config.type = "DistortionSphere" ✓
2. ExperienceLogic.tsx:99 logs: "Applying world scene config" ✓
3. setEditableSceneConfig(worldData.sceneConfig) ✓
4. editableSceneConfig.type updates correctly ✓
```

### ✓ CONFIRMED WORKING: React State → Component Props
```
5. ExperienceLayout receives editableSceneConfig ✓
6. DynamicScene receives editableSceneConfig ✓
7. DynamicScene.useMemo creates dynamicSceneConfig ✓
8. dynamicSceneConfig.type matches database ✓
```

### ❓ NEEDS VERIFICATION: Component Props → Three.js Render
```
9. DynamicWorld receives sceneConfig with correct type ❓
10. DynamicObject receives type prop ❓
11. Correct component renders (TorusKnotObject vs DistortionSphereObject) ❓
12. Three.js geometry actually changes ❓
```

## Current Logging Strategy

### Added Console Logs:
1. **DynamicWorld.tsx:31** - "🌍 DynamicWorld RENDER" with type, theme, lights
2. **DynamicObject.tsx:34** - "🎨 DynamicObject RENDER" with type, theme, color
3. **DynamicObject.tsx:79** - "✅ GeometryRegistry rendering" when using registry
4. **DynamicObject.tsx:83** - "⚠️ Using legacy component" when using switch

### Expected Console Output When Changing Worlds:
```
ExperienceLogic: Applying world scene config from database: {type: "TorusKnot"}
🌍 DynamicWorld RENDER: {type: "TorusKnot", theme: "day", ...}
🎨 DynamicObject RENDER: {type: "TorusKnot", theme: "day", ...}
⚠️ Using legacy component for: TorusKnot

[Press N]

ExperienceLogic: Applying world scene config from database: {type: "DistortionSphere"}
🌍 DynamicWorld RENDER: {type: "DistortionSphere", theme: "day", ...}
🎨 DynamicObject RENDER: {type: "DistortionSphere", theme: "day", ...}
⚠️ Using legacy component for: DistortionSphere
```

## Key Issues to Investigate

### Issue 1: React Keys
- **DynamicScene.tsx:162** - `key={dynamicSceneConfig.type}` on DynamicWorld ✓
- **DynamicWorld.tsx:64** - `key={sceneConfig.type}` on DynamicObject ✓

**Status:** Keys are correctly set to force remount when type changes

### Issue 2: Component Import/Export
All legacy components are imported:
- TorusKnotObject ✓
- DistortionSphereObject ✓
- WobbleFieldObject ✓
- CrystallineSpireObject ✓

**Status:** All imports present and switch statement looks correct

### Issue 3: Three.js Disposal
When components remount (via key change), Three.js objects should be disposed automatically by React Three Fiber.

**Potential Issue:** If Three.js objects aren't being disposed, old geometry stays visible even after unmount.

### Issue 4: Canvas Context
- **DynamicScene.tsx:137** has ONE Canvas
- Canvas should persist across world changes
- Only DynamicWorld inside should remount

**Status:** Canvas architecture looks correct

## Diagnostic Steps for User

### Step 1: Check Console Logs
After pressing N to change worlds, look for:
1. Does "🌍 DynamicWorld RENDER" show different types?
2. Does "🎨 DynamicObject RENDER" show different types?
3. Is "⚠️ Using legacy component" showing the CURRENT type or always "TorusKnot"?

### Step 2: Check if Components are Rendering
If logs show correct types but visual doesn't change:
- Problem is in Three.js layer (geometry not updating)
- Possible causes:
  - Three.js disposal not working
  - Ref caching geometry
  - Scene not clearing

### Step 3: Check Registry Geometries (Worlds 20-26)
Navigate to world 20 (PulsatingOctahedron):
- Should see "✅ GeometryRegistry rendering: PulsatingOctahedron"
- Should see pink/purple crystal geometry

## Proposed Solutions Based on Diagnosis

### If logs show SAME type always:
**Root Cause:** React not re-rendering with new props
**Solution:** Check useMemo dependencies in DynamicScene.tsx:43

### If logs show DIFFERENT types but visual same:
**Root Cause:** Three.js objects not updating
**Solution:** Add disposal logic to geometry components

### If only legacy components fail:
**Root Cause:** Legacy component architecture issue
**Solution:** Refactor legacy components to match registry pattern

### If only registry geometries fail:
**Root Cause:** GeometryRegistry rendering issue
**Solution:** Fix GeometryRegistry.render() method

## Next Steps

1. **Run the app** with new logging
2. **Press N** to cycle through worlds
3. **Copy ALL console output** showing the render logs
4. **Analyze** which stage is failing (props vs rendering)
5. **Implement targeted fix** based on evidence
