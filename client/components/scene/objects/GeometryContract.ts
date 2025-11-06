/**
 * Geometry Contract - The interface all geometries must implement
 *
 * This contract ensures:
 * 1. All geometries can be rendered consistently
 * 2. Configuration from Supabase database maps cleanly to geometry props
 * 3. New geometries can be added without modifying the registry core
 * 4. Type safety across the entire geometry system
 */

import type { SceneConfig } from "@/types/scene";
import type * as THREE from "three";

/**
 * Configuration that every geometry receives from the database
 * This comes from the scene_config.day or scene_config.night in Supabase
 */
export interface GeometryRenderConfig {
    /** Color for the main object */
    mainObjectColor: string;

    /** Material configuration from database */
    material: {
        materialType: "standard" | "physical" | "basic" | "shader" | "toon" | "lambert" | "phong" | "normal" | "matcap";
        metalness?: number;
        roughness?: number;
        emissive?: string;
        emissiveIntensity?: number;
        clearcoat?: number;
        clearcoatRoughness?: number;
        transmission?: number;
        thickness?: number;
        ior?: number;
        [key: string]: unknown;
    };

    /** Lighting configuration */
    lights: Array<{
        type: string;
        intensity?: number;
        position?: number[];
        color?: string;
        [key: string]: unknown;
    }>;

    /** Background configuration */
    background: {
        type: string;
        [key: string]: unknown;
    };

    /** Optional animation overrides */
    animation?: {
        speed?: number;
        amplitude?: number;
        enabled?: boolean;
        [key: string]: unknown;
    };

    /** Optional geometry-specific parameters */
    parameters?: {
        scale?: number;
        complexity?: number;
        segments?: number;
        orbitRadius?: number;
        [key: string]: unknown;
    };
}

/**
 * Props that every geometry component receives
 */
export interface GeometryComponentProps {
    /** Current theme (day or night) */
    theme: "day" | "night";

    /** Full scene configuration from database */
    sceneConfig: SceneConfig;

    /** Theme-specific render configuration */
    config: GeometryRenderConfig;

    /** Whether the geometry is locked/frozen */
    isLocked?: boolean;

    /** Whether motion/animation is frozen */
    isMotionFrozen?: boolean;

    /** Callback when geometry is clicked */
    onClick?: (event: THREE.Event) => void;

    /** Additional props that might be passed */
    [key: string]: unknown;
}

/**
 * Metadata about a geometry type
 */
export interface GeometryMetadata {
    /** Unique identifier matching database type field */
    type: string;

    /** Human-readable name */
    name: string;

    /** Description of what this geometry represents */
    description: string;

    /** Category for organization */
    category?: "platonic" | "parametric" | "custom" | "primitive";

    /** Tags for search/filtering */
    tags?: string[];

    /** Author/creator information */
    author?: string;

    /** Version for tracking changes */
    version?: string;
}

/**
 * The main contract that all geometries must implement
 */
export interface GeometryRenderer {
    /**
     * Metadata about this geometry
     */
    metadata: GeometryMetadata;

    /**
     * Render function that returns the JSX for this geometry
     * This is where the Three.js component is created
     */
    render: (props: GeometryComponentProps) => JSX.Element;

    /**
     * Optional: Validate configuration before rendering
     * Return error message if invalid, null if valid
     */
    validate?: (config: GeometryRenderConfig) => string | null;

    /**
     * Optional: Get default configuration for this geometry
     * Useful for creating new instances or testing
     */
    getDefaults?: () => Partial<GeometryRenderConfig>;

    /**
     * Optional: Transform database config to component-specific format
     * Use this if your geometry needs to massage the data
     */
    transformConfig?: (config: GeometryRenderConfig) => GeometryRenderConfig;

    /**
     * Optional: Whether this geometry supports animation freeze
     */
    supportsMotionFreeze?: boolean;

    /**
     * Optional: Whether this geometry can be interacted with (clicked, dragged)
     */
    supportsInteraction?: boolean;

    /**
     * Optional: Complexity level (affects LOD, performance settings)
     */
    complexity?: "low" | "medium" | "high";
}

/**
 * Props for registering a new geometry
 */
export interface RegisterGeometryOptions {
    /** The geometry renderer implementation */
    renderer: GeometryRenderer;

    /** Whether to override if type already exists */
    override?: boolean;
}

/**
 * Result of a registry operation
 */
export interface RegistryResult {
    success: boolean;
    message?: string;
    data?: unknown;
}

/**
 * Configuration for the registry itself
 */
export interface RegistryConfig {
    /** Whether to throw errors or return error messages */
    strict?: boolean;

    /** Whether to log operations to console */
    verbose?: boolean;

    /** Fallback geometry type if requested type not found */
    fallbackType?: string;
}
