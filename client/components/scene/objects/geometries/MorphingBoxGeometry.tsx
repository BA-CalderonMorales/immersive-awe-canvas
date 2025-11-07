/**
 * Morphing Box Geometry
 *
 * A hypercube morphing through dimensional space (Tesseract).
 * Used for the "Tesseract Cube" world from the database.
 *
 * Database Type: "MorphingBox"
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import type {
    GeometryComponentProps,
    GeometryRenderer,
} from "../GeometryContract";

const MorphingBoxComponent = ({
    config,
    isMotionFrozen = false,
    onClick,
}: GeometryComponentProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const innerBoxRef = useRef<THREE.Mesh>(null);
    const timeRef = useRef(0);

    // Extract configuration with defaults
    const {
        mainObjectColor,
        material: materialConfig,
        animation = {},
        parameters = {},
    } = config;

    const animationSpeed = animation.speed ?? 1.0;
    const morphAmplitude = animation.amplitude ?? 0.3;
    const scale = parameters.scale ?? 1.5;

    // Animation loop
    useFrame((state, delta) => {
        if (isMotionFrozen) return;

        timeRef.current += delta * animationSpeed;

        if (meshRef.current) {
            // Morphing scale effect
            const morphX = 1 + Math.sin(timeRef.current * 2) * morphAmplitude;
            const morphY = 1 + Math.cos(timeRef.current * 2.3) * morphAmplitude;
            const morphZ = 1 + Math.sin(timeRef.current * 1.7) * morphAmplitude;
            meshRef.current.scale.set(
                morphX * scale,
                morphY * scale,
                morphZ * scale
            );

            // Multi-dimensional rotation
            meshRef.current.rotation.x += delta * 0.5;
            meshRef.current.rotation.y += delta * 0.7;
            meshRef.current.rotation.z += delta * 0.3;
        }

        if (innerBoxRef.current) {
            // Counter-rotation for hypercube effect
            innerBoxRef.current.rotation.x -= delta * 0.7;
            innerBoxRef.current.rotation.y -= delta * 0.5;
            innerBoxRef.current.rotation.z -= delta * 0.4;
        }
    });

    // Build material from config
    const materialProps = {
        color: mainObjectColor,
        metalness: materialConfig.metalness ?? 0.6,
        roughness: materialConfig.roughness ?? 0.3,
        emissive: materialConfig.emissive ?? mainObjectColor,
        emissiveIntensity: materialConfig.emissiveIntensity ?? 0.5,
    };

    const innerMaterialProps = {
        ...materialProps,
        transparent: true,
        opacity: 0.6,
    };

    return (
        <group>
            {/* Outer box */}
            <mesh ref={meshRef} onClick={onClick} castShadow receiveShadow>
                <boxGeometry args={[1, 1, 1]} />
                {materialConfig.materialType === "physical" ? (
                    <meshPhysicalMaterial
                        {...materialProps}
                        transmission={materialConfig.transmission ?? 0.3}
                        thickness={materialConfig.thickness ?? 0.5}
                    />
                ) : (
                    <meshStandardMaterial {...materialProps} />
                )}
            </mesh>

            {/* Inner box for tesseract effect */}
            <mesh ref={innerBoxRef} scale={0.6}>
                <boxGeometry args={[1, 1, 1]} />
                {materialConfig.materialType === "physical" ? (
                    <meshPhysicalMaterial
                        {...innerMaterialProps}
                        transmission={materialConfig.transmission ?? 0.3}
                        thickness={materialConfig.thickness ?? 0.5}
                    />
                ) : (
                    <meshStandardMaterial {...innerMaterialProps} />
                )}
            </mesh>

            {/* Wireframe overlay for dimensional lines */}
            <mesh ref={meshRef} scale={1.01}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial
                    color={materialConfig.emissive ?? mainObjectColor}
                    wireframe
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    );
};

/**
 * Registry-compatible geometry renderer
 */
export const MorphingBoxGeometry: GeometryRenderer = {
    metadata: {
        type: "MorphingBox",
        name: "Morphing Box (Tesseract)",
        description: "A hypercube morphing through dimensional space",
        category: "custom",
        tags: ["box", "tesseract", "hypercube", "morphing", "4D"],
        author: "Immersive Awe Canvas",
        version: "1.0.0",
    },

    render: (props: GeometryComponentProps) => {
        return <MorphingBoxComponent {...props} />;
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
        mainObjectColor: "#8B008B",
        material: {
            materialType: "standard",
            metalness: 0.6,
            roughness: 0.3,
            emissiveIntensity: 0.5,
        },
        animation: {
            speed: 1.0,
            amplitude: 0.3,
        },
        parameters: {
            scale: 1.5,
        },
    }),

    supportsMotionFreeze: true,
    supportsInteraction: true,
    complexity: "high",
};
