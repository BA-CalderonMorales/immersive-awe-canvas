/**
 * Geometry Registry System
 *
 * A centralized, extensible registry for all 3D geometries in the application.
 * Similar to BackgroundRegistry but specifically for scene objects/geometries.
 *
 * Features:
 * - Contract-based: All geometries must implement GeometryRenderer interface
 * - Data-driven: Configuration comes from Supabase, logic stays in registry
 * - Extensible: Easy to add new geometries without modifying core
 * - Type-safe: Full TypeScript support with proper types
 * - Reusable: Can be used across multiple components
 *
 * Usage:
 * ```tsx
 * // Register a geometry
 * GeometryRegistry.register({
 *   renderer: MyCustomGeometry
 * });
 *
 * // Render a geometry
 * <GeometryRegistry.render
 *   type="PulsatingOctahedron"
 *   theme="day"
 *   sceneConfig={config}
 *   config={dayConfig}
 * />
 * ```
 */

import { useEffect, useState } from "react";
import type {
    GeometryComponentProps,
    GeometryMetadata,
    GeometryRenderer,
    RegisterGeometryOptions,
    RegistryConfig,
    RegistryResult,
} from "./GeometryContract";

/**
 * Core Registry Class
 */
class GeometryRegistryClass {
    private renderers = new Map<string, GeometryRenderer>();
    private config: RegistryConfig = {
        strict: false,
        verbose: false,
        fallbackType: "TorusKnot",
    };

    /**
     * Configure the registry
     */
    configure(config: Partial<RegistryConfig>): this {
        this.config = { ...this.config, ...config };
        return this;
    }

    /**
     * Register a new geometry
     */
    register(options: RegisterGeometryOptions): RegistryResult {
        const { renderer, override = false } = options;
        const type = renderer.metadata.type;

        // Check if already registered
        if (this.renderers.has(type) && !override) {
            const message = `Geometry type "${type}" is already registered. Use override: true to replace.`;
            if (this.config.strict) {
                throw new Error(message);
            }
            if (this.config.verbose) {
                console.warn(message);
            }
            return { success: false, message };
        }

        // Validate metadata
        if (!type || !renderer.metadata.name) {
            const message = "Geometry metadata must include type and name";
            if (this.config.strict) {
                throw new Error(message);
            }
            return { success: false, message };
        }

        // Register the renderer
        this.renderers.set(type, renderer);

        if (this.config.verbose) {
            console.log(
                `✓ Registered geometry: ${type} (${renderer.metadata.name})`
            );
        }

        return { success: true, message: `Registered ${type}` };
    }

    /**
     * Unregister a geometry
     */
    unregister(type: string): RegistryResult {
        if (!this.renderers.has(type)) {
            return {
                success: false,
                message: `Geometry type "${type}" not found`,
            };
        }

        this.renderers.delete(type);

        if (this.config.verbose) {
            console.log(`✗ Unregistered geometry: ${type}`);
        }

        return { success: true, message: `Unregistered ${type}` };
    }

    /**
     * Get a geometry renderer by type
     */
    get(type: string): GeometryRenderer | null {
        const renderer = this.renderers.get(type);

        if (!renderer && this.config.verbose) {
            console.warn(`Geometry type "${type}" not found in registry`);
        }

        return renderer || null;
    }

    /**
     * Check if a geometry type is registered
     */
    has(type: string): boolean {
        return this.renderers.has(type);
    }

    /**
     * Get all registered geometry types
     */
    getTypes(): string[] {
        return Array.from(this.renderers.keys());
    }

    /**
     * Get metadata for all geometries
     */
    getAllMetadata(): GeometryMetadata[] {
        return Array.from(this.renderers.values()).map(r => r.metadata);
    }

    /**
     * Get metadata for a specific geometry
     */
    getMetadata(type: string): GeometryMetadata | null {
        const renderer = this.get(type);
        return renderer?.metadata || null;
    }

    /**
     * Get geometries by category
     */
    getByCategory(category: string): GeometryMetadata[] {
        return this.getAllMetadata().filter(m => m.category === category);
    }

    /**
     * Search geometries by tags
     */
    searchByTags(tags: string[]): GeometryMetadata[] {
        return this.getAllMetadata().filter(m =>
            m.tags?.some(tag => tags.includes(tag))
        );
    }

    /**
     * Render a geometry by type
     * This is the main method used by components
     */
    render(type: string, props: GeometryComponentProps): JSX.Element | null {
        let renderer = this.get(type);

        // Fallback to default if not found
        if (!renderer && this.config.fallbackType) {
            if (this.config.verbose) {
                console.warn(
                    `Using fallback geometry: ${this.config.fallbackType}`
                );
            }
            renderer = this.get(this.config.fallbackType);
        }

        if (!renderer) {
            if (this.config.verbose) {
                console.error(
                    `No renderer or fallback found for type: ${type}`
                );
            }
            return null;
        }

        // Validate configuration if validator exists
        if (renderer.validate) {
            const error = renderer.validate(props.config);
            if (error) {
                if (this.config.strict) {
                    throw new Error(
                        `Configuration validation failed: ${error}`
                    );
                }
                if (this.config.verbose) {
                    console.warn(`Configuration validation warning: ${error}`);
                }
            }
        }

        // Transform configuration if transformer exists
        let config = props.config;
        if (renderer.transformConfig) {
            config = renderer.transformConfig(config);
        }

        // Render the geometry
        return renderer.render({ ...props, config });
    }

    /**
     * Bulk register multiple geometries
     */
    registerMany(geometries: GeometryRenderer[]): RegistryResult[] {
        return geometries.map(renderer => this.register({ renderer }));
    }

    /**
     * Clear all registered geometries (useful for testing)
     */
    clear(): void {
        this.renderers.clear();
        if (this.config.verbose) {
            console.log("Cleared all geometries from registry");
        }
    }

    /**
     * Get registry statistics
     */
    getStats() {
        const metadata = this.getAllMetadata();
        const categories = new Set(
            metadata.map(m => m.category).filter(Boolean)
        );
        const tags = new Set(metadata.flatMap(m => m.tags || []));

        return {
            total: this.renderers.size,
            types: this.getTypes(),
            categories: Array.from(categories),
            tags: Array.from(tags),
        };
    }
}

// Export singleton instance
export const GeometryRegistry = new GeometryRegistryClass();

/**
 * React component for rendering geometries
 * Provides a declarative way to use the registry
 */
interface GeometryRendererComponentProps extends GeometryComponentProps {
    type: string;
    fallback?: JSX.Element;
    onError?: (error: Error) => void;
}

export const GeometryRendererComponent: React.FC<
    GeometryRendererComponentProps
> = ({ type, fallback = null, onError, ...props }) => {
    const [renderError, setRenderError] = useState<Error | null>(null);

    useEffect(() => {
        // Clear error when type changes
        setRenderError(null);
    }, [type]);

    try {
        const element = GeometryRegistry.render(type, props);

        if (!element) {
            const err = new Error(`Failed to render geometry type: ${type}`);
            setRenderError(err);
            onError?.(err);
            return fallback;
        }

        return element;
    } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setRenderError(errorObj);
        onError?.(errorObj);
        return fallback;
    }
};

/**
 * Hook for accessing geometry metadata
 */
export function useGeometryMetadata(type?: string) {
    const [metadata, setMetadata] = useState<
        GeometryMetadata | GeometryMetadata[] | null
    >(null);

    useEffect(() => {
        if (type) {
            setMetadata(GeometryRegistry.getMetadata(type));
        } else {
            setMetadata(GeometryRegistry.getAllMetadata());
        }
    }, [type]);

    return metadata;
}

/**
 * Hook for checking if a geometry type is registered
 */
export function useGeometryExists(type: string) {
    const [exists, setExists] = useState(false);

    useEffect(() => {
        setExists(GeometryRegistry.has(type));
    }, [type]);

    return exists;
}

/**
 * Export types for external use
 */
export type {
    GeometryRenderer as IGeometryRenderer,
    GeometryMetadata as IGeometryMetadata,
    GeometryComponentProps as IGeometryComponentProps,
} from "./GeometryContract";

// Re-export the component with a better name
export { GeometryRendererComponent as GeometryRenderer };
