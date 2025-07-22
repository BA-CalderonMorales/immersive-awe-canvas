import { useRef, useState, useMemo } from "react";
import { MaterialConfig } from "@/types/scene";
import { useFrame } from "@react-three/fiber";
import { Group, TorusKnotGeometry } from "three";
import * as THREE from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import EnhancedGeometryShader from "../effects/EnhancedGeometryShader";

const MAIN_OBJECT_NAME = "main-scene-object";

interface EnhancedTorusKnotProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
    torusKnotConfig?: {
        p?: number;
        q?: number;
        radius?: number;
        tube?: number;
        tubularSegments?: number;
        radialSegments?: number;
    };
}

const EnhancedTorusKnot = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
    torusKnotConfig = {},
}: EnhancedTorusKnotProps) => {
    const mainGroupRef = useRef<Group>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    // Create enhanced torus knot geometry with mathematical beauty
    const enhancedGeometry = useMemo(() => {
        const {
            p = 3, // How many times around its major axis the curve loops
            q = 2, // How many times around its minor axis the curve loops
            radius = 1, // Radius of the torus
            tube = 0.4, // Radius of the tube
            tubularSegments = 200, // Higher resolution for smooth morphing
            radialSegments = 32, // Radial resolution
        } = torusKnotConfig;

        const geometry = new TorusKnotGeometry(
            radius,
            tube,
            tubularSegments,
            radialSegments,
            p,
            q
        );

        // Add custom attributes for enhanced shading
        const positions = geometry.attributes.position;
        const count = positions.count;

        const randoms = new Float32Array(count);
        const offsets = new Float32Array(count * 3);
        const flowDirections = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            randoms[i] = Math.random();

            // Offsets for organic variation
            offsets[i * 3] = (Math.random() - 0.5) * 0.05;
            offsets[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
            offsets[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

            // Flow directions along the knot path
            const pos = new THREE.Vector3(
                positions.getX(i),
                positions.getY(i),
                positions.getZ(i)
            );

            // Calculate tangent direction for flow effect
            const angle = Math.atan2(pos.y, pos.x);
            flowDirections[i * 3] = Math.cos(angle + Math.PI / 2);
            flowDirections[i * 3 + 1] = Math.sin(angle + Math.PI / 2);
            flowDirections[i * 3 + 2] = Math.sin(pos.z * 2) * 0.5;
        }

        geometry.setAttribute("random", new THREE.BufferAttribute(randoms, 1));
        geometry.setAttribute("offset", new THREE.BufferAttribute(offsets, 3));
        geometry.setAttribute(
            "flowDirection",
            new THREE.BufferAttribute(flowDirections, 3)
        );

        return geometry;
    }, [torusKnotConfig]);

    // Create energy trail geometries that follow the knot path
    const energyTrails = useMemo(() => {
        const trails = [];
        const trailCount = 8;

        for (let i = 0; i < trailCount; i++) {
            const phase = (i / trailCount) * Math.PI * 2;
            const trailGeometry = new THREE.SphereGeometry(0.02, 8, 8);
            trails.push({ geometry: trailGeometry, phase });
        }

        return trails;
    }, []);

    useFrame(state => {
        if (mainGroupRef.current?.userData.isBeingDragged) return;
        if (isLocked) return;
        if (isMotionFrozen) return;

        const time = state.clock.getElapsedTime();
        const { p = 3, q = 2 } = torusKnotConfig;

        if (mainGroupRef.current) {
            // Mathematical rotation based on knot parameters
            const rotationSpeed = 0.1;
            mainGroupRef.current.rotation.x =
                time * rotationSpeed * (p / (p + q));
            mainGroupRef.current.rotation.y = time * rotationSpeed;
            mainGroupRef.current.rotation.z =
                time * rotationSpeed * (q / (p + q));

            // Gentle levitation with figure-8 pattern
            const levitationHeight = 0.1;
            const xMotion = Math.sin(time * 0.7) * levitationHeight;
            const yMotion = Math.sin(time * 1.1) * levitationHeight * 0.5;
            const zMotion = Math.cos(time * 0.9) * levitationHeight * 0.3;

            mainGroupRef.current.position.set(xMotion, yMotion, zMotion);

            // Breathing scale effect
            const breathingScale = 1 + Math.sin(time * 0.8) * 0.06;
            mainGroupRef.current.scale.setScalar(breathingScale);
        }
    });

    const handlePointerEnter = () => {
        setIsHovered(true);
        document.body.style.cursor = "pointer";
    };

    const handlePointerLeave = () => {
        setIsHovered(false);
        document.body.style.cursor = "auto";
    };

    return (
        <group
            ref={mainGroupRef}
            name={MAIN_OBJECT_NAME}
            onPointerOver={handlePointerEnter}
            onPointerOut={handlePointerLeave}
        >
            {/* Main torus knot with enhanced morphing */}
            <EnhancedGeometryShader
                geometry={enhancedGeometry}
                color={color}
                materialConfig={{
                    ...materialConfig,
                    transparent: materialConfig.transparent !== false,
                    opacity: materialConfig.opacity || 0.9,
                    emissiveIntensity: 0.15,
                }}
                complexity="extreme"
                morphType="flow"
            />

            {/* Energy core sphere */}
            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <EnhancedGeometryShader
                    geometry={new THREE.SphereGeometry(0.3, 32, 32)}
                    color={color}
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.4,
                        emissiveIntensity: 0.3,
                    }}
                    complexity="high"
                    morphType="organic"
                />
            </mesh>

            {/* Energy trails that follow the knot */}
            {energyTrails.map((trail, index) => (
                <mesh key={index}>
                    <primitive object={trail.geometry} />
                    <meshBasicMaterial
                        color={color}
                        transparent
                        opacity={0.6}
                        blending={THREE.AdditiveBlending}
                    />
                </mesh>
            ))}

            {/* Wireframe overlay for interaction feedback */}
            {(isDragEnabled || isHovered) && (
                <mesh>
                    <primitive object={enhancedGeometry.clone()} />
                    <meshBasicMaterial
                        wireframe
                        color="#ffff00"
                        transparent
                        opacity={0.5}
                    />
                </mesh>
            )}
        </group>
    );
};

export default EnhancedTorusKnot;
