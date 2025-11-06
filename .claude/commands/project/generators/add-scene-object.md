# Add New Scene Object

Generate a new Three.js scene object with all boilerplate: component, types, registry, and tests.

## What This Does

1. Creates scene object component with Three.js setup
2. Generates TypeScript interfaces
3. Adds object to BackgroundRegistry
4. Creates GUI controls integration
5. Adds animation and material logic
6. Generates basic test file
7. Updates world configuration

## Usage

```bash
/add-scene-object <object-name> [--type basic|animated|shader]
```

Examples:
- `/add-scene-object PulsatingCube` - Basic animated object
- `/add-scene-object FlowingRibbon --type shader` - Custom shader object
- `/add-scene-object OrbitingSpheres --type animated` - Complex animation

## Generated Files

1. **Component File**
   - `client/components/scene/objects/[ObjectName]Object.tsx`
   - React Three Fiber component
   - Geometry and material setup
   - Animation logic
   - Props interface

2. **Type Definitions**
   - Add to `client/types/scene.ts`
   - Geometry type
   - Configuration interface
   - Control parameters

3. **Registry Integration**
   - Update `BackgroundRegistry.tsx`
   - Add object factory
   - Register controls

4. **Test File**
   - `client/components/scene/objects/__tests__/[ObjectName]Object.test.tsx`
   - Basic rendering test
   - Props validation
   - Animation tests

## Template Structure

```tsx
interface [ObjectName]Props {
  config: SceneConfig;
  theme: "day" | "night";
  // ... additional props
}

export default function [ObjectName]Object({ config, theme }: [ObjectName]Props) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // Animation logic
  });

  return (
    <mesh ref={meshRef}>
      <[geometry]Geometry args={[...]} />
      <meshStandardMaterial {...materialProps} />
    </mesh>
  );
}
```

## Integration Steps

1. Generate component and types
2. Add to BackgroundRegistry
3. Create world configuration entry
4. Add to world rotation
5. Test in development
6. Add to documentation

## Customization Options

- Geometry type (box, sphere, torus, custom)
- Material type (standard, physical, shader)
- Animation style (rotation, position, scale, morphing)
- GUI controls (color, size, complexity)
- Performance settings (LOD, instancing)
