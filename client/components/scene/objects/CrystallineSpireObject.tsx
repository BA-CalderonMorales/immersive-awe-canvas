import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface CrystallineSpireObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const CrystallineSpireObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: CrystallineSpireObjectProps) => {
    const mainGroupRef = useRef<Group>(null!);
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
            {/* Main crystal - octahedron for perfect symmetry */}
            <mesh>
                <octahedronGeometry args={[1, 2]} />
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.8,
                        materialType: "standard",
                    }}
                    color={color}
                />

                {/* Wireframe overlay */}
                {(isDragEnabled || isHovered) && (
                    <mesh>
                        <octahedronGeometry args={[1, 2]} />
                        <meshBasicMaterial
                            wireframe
                            color="#ffff00"
                            transparent
                            opacity={0.5}
                        />
                    </mesh>
                )}
            </mesh>

            {/* Inner core - tetrahedron for sacred geometry */}
            <mesh>
                <tetrahedronGeometry args={[0.6, 1]} />
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.4,
                        materialType: "standard",
                    }}
                    color={color}
                />
            </mesh>

            {/* Outer framework - icosahedron for complexity */}
            <mesh>
                <icosahedronGeometry args={[1.5, 1]} />
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.2,
                        materialType: "standard",
                    }}
                    color={color}
                />
            </mesh>

            {/* Connecting rings - Rule of thirds positioning */}
            <mesh rotation={[0, 0, 0]}>
                <torusGeometry args={[1.2, 0.05, 8, 32]} />
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.7,
                        materialType: "standard",
                    }}
                    color={color}
                />
            </mesh>

            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.2, 0.05, 8, 32]} />
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.7,
                        materialType: "standard",
                    }}
                    color={color}
                />
            </mesh>

            <mesh rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[1.2, 0.05, 8, 32]} />
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.7,
                        materialType: "standard",
                    }}
                    color={color}
                />
            </mesh>
        </group>
    );
};

export default CrystallineSpireObject;
