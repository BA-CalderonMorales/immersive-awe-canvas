import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface FloatingCapsuleObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const FloatingCapsuleObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: FloatingCapsuleObjectProps) => {
    const meshRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (meshRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && meshRef.current) {
            const time = state.clock.elapsedTime;

            // Capsule floating and rotating like a cosmic pod
            meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.5;
            meshRef.current.rotation.y = time * 0.4;
            meshRef.current.rotation.z = Math.cos(time * 0.25) * 0.3;

            // Breathing effect - expands and contracts
            const breathe = 1 + Math.sin(time * 1.5) * 0.12;
            meshRef.current.scale.setScalar(breathe);

            // Figure-8 floating pattern
            meshRef.current.position.x = Math.sin(time * 0.5) * 0.3;
            meshRef.current.position.y = Math.sin(time * 0.5 * 2) * 0.3;
        }
    });

    const handlePointerEnter = () => {
        setIsHovered(true);
        document.body.style.cursor = isDragEnabled ? "grab" : "pointer";
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
            userData={{ objectId: MAIN_OBJECT_NAME }}
        >
            <capsuleGeometry args={[1, 2, 16, 32]} />
            <DynamicMaterial
                color={color}
                materialConfig={materialConfig}
            />
        </mesh>
    );
};

export default FloatingCapsuleObject;
