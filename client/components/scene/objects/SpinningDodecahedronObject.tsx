import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface SpinningDodecahedronObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const SpinningDodecahedronObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: SpinningDodecahedronObjectProps) => {
    const meshRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (meshRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && meshRef.current) {
            const time = state.clock.elapsedTime;

            // Complex multi-axis rotation for mesmerizing effect
            meshRef.current.rotation.x = time * 0.4;
            meshRef.current.rotation.y = time * 0.35;
            meshRef.current.rotation.z = Math.sin(time * 0.25) * 0.5;

            // Gentle breathing scale
            const breatheScale = 1 + Math.sin(time * 1.5) * 0.08;
            meshRef.current.scale.setScalar(breatheScale);

            // Orbital motion - circular path
            const radius = 0.2;
            meshRef.current.position.x = Math.cos(time * 0.6) * radius;
            meshRef.current.position.z = Math.sin(time * 0.6) * radius;
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
            <dodecahedronGeometry args={[2, 0]} />
            <DynamicMaterial
                color={color}
                materialConfig={materialConfig}
            />
        </mesh>
    );
};

export default SpinningDodecahedronObject;
