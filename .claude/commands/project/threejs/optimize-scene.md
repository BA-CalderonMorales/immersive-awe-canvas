# Optimize Three.js Scene Performance

Optimize Three.js scene for 60fps performance by analyzing and improving rendering efficiency.

## What This Does

1. Profiles current scene performance
2. Identifies expensive render operations
3. Optimizes geometry complexity (LOD, instancing)
4. Reviews material shader complexity
5. Implements frustum culling and occlusion
6. Optimizes texture usage and compression
7. Suggests code splitting for large scenes

## Usage

```bash
/optimize-scene [target-fps]
```

Examples:
- `/optimize-scene` - Optimize for 60fps
- `/optimize-scene 120` - Optimize for 120fps

## Optimization Strategies

1. **Geometry Optimization**
   - Merge static geometries
   - Use InstancedMesh for repeated objects
   - Implement LOD (Level of Detail)
   - Reduce polygon count where possible

2. **Material Optimization**
   - Simplify shader complexity
   - Reuse materials where possible
   - Use texture atlases
   - Optimize uniform updates

3. **Rendering Optimization**
   - Implement frustum culling
   - Use render layers selectively
   - Optimize shadow map resolution
   - Reduce post-processing effects

4. **React Optimization**
   - Memoize expensive components
   - Use useMemo for calculations
   - Optimize useFrame callbacks
   - Prevent unnecessary re-renders

## Output

- Performance analysis report
- Specific optimization recommendations
- Code changes with before/after comparisons
- Expected FPS improvements
