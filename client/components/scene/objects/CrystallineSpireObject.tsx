import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";

const MAIN_OBJECT_NAME = "main-scene-object";

interface CrystallineSpireObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const CrystallineSpireObject = ({
    color,
    isLocked,
    isMotionFrozen,
}: CrystallineSpireObjectProps) => {
    const mainGroupRef = useRef<Group>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (mainGroupRef.current?.userData.isBeingDragged) return;
        if (isLocked) return;
        if (isMotionFrozen) return;

        const time = state.clock.getElapsedTime();

        if (mainGroupRef.current) {
            // Fibonacci spiral rotation - advanced mathematical beauty
            mainGroupRef.current.rotation.y = time * 0.382; // Golden ratio complement
            mainGroupRef.current.rotation.x = Math.sin(time * 0.618) * 0.15; // Golden ratio

            // Subtle levitation with sine wave
            mainGroupRef.current.position.y = Math.sin(time * 0.8) * 0.1;

            // Gentle scale breathing
            const breathingScale = 1 + Math.sin(time * 0.5) * 0.05;
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
            {/* Main crystal - octahedron with glass properties */}
            <mesh>
                <octahedronGeometry args={[1, 3]} />
                <meshPhysicalMaterial
                    color={color}
                    metalness={0.1}
                    roughness={0.05}
                    transparent
                    opacity={0.9}
                    transmission={0.7}
                    thickness={0.6}
                    clearcoat={1}
                    clearcoatRoughness={0.1}
                    emissive={color}
                    emissiveIntensity={0.3}
                />

                {/* Wireframe overlay */}
                {(isDragEnabled || isHovered) && (
                    <mesh>
                        <octahedronGeometry args={[1, 3]} />
                        <meshBasicMaterial
                            wireframe
                            color="#ffff00"
                            transparent
                            opacity={0.5}
                        />
                    </mesh>
                )}
            </mesh>

            {/* Inner core - tetrahedron with energy */}
            <mesh>
                <tetrahedronGeometry args={[0.6, 2]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.8}
                    roughness={0.2}
                    transparent
                    opacity={0.6}
                    emissive={color}
                    emissiveIntensity={0.6}
                />
            </mesh>

            {/* Outer framework - icosahedron for complexity */}
            <mesh>
                <icosahedronGeometry args={[1.5, 1]} />
                <meshStandardMaterial
                    color={color}
                    metalness={0.9}
                    roughness={0.1}
                    transparent
                    opacity={0.3}
                    wireframe
                    emissive={color}
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Connecting rings with metallic sheen */}
            <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[1.2, 0.06, 12, 48]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                    emissive={color}
                    emissiveIntensity={0.5}
                />
            </mesh>

            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.2, 0.06, 12, 48]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                    emissive={color}
                    emissiveIntensity={0.5}
                />
            </mesh>

            <mesh rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[1.2, 0.06, 12, 48]} />
                <meshStandardMaterial
                    color={color}
                    metalness={1}
                    roughness={0.1}
                    transparent
                    opacity={0.8}
                    emissive={color}
                    emissiveIntensity={0.5}
                />
            </mesh>
            
            {/* Energy particles at vertices */}
            {[...Array(8)].map((_, i) => {
                const angle = (Math.PI * 2 * i) / 8;
                const x = Math.cos(angle) * 1.2;
                const z = Math.sin(angle) * 1.2;
                return (
                    <mesh key={`vertex-${i}`} position={[x, 0, z]}>
                        <sphereGeometry args={[0.08, 16, 16]} />
                        <meshBasicMaterial color={color} transparent opacity={0.8} />
                    </mesh>
                );
            })}
        </group>
    );
};

export default CrystallineSpireObject;
