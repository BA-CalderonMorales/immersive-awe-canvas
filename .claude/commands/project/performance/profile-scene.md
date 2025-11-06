# Profile Scene Performance

Profile Three.js scene performance with detailed metrics on FPS, render time, and bottlenecks.

## What This Does

1. Adds performance monitoring to scene
2. Measures FPS, frame time, and memory
3. Profiles specific scene components
4. Identifies render bottlenecks
5. Generates performance report
6. Provides optimization recommendations

## Usage

```bash
/profile-scene [component-name] [duration-seconds]
```

Examples:
- `/profile-scene` - Profile entire scene for 10 seconds
- `/profile-scene CrystallineSpire 30` - Profile specific component for 30s

## Metrics Collected

1. **Frame Metrics**
   - Average FPS
   - Frame time (min/max/avg)
   - Frame drops and stuttering
   - Time to interactive

2. **Render Metrics**
   - Draw calls per frame
   - Triangles/vertices rendered
   - Texture memory usage
   - Shader compilation time

3. **Component Metrics**
   - useFrame callback time
   - Component render time
   - Effect hook performance
   - State update frequency

4. **Memory Metrics**
   - Heap size and usage
   - Geometry/material count
   - Texture memory
   - Memory leaks detection

## Performance Targets

- FPS: 60fps (16.67ms per frame)
- Draw calls: < 100 per frame
- Triangles: < 1M per frame
- Memory: < 200MB heap

## Output

1. **Performance Summary**
   - Overall performance grade (A-F)
   - FPS statistics
   - Critical bottlenecks
   - Quick wins for optimization

2. **Detailed Report**
   - Component-by-component breakdown
   - Render pipeline analysis
   - Memory usage graphs
   - Optimization priorities

3. **Code Recommendations**
   - Specific code changes
   - Expected performance gains
   - Implementation difficulty
   - Testing approach

## Integration

Automatically adds PerformanceMonitor component:
```tsx
<PerformanceMonitor onIncline={() => ...} onDecline={() => ...} />
```
