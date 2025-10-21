import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import type { MaterialConfig } from "@/types/scene";

interface SacredGeometryObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

/**
 * Metatron's Cube inspired sacred geometry.
 * Combines multiple Platonic solids in perfect harmony.
 * Ancient wisdom rendered in modern 3D.
 */
const SacredGeometryObject = ({
    color,
    isLocked,
    isMotionFrozen,
}: SacredGeometryObjectProps) => {
    const groupRef = useRef<Group>(null);

    useFrame(state => {
        if (groupRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && groupRef.current) {
            const time = state.clock.elapsedTime;
            
            // Multiple rotation axes for complex motion
            groupRef.current.rotation.x = time * 0.15;
            groupRef.current.rotation.y = time * 0.234;
            groupRef.current.rotation.z = time * 0.1;
            
            // Gentle levitation
            groupRef.current.position.y = Math.sin(time * 0.7) * 0.15;
        }
    });

    return (
        <group ref={groupRef} name="main-scene-object">
            {/* Central tetrahedron - fire element - blazing core */}
            <mesh>
                <tetrahedronGeometry args={[0.8, 2]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.2}
                    transparent
                    opacity={0.85}
                    emissive={color}
                    emissiveIntensity={0.6}
                    clearcoat={0.8}
                    clearcoatRoughness={0.2}
                />
            </mesh>

            {/* Inner cube - earth element - solid foundation */}
            <mesh>
                <boxGeometry args={[1.1, 1.1, 1.1]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.6}
                    roughness={0.4}
                    transparent
                    opacity={0.4}
                    wireframe
                    emissive={color}
                    emissiveIntensity={0.3}
                />
            </mesh>

            {/* Middle octahedron - air element - ethereal structure */}
            <mesh>
                <octahedronGeometry args={[1.4, 1]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={0.5}
                    wireframe
                    emissive={color}
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Outer icosahedron - water element - flowing energy */}
            <mesh>
                <icosahedronGeometry args={[1.7, 0]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.35}
                    wireframe
                    emissive={color}
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* Outermost dodecahedron - ether/universe - cosmic boundary */}
            <mesh>
                <dodecahedronGeometry args={[2, 0]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0.05}
                    transparent
                    opacity={0.25}
                    wireframe
                    emissive={color}
                    emissiveIntensity={0.6}
                />
            </mesh>

            {/* Connecting vertices - energetic pathways with depth */}
            {Array.from({ length: 6 }, (_, i) => (
                <mesh key={`sacred-ring-${i}`} rotation={[0, (Math.PI * 2 * i) / 6, 0]}>
                    <torusGeometry args={[1.6, 0.02, 16, 64]} />
                    <meshStandardMaterial
                        color={color}
                        metalness={0.9}
                        roughness={0.1}
                        transparent
                        opacity={0.5}
                        emissive={color}
                        emissiveIntensity={0.7}
                    />
                </mesh>
            ))}
            
            {/* Additional depth layers */}
            <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                <torusGeometry args={[1.3, 0.015, 16, 64]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.2}
                />
            </mesh>
        </group>
    );
};

export default SacredGeometryObject;
