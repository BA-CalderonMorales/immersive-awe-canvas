import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, Vector3 } from "three";
import * as THREE from "three";
import type { MaterialConfig } from "@/types/scene";

interface FibonacciSphereObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

/**
 * A stunning sphere created using Fibonacci spiral distribution.
 * Points are distributed using the golden angle for natural, organic beauty.
 * Mathematical elegance meets visual poetry.
 */
const FibonacciSphereObject = ({
    color,
    isLocked,
    isMotionFrozen,
}: FibonacciSphereObjectProps) => {
    const groupRef = useRef<Group>(null);
    const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const NUM_POINTS = 1000;

    // Generate Fibonacci sphere points
    const points = useMemo(() => {
        const pts: Vector3[] = [];
        const goldenAngle = Math.PI * 2 * (1 - 1 / PHI);
        for (let i = 0; i < NUM_POINTS; i++) {
            const y = 1 - (i / (NUM_POINTS - 1)) * 2;
            const radius = Math.sqrt(1 - y * y);
            const theta = goldenAngle * i;
            const x = Math.cos(theta) * radius;
            const z = Math.sin(theta) * radius;
            pts.push(new THREE.Vector3(x * 2, y * 2, z * 2));
        }
        return pts;
    }, [PHI]);

    useFrame(state => {
        if (groupRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && groupRef.current) {
            const time = state.clock.elapsedTime;
            
            // Phi-based rotation for natural harmony
            groupRef.current.rotation.y = time * 0.382;
            groupRef.current.rotation.x = Math.sin(time * 0.618) * 0.2;
            
            // Subtle breathing
            const scale = 1 + Math.sin(time * 0.5) * 0.03;
            groupRef.current.scale.setScalar(scale);
        }
    });

    return (
        <group ref={groupRef} name="main-scene-object">
            {/* Central luminous core with glass-like quality */}
            <mesh>
                <sphereGeometry args={[0.8, 64, 64]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.1}
                    roughness={0.05}
                    transmission={0.95}
                    thickness={0.8}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    transparent
                    opacity={0.9}
                    emissive={color}
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Fibonacci point field with distance-based opacity */}
            {points.map((point, i) => {
                const distance = Math.sqrt(point.x * point.x + point.y * point.y + point.z * point.z);
                const size = 0.015 + (1 - distance / 2) * 0.015;
                const opacity = 0.5 + (1 - distance / 2) * 0.4;
                
                return (
                    <mesh key={`fib-point-${i}-${point.x}-${point.y}`} position={point}>
                        <sphereGeometry args={[size, 8, 8]} />
                        <meshStandardMaterial
                            color={color}
                            emissive={color}
                            emissiveIntensity={0.6}
                            transparent
                            opacity={opacity}
                            metalness={0.8}
                            roughness={0.2}
                        />
                    </mesh>
                );
            })}

            {/* Multiple energy rings for depth */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.2, 0.015, 16, 100]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.6}
                    metalness={1}
                    roughness={0.1}
                />
            </mesh>
            
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[2.5, 0.01, 16, 100]} />
                <meshStandardMaterial
                    color={color}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.3}
                />
            </mesh>
            
            {/* Inner glow sphere */}
            <mesh>
                <sphereGeometry args={[0.6, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.15}
                />
            </mesh>
        </group>
    );
};

export default FibonacciSphereObject;
