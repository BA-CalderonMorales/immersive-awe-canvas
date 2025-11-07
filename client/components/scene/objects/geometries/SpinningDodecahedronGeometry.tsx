/**
 * Spinning Dodecahedron Geometry
 *
 * A twelve-faced polyhedron spinning through the cosmos.
 * Used for the "Cosmic Dodecahedron" world from the database.
 *
 * Database Type: "SpinningDodecahedron"
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import type {
    GeometryComponentProps,
    GeometryRenderer,
} from "../GeometryContract";

const SpinningDodecahedronComponent = ({
    config,
    isMotionFrozen = false,
    onClick,
}: GeometryComponentProps) => {
    const meshRef = useRef<THREE.Mesh>(null);

    // Extract configuration with defaults
    const {
        mainObjectColor,
        material: materialConfig,
        animation = {},
        parameters = {},
    } = config;

    const animationSpeed = animation.speed ?? 1.0;
    const scale = parameters.scale ?? 1.8;
    const detail = parameters.segments ?? 0;

    // Animation loop
    useFrame((state, delta) => {
        if (!meshRef.current || isMotionFrozen) return;

        // Multi-axis rotation for cosmic spinning effect
        meshRef.current.rotation.x += delta * 0.3 * animationSpeed;
        meshRef.current.rotation.y += delta * 0.5 * animationSpeed;
        meshRef.current.rotation.z += delta * 0.2 * animationSpeed;
    });

    // Build material from config
    const materialProps = {
        color: mainObjectColor,
        metalness: materialConfig.metalness ?? 0.7,
        roughness: materialConfig.roughness ?? 0.3,
        emissive: materialConfig.emissive ?? mainObjectColor,
        emissiveIntensity: materialConfig.emissiveIntensity ?? 0.4,
    };

    return (
        <mesh
            ref={meshRef}
            onClick={onClick}
            castShadow
            receiveShadow
            scale={scale}
        >
            <dodecahedronGeometry args={[1, detail]} />
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
export const SpinningDodecahedronGeometry: GeometryRenderer = {
    metadata: {
        type: "SpinningDodecahedron",
        name: "Spinning Dodecahedron",
        description: "A twelve-faced polyhedron spinning through the cosmos",
        category: "platonic",
        tags: ["dodecahedron", "spinning", "cosmic", "geometric"],
        author: "Immersive Awe Canvas",
        version: "1.0.0",
    },

    render: (props: GeometryComponentProps) => {
        return <SpinningDodecahedronComponent {...props} />;
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
        mainObjectColor: "#00CED1",
        material: {
            materialType: "standard",
            metalness: 0.7,
            roughness: 0.3,
            emissiveIntensity: 0.4,
        },
        animation: {
            speed: 1.0,
        },
        parameters: {
            scale: 1.8,
            segments: 0,
        },
    }),

    supportsMotionFreeze: true,
    supportsInteraction: true,
    complexity: "low",
};
