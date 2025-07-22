import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import { MaterialConfig } from "@/types/scene";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface MorphingIcosahedronObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const MorphingIcosahedronObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: MorphingIcosahedronObjectProps) => {
    const meshRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (meshRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && meshRef.current) {
            // Phi-based rotation using golden ratio for natural harmony
            const phi = 1.618; // Golden ratio
            const time = state.clock.elapsedTime;

            meshRef.current.rotation.x = time * (0.2 / phi);
            meshRef.current.rotation.y = time * (0.3 / phi);
            meshRef.current.rotation.z = time * (0.1 / phi);

            // Morphing scale effect - breathes with Fibonacci sequence timing
            const morphScale = 1 + Math.sin(time * 0.618) * 0.08; // 0.618 = 1/phi
            meshRef.current.scale.setScalar(morphScale);

            // Subtle position oscillation
            meshRef.current.position.y = Math.sin(time * 0.5) * 0.05;
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
        <mesh
            ref={meshRef}
            name={MAIN_OBJECT_NAME}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <icosahedronGeometry args={[1, 1]} />
            <DynamicMaterial materialConfig={materialConfig} color={color} />

            {/* Wireframe overlay - show when drag is enabled or when hovered */}
            {(isDragEnabled || isHovered) && (
                <mesh>
                    <icosahedronGeometry args={[1, 1]} />
                    <meshBasicMaterial
                        wireframe
                        color="#ffff00"
                        transparent
                        opacity={0.5}
                    />
                </mesh>
            )}
        </mesh>
    );
};

export default MorphingIcosahedronObject;
