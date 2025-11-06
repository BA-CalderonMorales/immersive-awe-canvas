/**
 * Pulsating Octahedron Geometry
 *
 * A crystalline octahedron that pulsates with cosmic energy.
 * Used for the "Crystal Heart" world from the database.
 *
 * Database Type: "PulsatingOctahedron"
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import type { GeometryComponentProps, GeometryRenderer } from "../GeometryContract";

const PulsatingOctahedronComponent = ({
    config,
    isMotionFrozen = false,
    onClick,
}: GeometryComponentProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const timeRef = useRef(0);

    // Extract configuration with defaults
    const {
        mainObjectColor,
        material: materialConfig,
        animation = {},
        parameters = {},
    } = config;

    const animationSpeed = animation.speed ?? 1.0;
    const animationAmplitude = animation.amplitude ?? 0.2;
    const scale = parameters.scale ?? 1.5;
    const detail = parameters.segments ?? 0;

    // Animation loop
    useFrame((state, delta) => {
        if (!meshRef.current || isMotionFrozen) return;

        timeRef.current += delta * animationSpeed;

        // Pulsating scale animation
        const pulseScale = 1 + Math.sin(timeRef.current * 2) * animationAmplitude;
        meshRef.current.scale.setScalar(scale * pulseScale);

        // Gentle rotation
        meshRef.current.rotation.y += delta * 0.5;
        meshRef.current.rotation.x += delta * 0.2;
    });

    // Build material from config
    const materialProps = {
        color: mainObjectColor,
        metalness: materialConfig.metalness ?? 0.9,
        roughness: materialConfig.roughness ?? 0.1,
        emissive: materialConfig.emissive ?? mainObjectColor,
        emissiveIntensity: materialConfig.emissiveIntensity ?? 0.5,
        ...(materialConfig.clearcoat !== undefined && {
            clearcoat: materialConfig.clearcoat,
        }),
        ...(materialConfig.clearcoatRoughness !== undefined && {
            clearcoatRoughness: materialConfig.clearcoatRoughness,
        }),
    };

    return (
        <mesh ref={meshRef} onClick={onClick} castShadow receiveShadow>
            <octahedronGeometry args={[1, detail]} />
            {materialConfig.materialType === "physical" ? (
                <meshPhysicalMaterial {...materialProps} />
            ) : (
                <meshStandardMaterial {...materialProps} />
            )}
        </mesh>
    );
};

/**
 * Registry-compatible geometry renderer
 */
export const PulsatingOctahedronGeometry: GeometryRenderer = {
    metadata: {
        type: "PulsatingOctahedron",
        name: "Pulsating Octahedron",
        description: "A crystalline octahedron pulsating with cosmic energy",
        category: "platonic",
        tags: ["crystal", "pulsating", "octahedron", "geometric"],
        author: "Immersive Awe Canvas",
        version: "1.0.0",
    },

    render: (props: GeometryComponentProps) => {
        return <PulsatingOctahedronComponent {...props} />;
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
        mainObjectColor: "#FF1493",
        material: {
            materialType: "physical",
            metalness: 0.9,
            roughness: 0.1,
            emissiveIntensity: 0.5,
        },
        animation: {
            speed: 1.0,
            amplitude: 0.2,
        },
        parameters: {
            scale: 1.5,
            segments: 0,
        },
    }),

    supportsMotionFreeze: true,
    supportsInteraction: true,
    complexity: "low",
};
