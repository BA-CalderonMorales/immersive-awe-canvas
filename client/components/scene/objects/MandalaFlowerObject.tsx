import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { MaterialConfig } from "@/types/scene";

interface MandalaFlowerObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

/**
 * A breathtaking mandala-inspired flower geometry.
 * Uses radial symmetry and golden ratio proportions.
 * Petals arranged in spiraling Fibonacci sequence.
 */
const MandalaFlowerObject = ({
    color,
    isLocked,
    isMotionFrozen,
}: MandalaFlowerObjectProps) => {
    const groupRef = useRef<Group>(null);
    const PHI = (1 + Math.sqrt(5)) / 2;

    // Generate petal positions using golden angle
    const petalData = useMemo(() => {
        const petals = [];
        const numPetals = 21; // Fibonacci number
        const goldenAngle = Math.PI * 2 * (1 - 1 / PHI);
        
        for (let i = 0; i < numPetals; i++) {
            const angle = i * goldenAngle;
            const radius = Math.sqrt(i / numPetals) * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const scale = 1 - (i / numPetals) * 0.5;
            
            petals.push({
                id: `petal-${i}`,
                position: [x, y, 0] as [number, number, number],
                rotation: [0, 0, angle] as [number, number, number],
                scale: scale,
            });
        }
        return petals;
    }, [PHI]);

    useFrame(state => {
        if (groupRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && groupRef.current) {
            const time = state.clock.elapsedTime;
            
            // Slow, mesmerizing rotation
            groupRef.current.rotation.z = time * 0.1;
            
            // Gentle 3D tilt
            groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
            groupRef.current.rotation.y = Math.cos(time * 0.25) * 0.2;
            
            // Breathing effect
            const breathe = 1 + Math.sin(time * 0.5) * 0.05;
            groupRef.current.scale.setScalar(breathe);
        }
    });

    return (
        <group ref={groupRef} name="main-scene-object">
            {/* Central orb - seed of life with inner glow */}
            <mesh>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.2}
                    roughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.8}
                    clearcoat={1}
                    clearcoatRoughness={0}
                    transmission={0.3}
                />
            </mesh>

            {/* Inner ring with luminescence */}
            <mesh>
                <torusGeometry args={[0.5, 0.06, 20, 80]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.7}
                    roughness={0.2}
                    transparent
                    opacity={0.9}
                    emissive={color}
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Petals in Fibonacci spiral with gradient opacity */}
            {petalData.map(petal => (
                <group key={petal.id} position={petal.position} rotation={petal.rotation}>
                    <mesh scale={[petal.scale, petal.scale, petal.scale]}>
                        <boxGeometry args={[0.4, 0.8, 0.08]} />
                        <meshPhysicalMaterial
                            color={color}
                            metalness={0.4}
                            roughness={0.3}
                            transparent
                            opacity={0.7 * petal.scale}
                            emissive={color}
                            emissiveIntensity={0.4 * petal.scale}
                            clearcoat={0.6}
                            clearcoatRoughness={0.2}
                        />
                    </mesh>
                    {/* Petal highlights */}
                    <mesh scale={[petal.scale * 0.9, petal.scale * 0.9, petal.scale * 0.9]}>
                        <boxGeometry args={[0.35, 0.7, 0.06]} />
                        <meshBasicMaterial
                            color={color}
                            transparent
                            opacity={0.3 * petal.scale}
                        />
                    </mesh>
                </group>
            ))}

            {/* Outer ring - unity with shimmer */}
            <mesh>
                <torusGeometry args={[2.5, 0.025, 20, 100]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0}
                    transparent
                    opacity={0.6}
                    emissive={color}
                    emissiveIntensity={0.8}
                />
            </mesh>

            {/* Connecting rays - 8-fold symmetry with glow */}
            {Array.from({ length: 8 }, (_, i) => {
                const angle = (Math.PI * 2 * i) / 8;
                const x = Math.cos(angle) * 2.5;
                const y = Math.sin(angle) * 2.5;
                return (
                    <group key={`ray-group-${i}`}>
                        <mesh
                            position={[x / 2, y / 2, 0]}
                            rotation={[0, 0, angle]}
                        >
                            <boxGeometry args={[0.06, 2.5, 0.06]} />
                            <meshStandardMaterial
                                color={color}
                                metalness={0.8}
                                roughness={0.2}
                                transparent
                                opacity={0.5}
                                emissive={color}
                                emissiveIntensity={0.6}
                            />
                        </mesh>
                        {/* Ray glow */}
                        <mesh
                            position={[x / 2, y / 2, 0]}
                            rotation={[0, 0, angle]}
                        >
                            <boxGeometry args={[0.08, 2.5, 0.08]} />
                            <meshBasicMaterial
                                color={color}
                                transparent
                                opacity={0.15}
                            />
                        </mesh>
                    </group>
                );
            })}
            
            {/* Ambient glow sphere */}
            <mesh>
                <sphereGeometry args={[3, 32, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.05}
                    side={2}
                />
            </mesh>
        </group>
    );
};

export default MandalaFlowerObject;
