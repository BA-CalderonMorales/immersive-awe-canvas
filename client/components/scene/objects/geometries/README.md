# Geometry Registry System

A contract-based, extensible system for managing 3D geometries in the Immersive Awe Canvas application.

## Overview

The Geometry Registry provides:
- **Contract-based architecture**: All geometries implement `GeometryRenderer` interface
- **Data-driven rendering**: Configuration comes from Supabase database
- **Type-safe**: Full TypeScript support
- **Extensible**: Easy to add new geometries without modifying core code
- **Reusable**: Can be leveraged across multiple components

## Architecture

### Core Components

1. **GeometryContract.ts** - Defines the contract (interface) all geometries must implement
2. **GeometryRegistry.tsx** - Central registry that manages all geometries
3. **geometry implementations** - Individual geometry components
4. **index.ts** - Bootstrap file that registers all geometries

### Contract Interface

```typescript
interface GeometryRenderer {
    metadata: GeometryMetadata;          // Type, name, description
    render: (props) => JSX.Element;      // Render function
    validate?: (config) => string|null;  // Optional validator
    getDefaults?: () => Partial<Config>; // Optional defaults
    transformConfig?: (config) => Config; // Optional transformer
    supportsMotionFreeze?: boolean;      // Feature flags
    supportsInteraction?: boolean;
    complexity?: "low"|"medium"|"high";
}
```

## Usage

### Using the Registry in Components

```tsx
import { GeometryRegistry } from './objects/GeometryRegistry';
import './objects/geometries'; // Auto-registers all geometries

function MyScene({ sceneConfig, theme }) {
    const config = sceneConfig[theme]; // day or night config

    return (
        <Canvas>
            {GeometryRegistry.render(
                sceneConfig.type, // e.g., "PulsatingOctahedron"
                {
                    theme,
                    sceneConfig,
                    config,
                    isMotionFrozen: false,
                }
            )}
        </Canvas>
    );
}
```

### Using the React Component

```tsx
import { GeometryRenderer } from './objects/GeometryRegistry';

function MyScene({ sceneConfig, theme }) {
    return (
        <Canvas>
            <GeometryRenderer
                type={sceneConfig.type}
                theme={theme}
                sceneConfig={sceneConfig}
                config={sceneConfig[theme]}
                isMotionFrozen={false}
                fallback={<DefaultGeometry />}
                onError={(err) => console.error(err)}
            />
        </Canvas>
    );
}
```

## Database Integration

The registry is designed to work with Supabase scene configurations:

```sql
-- worlds table structure
{
  "type": "PulsatingOctahedron",  -- Geometry type (maps to registry)
  "day": {
    "mainObjectColor": "#FF1493",
    "material": {
      "materialType": "physical",
      "metalness": 0.9,
      "roughness": 0.1,
      "emissive": "#FF69B4",
      "emissiveIntensity": 0.5
    },
    "animation": {
      "speed": 1.0,
      "amplitude": 0.2
    },
    "parameters": {
      "scale": 1.5,
      "segments": 0
    }
  },
  "night": { ... }
}
```

### Configuration Flow

1. **Database** → Scene config stored in Supabase `worlds.scene_config`
2. **Parser** → Config parsed and validated
3. **Registry** → `GeometryRegistry.render(type, props)` called
4. **Geometry** → Component receives config, validates, transforms, renders

## Registered Geometries

| Type | Name | Category | Complexity |
|------|------|----------|------------|
| `PulsatingOctahedron` | Pulsating Octahedron | platonic | low |
| `SpinningDodecahedron` | Spinning Dodecahedron | platonic | low |
| `PyramidTetrahedron` | Pyramid Tetrahedron | platonic | medium |
| `GlowingCone` | Glowing Cone | parametric | medium |
| `OrbitingCylinder` | Orbiting Cylinder | parametric | medium |
| `MorphingBox` | Morphing Box (Tesseract) | custom | high |
| `FloatingCapsule` | Floating Capsule | parametric | medium |

## Creating New Geometries

### Step 1: Create Geometry Component

```tsx
// MyCustomGeometry.tsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { GeometryComponentProps, GeometryRenderer } from "../GeometryContract";

const MyCustomComponent = ({
    config,
    isMotionFrozen,
    onClick,
}: GeometryComponentProps) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Extract config (with defaults)
    const {
        mainObjectColor,
        material: materialConfig,
        animation = {},
        parameters = {},
    } = config;

    // Animation
    useFrame((state, delta) => {
        if (!meshRef.current || isMotionFrozen) return;
        // Your animation logic
        meshRef.current.rotation.y += delta;
    });

    // Render
    return (
        <mesh ref={meshRef} onClick={onClick}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={mainObjectColor} {...materialConfig} />
        </mesh>
    );
};

// Export renderer
export const MyCustomGeometry: GeometryRenderer = {
    metadata: {
        type: "MyCustomType",
        name: "My Custom Geometry",
        description: "A custom geometry example",
        category: "custom",
        tags: ["custom", "example"],
        version: "1.0.0",
    },

    render: (props) => <MyCustomComponent {...props} />,

    validate: (config) => {
        if (!config.mainObjectColor) return "mainObjectColor required";
        return null;
    },

    getDefaults: () => ({
        mainObjectColor: "#FFFFFF",
        material: { materialType: "standard" },
    }),

    supportsMotionFreeze: true,
    supportsInteraction: true,
    complexity: "low",
};
```

### Step 2: Register Geometry

```tsx
// In index.ts
import { MyCustomGeometry } from "./MyCustomGeometry";

GeometryRegistry.register({
    renderer: MyCustomGeometry,
    override: false, // Set to true to replace existing
});
```

### Step 3: Add to Database

```sql
INSERT INTO worlds (scene_config) VALUES ('{
  "type": "MyCustomType",
  "day": { ... },
  "night": { ... }
}');
```

## Advanced Features

### Validation

```tsx
validate: (config) => {
    if (!config.mainObjectColor) {
        return "mainObjectColor is required";
    }
    if (config.parameters?.scale && config.parameters.scale > 10) {
        return "scale must be <= 10";
    }
    return null; // Valid
}
```

### Config Transformation

```tsx
transformConfig: (config) => {
    // Normalize colors to uppercase
    return {
        ...config,
        mainObjectColor: config.mainObjectColor.toUpperCase(),
    };
}
```

### Using Hooks

```tsx
import { useGeometryMetadata, useGeometryExists } from './GeometryRegistry';

function MyComponent() {
    const metadata = useGeometryMetadata("PulsatingOctahedron");
    const exists = useGeometryExists("MyCustomType");

    return (
        <div>
            {exists && <p>Found: {metadata?.name}</p>}
        </div>
    );
}
```

### Searching & Filtering

```tsx
// Get all platonic solids
const platonicGeometries = GeometryRegistry.getByCategory("platonic");

// Search by tags
const crystalGeometries = GeometryRegistry.searchByTags(["crystal"]);

// Get all metadata
const allGeometries = GeometryRegistry.getAllMetadata();

// Check if type exists
const hasType = GeometryRegistry.has("PulsatingOctahedron");
```

## Testing

```tsx
import { GeometryRegistry } from './GeometryRegistry';
import { PulsatingOctahedronGeometry } from './geometries/PulsatingOctahedronGeometry';

describe('GeometryRegistry', () => {
    beforeEach(() => {
        GeometryRegistry.clear();
    });

    test('registers geometry', () => {
        const result = GeometryRegistry.register({
            renderer: PulsatingOctahedronGeometry
        });

        expect(result.success).toBe(true);
        expect(GeometryRegistry.has("PulsatingOctahedron")).toBe(true);
    });

    test('validates config', () => {
        GeometryRegistry.register({ renderer: PulsatingOctahedronGeometry });

        const renderer = GeometryRegistry.get("PulsatingOctahedron");
        const error = renderer?.validate?.({} as any);

        expect(error).toBeTruthy(); // Should fail without required fields
    });
});
```

## Performance Considerations

- **LOD (Level of Detail)**: Use `complexity` field to adjust rendering quality
- **Segments**: Control geometry detail via `parameters.segments`
- **Motion Freeze**: Implement `supportsMotionFreeze` to pause animations
- **Memoization**: Geometry components auto-memoize where beneficial

## Best Practices

1. ✅ **Always validate config** - Provide clear error messages
2. ✅ **Provide defaults** - Implement `getDefaults()` for easy testing
3. ✅ **Document parameters** - Use JSDoc comments for config options
4. ✅ **Test edge cases** - Validate with missing/invalid data
5. ✅ **Follow naming** - Use descriptive, database-matching type names
6. ✅ **Support features** - Implement motion freeze and interaction where applicable
7. ✅ **Keep it pure** - No side effects in render functions

## Troubleshooting

### Geometry Not Rendering

1. Check if geometry is registered: `GeometryRegistry.has("YourType")`
2. Enable verbose logging: `GeometryRegistry.configure({ verbose: true })`
3. Check console for validation errors
4. Verify database type matches registered type exactly

### Type Errors

1. Ensure all imports use correct types from `GeometryContract`
2. Check config structure matches `GeometryRenderConfig` interface
3. Verify metadata includes required fields

### Performance Issues

1. Reduce `segments` in parameters
2. Implement LOD based on `complexity`
3. Use `React.memo` for expensive components
4. Check for memory leaks (undisposed geometries)

## Migration from Hardcoded Geometries

If migrating from hardcoded switch statements:

```tsx
// BEFORE (hardcoded)
switch (type) {
    case "PulsatingOctahedron":
        return <PulsatingOctahedron {...props} />;
    case "SpinningDodecahedron":
        return <SpinningDodecahedron {...props} />;
    // ... many more cases
}

// AFTER (registry)
return GeometryRegistry.render(type, props);
```

## Support

- Documentation: This file
- Examples: See existing geometries in `geometries/` folder
- Contract: `GeometryContract.ts`
- Registry API: `GeometryRegistry.tsx`
