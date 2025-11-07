import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface MorphingBoxObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const MorphingBoxObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: MorphingBoxObjectProps) => {
    const meshRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (meshRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && meshRef.current) {
            const time = state.clock.elapsedTime;

            // Tesseract-like rotation - all axes rotating
            meshRef.current.rotation.x = time * 0.25;
            meshRef.current.rotation.y = time * 0.35;
            meshRef.current.rotation.z = time * 0.15;

            // Morphing between cube and stretched forms
            const morphX = 1 + Math.sin(time * 0.8) * 0.2;
            const morphY = 1 + Math.sin(time * 1.2) * 0.2;
            const morphZ = 1 + Math.sin(time * 1.0) * 0.2;
            meshRef.current.scale.set(morphX, morphY, morphZ);

            // Slow drift motion
            meshRef.current.position.x = Math.sin(time * 0.3) * 0.15;
            meshRef.current.position.y = Math.cos(time * 0.4) * 0.15;
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
            <boxGeometry args={[2, 2, 2, 8, 8, 8]} />
            <DynamicMaterial color={color} materialConfig={materialConfig} />
        </mesh>
    );
};

export default MorphingBoxObject;
