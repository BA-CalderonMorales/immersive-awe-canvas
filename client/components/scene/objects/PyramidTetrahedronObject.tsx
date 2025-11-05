import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface PyramidTetrahedronObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const PyramidTetrahedronObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: PyramidTetrahedronObjectProps) => {
    const meshRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (meshRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && meshRef.current) {
            const time = state.clock.elapsedTime;

            // Pyramid spinning on its apex - mystical rotation
            meshRef.current.rotation.x = time * 0.15;
            meshRef.current.rotation.y = time * 0.6;

            // Energy pulsation - like ancient power
            const energyScale = 1 + Math.sin(time * 1.2) * 0.12;
            meshRef.current.scale.setScalar(energyScale);

            // Levitation - slow rise and fall
            meshRef.current.position.y = Math.sin(time * 0.4) * 0.4 + 0.2;
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
            <tetrahedronGeometry args={[2.5, 0]} />
            <DynamicMaterial
                color={color}
                materialConfig={materialConfig}
            />
        </mesh>
    );
};

export default PyramidTetrahedronObject;
