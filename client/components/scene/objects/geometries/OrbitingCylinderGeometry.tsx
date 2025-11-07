/**
 * Orbiting Cylinder Geometry
 *
 * A cylindrical pillar in eternal cosmic orbit.
 * Used for the "Orbital Pillar" world from the database.
 *
 * Database Type: "OrbitingCylinder"
 */

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type {
    GeometryComponentProps,
    GeometryRenderer,
} from "../GeometryContract";

const OrbitingCylinderComponent = ({
    config,
    isMotionFrozen = false,
    onClick,
}: GeometryComponentProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const orbitRef = useRef<THREE.Group>(null);
    const timeRef = useRef(0);

    // Extract configuration with defaults
    const {
        mainObjectColor,
        material: materialConfig,
        animation = {},
        parameters = {},
    } = config;

    const animationSpeed = animation.speed ?? 1.0;
    const orbitRadius = (parameters.orbitRadius as number) ?? 2;
    const scale = parameters.scale ?? 1.2;
    const radialSegments = parameters.segments ?? 32;

    // Animation loop
    useFrame((state, delta) => {
        if (isMotionFrozen) return;

        timeRef.current += delta * animationSpeed;

        // Orbital motion around center
        if (orbitRef.current) {
            orbitRef.current.rotation.y += delta * 0.5 * animationSpeed;
        }

        // Self rotation
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 1.5 * animationSpeed;
        }
    });

    // Build material from config
    const materialProps = {
        color: mainObjectColor,
        metalness: materialConfig.metalness ?? 0.7,
        roughness: materialConfig.roughness ?? 0.2,
        emissive: materialConfig.emissive ?? mainObjectColor,
        emissiveIntensity: materialConfig.emissiveIntensity ?? 0.4,
    };

    return (
        <group ref={orbitRef}>
            <mesh
                ref={meshRef}
                position={[orbitRadius, 0, 0]}
                onClick={onClick}
                castShadow
                receiveShadow
                scale={scale}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <cylinderGeometry args={[0.5, 0.5, 2, radialSegments]} />
                {materialConfig.materialType === "physical" ? (
                    <meshPhysicalMaterial
                        {...materialProps}
                        clearcoat={materialConfig.clearcoat ?? 0.9}
                        clearcoatRoughness={
                            materialConfig.clearcoatRoughness ?? 0.05
                        }
                    />
                ) : (
                    <meshStandardMaterial {...materialProps} />
                )}
            </mesh>

            {/* Orbit path indicator */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry
                    args={[orbitRadius - 0.05, orbitRadius + 0.05, 64]}
                />
                <meshBasicMaterial
                    color={materialConfig.emissive ?? mainObjectColor}
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

/**
 * Registry-compatible geometry renderer
 */
export const OrbitingCylinderGeometry: GeometryRenderer = {
    metadata: {
        type: "OrbitingCylinder",
        name: "Orbiting Cylinder",
        description: "A cylindrical pillar in eternal cosmic orbit",
        category: "parametric",
        tags: ["cylinder", "orbiting", "cosmic", "pillar"],
        author: "Immersive Awe Canvas",
        version: "1.0.0",
    },

    render: (props: GeometryComponentProps) => {
        return <OrbitingCylinderComponent {...props} />;
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
        mainObjectColor: "#FF8C00",
        material: {
            materialType: "standard",
            metalness: 0.7,
            roughness: 0.2,
            emissiveIntensity: 0.4,
        },
        animation: {
            speed: 1.0,
        },
        parameters: {
            scale: 1.2,
            segments: 32,
            orbitRadius: 2,
        },
    }),

    supportsMotionFreeze: true,
    supportsInteraction: true,
    complexity: "medium",
};
