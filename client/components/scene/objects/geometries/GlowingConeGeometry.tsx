/**
 * Glowing Cone Geometry
 *
 * A spinning cone generating a powerful energy vortex.
 * Used for the "Vortex Cone" world from the database.
 *
 * Database Type: "GlowingCone"
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type {
    GeometryComponentProps,
    GeometryRenderer,
} from "../GeometryContract";

const GlowingConeComponent = ({
    config,
    isMotionFrozen = false,
    onClick,
}: GeometryComponentProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const trailRefs = useRef<THREE.Mesh[]>([]);
    const timeRef = useRef(0);

    // Extract configuration with defaults
    const {
        mainObjectColor,
        material: materialConfig,
        animation = {},
        parameters = {},
    } = config;

    const animationSpeed = animation.speed ?? 2.0;
    const scale = parameters.scale ?? 1.5;
    const radialSegments = parameters.segments ?? 32;
    const heightSegments = parameters.complexity ?? 1;

    // Animation loop
    useFrame((state, delta) => {
        if (isMotionFrozen) return;

        timeRef.current += delta * animationSpeed;

        if (meshRef.current) {
            // Rapid spin creating vortex effect
            meshRef.current.rotation.y += delta * 3 * animationSpeed;

            // Wobble for energy effect
            meshRef.current.rotation.x = Math.sin(timeRef.current * 2) * 0.1;
            meshRef.current.rotation.z = Math.cos(timeRef.current * 2) * 0.1;
        }

        // Animate trail meshes
        trailRefs.current.forEach((trail, i) => {
            if (trail) {
                trail.rotation.y = meshRef.current!.rotation.y - (i + 1) * 0.3;
                const opacity = 0.3 - i * 0.1;
                if (trail.material instanceof THREE.MeshStandardMaterial) {
                    trail.material.opacity = Math.max(0, opacity);
                }
            }
        });
    });

    // Build material from config
    const materialProps = {
        color: mainObjectColor,
        metalness: materialConfig.metalness ?? 0.5,
        roughness: materialConfig.roughness ?? 0.3,
        emissive: materialConfig.emissive ?? mainObjectColor,
        emissiveIntensity: materialConfig.emissiveIntensity ?? 0.6,
    };

    return (
        <group>
            {/* Main cone */}
            <mesh
                ref={meshRef}
                onClick={onClick}
                castShadow
                receiveShadow
                scale={[scale, scale, scale]}
                rotation={[0, 0, 0]}
            >
                <coneGeometry args={[1, 2, radialSegments, heightSegments]} />
                {materialConfig.materialType === "physical" ? (
                    <meshPhysicalMaterial {...materialProps} />
                ) : (
                    <meshStandardMaterial {...materialProps} />
                )}
            </mesh>

            {/* Vortex trail effect */}
            {[1, 2, 3].map(i => (
                <mesh
                    key={i}
                    ref={el => {
                        if (el) trailRefs.current[i - 1] = el;
                    }}
                    scale={[
                        scale * (1 + i * 0.1),
                        scale * (1 + i * 0.1),
                        scale * (1 + i * 0.1),
                    ]}
                >
                    <coneGeometry
                        args={[1, 2, radialSegments, heightSegments]}
                    />
                    <meshStandardMaterial
                        color={materialConfig.emissive ?? mainObjectColor}
                        transparent
                        opacity={0.3 - i * 0.1}
                        emissive={materialConfig.emissive ?? mainObjectColor}
                        emissiveIntensity={
                            (materialConfig.emissiveIntensity ?? 0.6) * 0.5
                        }
                    />
                </mesh>
            ))}
        </group>
    );
};

/**
 * Registry-compatible geometry renderer
 */
export const GlowingConeGeometry: GeometryRenderer = {
    metadata: {
        type: "GlowingCone",
        name: "Glowing Cone",
        description: "A spinning cone generating a powerful energy vortex",
        category: "parametric",
        tags: ["cone", "vortex", "energy", "glowing", "spinning"],
        author: "Immersive Awe Canvas",
        version: "1.0.0",
    },

    render: (props: GeometryComponentProps) => {
        return <GlowingConeComponent {...props} />;
    },

    validate: config => {
        if (!config.mainObjectColor) {
            return "mainObjectColor is required";
        }
        if (!config.material) {
            return "material configuration is required";
        }
        return null;
    },

    getDefaults: () => ({
        mainObjectColor: "#32CD32",
        material: {
            materialType: "standard",
            metalness: 0.5,
            roughness: 0.3,
            emissiveIntensity: 0.6,
        },
        animation: {
            speed: 2.0,
        },
        parameters: {
            scale: 1.5,
            segments: 32,
            complexity: 1,
        },
    }),

    supportsMotionFreeze: true,
    supportsInteraction: true,
    complexity: "medium",
};
