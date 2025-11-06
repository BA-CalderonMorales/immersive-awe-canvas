# Debug Three.js Scene

Debug and analyze Three.js scene issues including rendering problems, performance bottlenecks, and material/geometry errors.

## What This Does

1. Analyzes Three.js scene components for common issues
2. Checks for memory leaks (undisposed geometries/materials)
3. Validates shader compilation and WebGL state
4. Reviews React Three Fiber component patterns
5. Identifies performance bottlenecks in animations
6. Checks for proper cleanup in useEffect hooks

## Usage

```bash
/debug-scene [component-name]
```

Examples:
- `/debug-scene` - Debug entire scene
- `/debug-scene CrystallineSpire` - Debug specific component

## Common Issues Checked

- Undisposed geometries/materials causing memory leaks
- Missing cleanup in useFrame/useEffect hooks
- Shader compilation errors
- Inefficient re-renders in React Three Fiber
- WebGL context loss issues
- Z-fighting and depth buffer problems
- Missing or incorrect BufferGeometry attributes

## Steps Performed

1. Search for Three.js components in the specified scope
2. Check for proper disposal patterns
3. Analyze useFrame/useEffect for memory leaks
4. Review material and geometry configurations
5. Check for React Three Fiber best practices
6. Generate diagnostic report with recommendations
