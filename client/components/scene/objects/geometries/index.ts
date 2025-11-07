/**
 * Geometry Registry Bootstrap
 *
 * This file registers all available geometries with the GeometryRegistry.
 * Import this file early in your app initialization to ensure all geometries are available.
 *
 * Usage:
 * ```tsx
 * // In your main app file or scene initialization
 * import './components/scene/objects/geometries';
 * ```
 */

import { GeometryRegistry } from "../GeometryRegistry";

// Import all unique geometries
import { PulsatingOctahedronGeometry } from "./PulsatingOctahedronGeometry";
import { SpinningDodecahedronGeometry } from "./SpinningDodecahedronGeometry";
import { PyramidTetrahedronGeometry } from "./PyramidTetrahedronGeometry";
import { GlowingConeGeometry } from "./GlowingConeGeometry";
import { OrbitingCylinderGeometry } from "./OrbitingCylinderGeometry";
import { MorphingBoxGeometry } from "./MorphingBoxGeometry";
import { FloatingCapsuleGeometry } from "./FloatingCapsuleGeometry";

/**
 * Register all geometries
 * This happens automatically when this module is imported
 */
export function registerAllGeometries(): void {
    // Configure registry - quiet mode, legacy types handled by DynamicObject
    GeometryRegistry.configure({
        verbose: false, // Quiet mode - reduces console noise
        strict: false, // Don't throw on warnings
        fallbackType: undefined, // No fallback - DynamicObject handles legacy types
    });

    // Register unique geometries from database
    const geometries = [
        PulsatingOctahedronGeometry,
        SpinningDodecahedronGeometry,
        PyramidTetrahedronGeometry,
        GlowingConeGeometry,
        OrbitingCylinderGeometry,
        MorphingBoxGeometry,
        FloatingCapsuleGeometry,
    ];

    GeometryRegistry.registerMany(geometries);

    // Minimal logging in development only
    if (import.meta.env.DEV) {
        console.log(
            `Geometry Registry: ${geometries.length} new geometries registered`
        );
    }
}

// Auto-register when this module is imported
registerAllGeometries();

/**
 * Re-export geometries for direct use if needed
 */
export {
    PulsatingOctahedronGeometry,
    SpinningDodecahedronGeometry,
    PyramidTetrahedronGeometry,
    GlowingConeGeometry,
    OrbitingCylinderGeometry,
    MorphingBoxGeometry,
    FloatingCapsuleGeometry,
};

/**
 * Re-export registry for external use
 */
export { GeometryRegistry } from "../GeometryRegistry";
