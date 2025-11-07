/**
 * Pyramid Tetrahedron Geometry
 *
 * An ancient pyramid radiating mystical power.
 * Used for the "Mystic Pyramid" world from the database.
 *
 * Database Type: "PyramidTetrahedron"
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type {
    GeometryComponentProps,
    GeometryRenderer,
} from "../GeometryContract";

const PyramidTetrahedronComponent = ({
    config,
    isMotionFrozen = false,
    onClick,
}: GeometryComponentProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const timeRef = useRef(0);

    // Extract configuration with defaults
    const {
        mainObjectColor,
        material: materialConfig,
        animation = {},
        parameters = {},
    } = config;

    const animationSpeed = animation.speed ?? 0.5;
    const scale = parameters.scale ?? 2.0;
    const detail = parameters.segments ?? 0;

    // Animation loop
    useFrame((state, delta) => {
        if (isMotionFrozen) return;

        timeRef.current += delta * animationSpeed;

        // Slow rotation around Y axis (mystical hovering)
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.3 * animationSpeed;

            // Gentle floating motion
            meshRef.current.position.y = Math.sin(timeRef.current) * 0.2;
        }

        // Pulsating glow effect
        if (glowRef.current) {
            const pulseScale = 1 + Math.sin(timeRef.current * 2) * 0.1;
            glowRef.current.scale.setScalar(pulseScale);
            glowRef.current.rotation.y = -meshRef.current!.rotation.y * 1.5;
        }
    });

    // Build material from config
    const materialProps = {
        color: mainObjectColor,
        metalness: materialConfig.metalness ?? 0.9,
        roughness: materialConfig.roughness ?? 0.2,
        emissive: materialConfig.emissive ?? mainObjectColor,
        emissiveIntensity: materialConfig.emissiveIntensity ?? 0.5,
    };

    return (
        <group>
            {/* Main pyramid */}
            <mesh
                ref={meshRef}
                onClick={onClick}
                castShadow
                receiveShadow
                scale={scale}
            >
                <tetrahedronGeometry args={[1, detail]} />
                {materialConfig.materialType === "physical" ? (
                    <meshPhysicalMaterial
                        {...materialProps}
                        clearcoat={materialConfig.clearcoat ?? 0.8}
                        clearcoatRoughness={
                            materialConfig.clearcoatRoughness ?? 0.1
                        }
                    />
                ) : (
                    <meshStandardMaterial {...materialProps} />
                )}
            </mesh>

            {/* Mystical glow layer */}
            <mesh ref={glowRef} scale={scale * 1.1}>
                <tetrahedronGeometry args={[1, detail]} />
                <meshBasicMaterial
                    color={materialConfig.emissive ?? mainObjectColor}
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

/**
 * Registry-compatible geometry renderer
 */
export const PyramidTetrahedronGeometry: GeometryRenderer = {
    metadata: {
        type: "PyramidTetrahedron",
        name: "Pyramid Tetrahedron",
        description: "An ancient pyramid radiating mystical power",
        category: "platonic",
        tags: ["pyramid", "tetrahedron", "mystical", "ancient"],
        author: "Immersive Awe Canvas",
        version: "1.0.0",
    },

    render: (props: GeometryComponentProps) => {
        return <PyramidTetrahedronComponent {...props} />;
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
        mainObjectColor: "#FFD700",
        material: {
            materialType: "standard",
            metalness: 0.9,
            roughness: 0.2,
            emissiveIntensity: 0.5,
        },
        animation: {
            speed: 0.5,
        },
        parameters: {
            scale: 2.0,
            segments: 0,
        },
    }),

    supportsMotionFreeze: true,
    supportsInteraction: true,
    complexity: "medium",
};
