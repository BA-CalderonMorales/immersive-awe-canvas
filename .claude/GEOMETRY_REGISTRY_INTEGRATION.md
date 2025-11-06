# Geometry Registry Integration Guide

## Summary

The GeometryRegistry system has been created and is ready to use! Here's how to integrate it with your existing DynamicScene/DynamicWorld components.

## What Was Created

### Core System Files

1. **`client/components/scene/objects/GeometryContract.ts`**
   - Defines the contract (interface) all geometries must implement
   - TypeScript interfaces for type safety
   - Configuration schemas matching database structure

2. **`client/components/scene/objects/GeometryRegistry.tsx`**
   - Central registry class (singleton)
   - Registration, lookup, and rendering methods
   - React hooks for metadata access
   - Error handling and validation

3. **`client/components/scene/objects/geometries/`** (7 new geometries)
   - `PulsatingOctahedronGeometry.tsx` - Crystal Heart world
   - `SpinningDodecahedronGeometry.tsx` - Cosmic Dodecahedron world
   - `PyramidTetrahedronGeometry.tsx` - Mystic Pyramid world
   - `GlowingConeGeometry.tsx` - Vortex Cone world
   - `OrbitingCylinderGeometry.tsx` - Orbital Pillar world
   - `MorphingBoxGeometry.tsx` - Tesseract Cube world
   - `FloatingCapsuleGeometry.tsx` - Cosmic Pod world

4. **`client/components/scene/objects/geometries/index.ts`**
   - Bootstrap file that auto-registers all geometries
   - Export point for the registry
   - Development logging

5. **`client/components/scene/objects/geometries/README.md`**
   - Comprehensive documentation
   - Usage examples
   - Best practices
   - Troubleshooting guide

## Integration Steps

### Step 1: Import Bootstrap File

Add this to your main app entry point or before any scene rendering:

```tsx
// In client/main.tsx or App.tsx (BEFORE any scene components)
import './components/scene/objects/geometries';
```

This automatically registers all geometries when the app loads.

### Step 2: Update DynamicWorld Component

Option A - **Use GeometryRenderer Component** (Recommended):

```tsx
// In DynamicWorld.tsx
import { GeometryRenderer } from './objects/GeometryRegistry';
import './objects/geometries'; // Ensure registration

function DynamicWorld({ sceneConfig, theme, isMotionFrozen, ... }) {
    const config = sceneConfig[theme]; // Get day or night config

    return (
        <>
            {/* Your lights, background, etc. */}

            {/* Replace existing geometry rendering with registry */}
            <GeometryRenderer
                type={sceneConfig.type}
                theme={theme}
                sceneConfig={sceneConfig}
                config={config}
                isMotionFrozen={isMotionFrozen}
                isLocked={isLocked}
                onClick={handleGeometryClick}
                fallback={<DefaultGeometry />} // Optional fallback
                onError={(err) => console.error('Geometry render error:', err)}
            />
        </>
    );
}
```

Option B - **Use Registry Directly**:

```tsx
// In DynamicWorld.tsx
import { GeometryRegistry } from './objects/GeometryRegistry';
import './objects/geometries';

function DynamicWorld({ sceneConfig, theme, isMotionFrozen, ... }) {
    const config = sceneConfig[theme];

    return (
        <>
            {/* Your lights, background, etc. */}

            {/* Use registry render method */}
            {GeometryRegistry.render(sceneConfig.type, {
                theme,
                sceneConfig,
                config,
                isMotionFrozen,
                isLocked,
                onClick: handleGeometryClick,
            })}
        </>
    );
}
```

### Step 3: Remove Old Geometry Switch Statements

Find and remove any hardcoded switch statements like:

```tsx
// REMOVE THIS:
switch (sceneConfig.type) {
    case "TorusKnot":
        return <EnhancedTorusKnot ... />;
    case "WobbleField":
        return <WobbleFieldObject ... />;
    // ... many more cases
}

// REPLACE WITH:
return GeometryRegistry.render(sceneConfig.type, props);
```

### Step 4: Test Each World

Test all 7 unique worlds to ensure they render correctly:

1. Crystal Heart (`PulsatingOctahedron`)
2. Cosmic Dodecahedron (`SpinningDodecahedron`)
3. Mystic Pyramid (`PyramidTetrahedron`)
4. Vortex Cone (`GlowingCone`)
5. Orbital Pillar (`OrbitingCylinder`)
6. Tesseract Cube (`MorphingBox`)
7. Cosmic Pod (`FloatingCapsule`)

## Database Configuration Structure

The geometries expect this structure from Supabase (which you already have):

```json
{
  "type": "PulsatingOctahedron",  // Maps to registered geometry
  "day": {
    "mainObjectColor": "#FF1493",
    "material": {
      "materialType": "physical",
      "metalness": 0.9,
      "roughness": 0.1,
      "emissive": "#FF69B4",
      "emissiveIntensity": 0.5,
      "clearcoat": 1.0,
      "clearcoatRoughness": 0.05
    },
    "animation": {
      "speed": 1.0,
      "amplitude": 0.2
    },
    "parameters": {
      "scale": 1.5,
      "segments": 0
    },
    "lights": [...],
    "background": {...}
  },
  "night": { ... }
}
```

## Key Features

### ✅ Contract-Based
All geometries implement the same interface, ensuring consistency

### ✅ Data-Driven
Configuration comes from database, logic stays in code

### ✅ Extensible
Add new geometries by:
1. Creating component implementing `GeometryRenderer`
2. Registering with `GeometryRegistry.register()`
3. Adding database entry

### ✅ Type-Safe
Full TypeScript support with proper interfaces

### ✅ Validated
Each geometry validates its configuration and provides helpful errors

### ✅ Feature Flags
- `supportsMotionFreeze` - Can pause animations
- `supportsInteraction` - Can be clicked/dragged
- `complexity` - LOD hint for performance

## Adding New Geometries

### Quick Start

1. **Create geometry file**:

```tsx
// geometries/MyNewGeometry.tsx
import type { GeometryRenderer } from "../GeometryContract";

export const MyNewGeometry: GeometryRenderer = {
    metadata: {
        type: "MyNewType",
        name: "My New Geometry",
        description: "Description here",
        category: "custom",
    },

    render: (props) => {
        // Your Three.js component
        return <mesh>...</mesh>;
    },
};
```

2. **Register it**:

```tsx
// In geometries/index.ts
import { MyNewGeometry } from "./MyNewGeometry";

GeometryRegistry.register({ renderer: MyNewGeometry });
```

3. **Add to database**:

```sql
INSERT INTO worlds (scene_config) VALUES ('{
  "type": "MyNewType",
  ...
}');
```

## Development Tools

### Enable Verbose Logging

```tsx
// In geometries/index.ts
GeometryRegistry.configure({
    verbose: true, // Log all operations
    strict: false, // Don't throw on warnings
    fallbackType: "EnhancedTorusKnot",
});
```

### Check Registration Status

```tsx
// Check if a type is registered
const exists = GeometryRegistry.has("PulsatingOctahedron");

// Get all registered types
const types = GeometryRegistry.getTypes();
console.log("Available geometries:", types);

// Get metadata
const metadata = GeometryRegistry.getMetadata("PulsatingOctahedron");
console.log(metadata);
```

### Statistics

```tsx
const stats = GeometryRegistry.getStats();
// {
//   total: 7,
//   types: ["PulsatingOctahedron", ...],
//   categories: ["platonic", "parametric", "custom"],
//   tags: ["crystal", "spinning", ...]
// }
```

## Migration Path

If you have existing geometry components (like `EnhancedTorusKnot`), you can:

### Option 1: Keep as Fallback
Set them as fallback in registry config:

```tsx
GeometryRegistry.configure({
    fallbackType: "EnhancedTorusKnot",
});
```

### Option 2: Wrap and Register
Create adapters for existing geometries:

```tsx
// TorusKnotGeometry.tsx (adapter)
import EnhancedTorusKnot from "./EnhancedTorusKnot";
import type { GeometryRenderer } from "./GeometryContract";

export const TorusKnotGeometry: GeometryRenderer = {
    metadata: {
        type: "TorusKnot",
        name: "Torus Knot",
        description: "Classic torus knot geometry",
        category: "parametric",
    },

    render: (props) => {
        // Adapt props to existing component
        return <EnhancedTorusKnot {...props} />;
    },
};
```

Then register it normally.

## Testing Checklist

- [ ] All 7 worlds render correctly
- [ ] Day/night theme switching works
- [ ] Motion freeze works (press `.`)
- [ ] Geometries respond to database config
- [ ] Settings panel shows correct geometry type
- [ ] Each world looks visually distinct
- [ ] No console errors
- [ ] Performance is acceptable (60fps)

## Troubleshooting

### Geometry Not Rendering

**Problem**: World shows blank or fallback geometry

**Solutions**:
1. Check console for errors
2. Verify bootstrap imported: `import './components/scene/objects/geometries'`
3. Check registry: `GeometryRegistry.has("YourType")`
4. Enable verbose mode to see registration logs

### TypeScript Errors

**Problem**: Type errors when rendering

**Solutions**:
1. Ensure config matches `GeometryRenderConfig` interface
2. Check all required props are passed to render
3. Verify imports use correct types from `GeometryContract`

### Performance Issues

**Problem**: Low FPS with complex geometries

**Solutions**:
1. Reduce `parameters.segments` in database config
2. Check `complexity` field in geometry metadata
3. Implement LOD based on distance/performance
4. Use `React.memo` for expensive components

## Next Steps

1. ✅ Test in development: `bun run dev`
2. ✅ Verify all 7 worlds render uniquely
3. ✅ Test day/night theme switching
4. ✅ Test motion freeze feature
5. ✅ Check settings panel displays
6. ⏭️ Deploy to production

## Support

- Full documentation: `client/components/scene/objects/geometries/README.md`
- Contract definition: `client/components/scene/objects/GeometryContract.ts`
- Registry API: `client/components/scene/objects/GeometryRegistry.tsx`
- Examples: All geometries in `geometries/` folder
