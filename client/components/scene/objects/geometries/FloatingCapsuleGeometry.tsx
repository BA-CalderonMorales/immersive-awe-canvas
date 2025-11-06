/**
 * Floating Capsule Geometry
 *
 * A mysterious capsule floating through the cosmos.
 * Used for the "Cosmic Pod" world from the database.
 *
 * Database Type: "FloatingCapsule"
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { GeometryComponentProps, GeometryRenderer } from "../GeometryContract";

const FloatingCapsuleComponent = ({
    config,
    isMotionFrozen = false,
    onClick,
}: GeometryComponentProps) => {
    const groupRef = useRef<THREE.Group>(null);
    const capsuleRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const timeRef = useRef(0);

    // Extract configuration with defaults
    const {
        mainObjectColor,
        material: materialConfig,
        animation = {},
        parameters = {},
    } = config;

    const animationSpeed = animation.speed ?? 0.8;
    const floatAmplitude = animation.amplitude ?? 0.3;
    const scale = parameters.scale ?? 1.3;
    const radialSegments = parameters.segments ?? 32;

    // Animation loop
    useFrame((state, delta) => {
        if (isMotionFrozen) return;

        timeRef.current += delta * animationSpeed;

        if (groupRef.current) {
            // Floating motion
            groupRef.current.position.y = Math.sin(timeRef.current) * floatAmplitude;
            groupRef.current.position.x = Math.cos(timeRef.current * 0.7) * (floatAmplitude * 0.5);

            // Gentle rotation
            groupRef.current.rotation.y += delta * 0.3 * animationSpeed;
            groupRef.current.rotation.z = Math.sin(timeRef.current * 0.5) * 0.1;
        }

        if (glowRef.current) {
            // Pulsating glow
            const glowScale = 1 + Math.sin(timeRef.current * 3) * 0.1;
            glowRef.current.scale.setScalar(glowScale);
        }
    });

    // Build material from config
    const materialProps = {
        color: mainObjectColor,
        metalness: materialConfig.metalness ?? 0.8,
        roughness: materialConfig.roughness ?? 0.2,
        emissive: materialConfig.emissive ?? mainObjectColor,
        emissiveIntensity: materialConfig.emissiveIntensity ?? 0.5,
    };

    return (
        <group ref={groupRef}>
            {/* Main capsule */}
            <mesh
                ref={capsuleRef}
                onClick={onClick}
                castShadow
                receiveShadow
                scale={scale}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <capsuleGeometry args={[0.5, 1.5, radialSegments, 8]} />
                {materialConfig.materialType === "physical" ? (
                    <meshPhysicalMaterial
                        {...materialProps}
                        clearcoat={materialConfig.clearcoat ?? 0.7}
                        clearcoatRoughness={materialConfig.clearcoatRoughness ?? 0.2}
                        transmission={materialConfig.transmission ?? 0.5}
                        thickness={materialConfig.thickness ?? 0.8}
                    />
                ) : (
                    <meshStandardMaterial {...materialProps} />
                )}
            </mesh>

            {/* Glow effect */}
            <mesh
                ref={glowRef}
                scale={scale * 1.15}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <capsuleGeometry args={[0.5, 1.5, radialSegments, 8]} />
                <meshBasicMaterial
                    color={materialConfig.emissive ?? mainObjectColor}
                    transparent
                    opacity={0.2}
                    side={THREE.BackSide}
                />
            </mesh>
        </group>
    );
};

/**
 * Registry-compatible geometry renderer
 */
export const FloatingCapsuleGeometry: GeometryRenderer = {
    metadata: {
        type: "FloatingCapsule",
        name: "Floating Capsule",
        description: "A mysterious capsule floating through the cosmos",
        category: "parametric",
        tags: ["capsule", "pod", "floating", "cosmic", "mysterious"],
        author: "Immersive Awe Canvas",
        version: "1.0.0",
    },

    render: (props: GeometryComponentProps) => {
        return <FloatingCapsuleComponent {...props} />;
    },

    validate: (config) => {
        if (!config.mainObjectColor) {
            return "mainObjectColor is required";
        }
        if (!config.material) {
            return "material configuration is required";
        }
        return null;
    },

    getDefaults: () => ({
        mainObjectColor: "#FF69B4",
        material: {
            materialType: "physical",
            metalness: 0.8,
            roughness: 0.2,
            emissiveIntensity: 0.5,
        },
        animation: {
            speed: 0.8,
            amplitude: 0.3,
        },
        parameters: {
            scale: 1.3,
            segments: 32,
        },
    }),

    supportsMotionFreeze: true,
    supportsInteraction: true,
    complexity: "medium",
};
