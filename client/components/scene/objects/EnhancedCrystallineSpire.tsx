import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { type Group, type InstancedMesh, Matrix4, Vector3 } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import EnhancedGeometryShader from "../effects/EnhancedGeometryShader";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface EnhancedCrystallineSpireProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const EnhancedCrystallineSpire = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: EnhancedCrystallineSpireProps) => {
    const mainGroupRef = useRef<Group>(null!);
    const crystalSwarmRef = useRef<InstancedMesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    // Create instanced crystal swarm for breathtaking effect
    const crystalCount = 2000;
    const crystalPositions = useMemo(() => {
        const positions = [];
        for (let i = 0; i < crystalCount; i++) {
            const radius = 5 + Math.random() * 15;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            positions.push({
                x: radius * Math.sin(phi) * Math.cos(theta),
                y: radius * Math.cos(phi) + (Math.random() - 0.5) * 10,
                z: radius * Math.sin(phi) * Math.sin(theta),
                scale: 0.1 + Math.random() * 0.3,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                phase: Math.random() * Math.PI * 2,
            });
        }
        return positions;
    }, []);

    // Enhanced geometry for main crystal structures
    const enhancedGeometries = useMemo(() => {
        // Create more complex geometries
        const mainCrystal = new THREE.OctahedronGeometry(1, 3);
        const innerCore = new THREE.TetrahedronGeometry(0.6, 2);
        const outerFramework = new THREE.IcosahedronGeometry(1.8, 2);

        // Add custom attributes for enhanced shading
        const addCustomAttributes = (geometry: THREE.BufferGeometry) => {
            const positions = geometry.attributes.position;
            const count = positions.count;

            // Add random values for each vertex
            const randoms = new Float32Array(count);
            const offsets = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                randoms[i] = Math.random();
                offsets[i * 3] = (Math.random() - 0.5) * 0.1;
                offsets[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
                offsets[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
            }

            geometry.setAttribute(
                "random",
                new THREE.BufferAttribute(randoms, 1)
            );
            geometry.setAttribute(
                "offset",
                new THREE.BufferAttribute(offsets, 3)
            );
        };

        addCustomAttributes(mainCrystal);
        addCustomAttributes(innerCore);
        addCustomAttributes(outerFramework);

        return { mainCrystal, innerCore, outerFramework };
    }, []);

    useFrame(state => {
        if (mainGroupRef.current?.userData.isBeingDragged) return;
        if (isLocked) return;
        if (isMotionFrozen) return;

        const time = state.clock.getElapsedTime();

        if (mainGroupRef.current) {
            // Enhanced Fibonacci spiral rotation with golden ratio harmonics
            mainGroupRef.current.rotation.y = time * 0.382; // φ - 1
            mainGroupRef.current.rotation.x = Math.sin(time * 0.618) * 0.15; // φ
            mainGroupRef.current.rotation.z = Math.cos(time * 1.618) * 0.05; // φ²

            // Levitation with multiple harmonics
            const levitation =
                Math.sin(time * 0.8) * 0.1 +
                Math.sin(time * 1.618) * 0.05 +
                Math.sin(time * 2.618) * 0.02;
            mainGroupRef.current.position.y = levitation;

            // Breathing scale with golden ratio timing
            const breathingScale = 1 + Math.sin(time * 0.618) * 0.08;
            mainGroupRef.current.scale.setScalar(breathingScale);
        }

        // Animate crystal swarm
        if (crystalSwarmRef.current) {
            const matrix = new Matrix4();
            const position = new Vector3();

            for (let i = 0; i < crystalCount; i++) {
                const crystal = crystalPositions[i];

                // Orbital motion around main crystal
                const orbitTime = time * crystal.rotationSpeed;
                const orbitRadius = Math.sqrt(
                    crystal.x * crystal.x + crystal.z * crystal.z
                );
                const newX = orbitRadius * Math.cos(orbitTime + crystal.phase);
                const newZ = orbitRadius * Math.sin(orbitTime + crystal.phase);
                const newY =
                    crystal.y + Math.sin(time * 0.5 + crystal.phase) * 0.5;

                position.set(newX, newY, newZ);

                // Scale variation
                const scaleVariation =
                    crystal.scale *
                    (1 + Math.sin(time * 2 + crystal.phase) * 0.2);

                matrix.makeScale(
                    scaleVariation,
                    scaleVariation,
                    scaleVariation
                );
                matrix.setPosition(position);

                crystalSwarmRef.current.setMatrixAt(i, matrix);
            }

            crystalSwarmRef.current.instanceMatrix.needsUpdate = true;
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
            {/* Main crystal with enhanced morphing shader */}
            <EnhancedGeometryShader
                geometry={enhancedGeometries.mainCrystal}
                color={color}
                materialConfig={{
                    ...materialConfig,
                    transparent: true,
                    opacity: 0.85,
                    emissiveIntensity: 0.2,
                }}
                complexity="extreme"
                morphType="crystal"
            />

            {/* Inner core with organic morphing */}
            <EnhancedGeometryShader
                geometry={enhancedGeometries.innerCore}
                color={color}
                materialConfig={{
                    ...materialConfig,
                    transparent: true,
                    opacity: 0.5,
                    emissiveIntensity: 0.3,
                }}
                complexity="high"
                morphType="organic"
            />

            {/* Outer framework with flow morphing */}
            <EnhancedGeometryShader
                geometry={enhancedGeometries.outerFramework}
                color={color}
                materialConfig={{
                    ...materialConfig,
                    transparent: true,
                    opacity: 0.3,
                    emissiveIntensity: 0.1,
                }}
                complexity="medium"
                morphType="flow"
            />

            {/* Instanced crystal swarm */}
            <instancedMesh
                ref={crystalSwarmRef}
                args={[
                    new THREE.TetrahedronGeometry(0.05, 0),
                    undefined,
                    crystalCount,
                ]}
            >
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.6,
                        emissive: color,
                        emissiveIntensity: 0.2,
                    }}
                    color={color}
                />
            </instancedMesh>

            {/* Energy rings with enhanced rotation */}
            {[0, Math.PI / 2, Math.PI].map((rotation, index) => (
                <mesh
                    key={index}
                    rotation={[
                        rotation,
                        rotation === Math.PI / 2 ? 0 : rotation,
                        rotation === Math.PI ? Math.PI / 2 : 0,
                    ]}
                >
                    <torusGeometry args={[1.5 + index * 0.3, 0.03, 12, 64]} />
                    <DynamicMaterial
                        materialConfig={{
                            ...materialConfig,
                            transparent: true,
                            opacity: 0.8 - index * 0.1,
                            emissive: color,
                            emissiveIntensity: 0.3,
                        }}
                        color={color}
                    />
                </mesh>
            ))}

            {/* Wireframe overlay for interaction feedback */}
            {(isDragEnabled || isHovered) && (
                <mesh>
                    <octahedronGeometry args={[1, 2]} />
                    <meshBasicMaterial
                        wireframe
                        color="#ffff00"
                        transparent
                        opacity={0.6}
                    />
                </mesh>
            )}
        </group>
    );
};

export default EnhancedCrystallineSpire;
