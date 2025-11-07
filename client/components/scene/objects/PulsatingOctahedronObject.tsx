import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface PulsatingOctahedronObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const PulsatingOctahedronObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: PulsatingOctahedronObjectProps) => {
    const meshRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (meshRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && meshRef.current) {
            const time = state.clock.elapsedTime;

            // Crystalline rotation - octahedron spinning like a diamond
            meshRef.current.rotation.x = time * 0.3;
            meshRef.current.rotation.y = time * 0.5;
            meshRef.current.rotation.z = time * 0.2;

            // Pulsating scale effect - like a beating crystal heart
            const pulseScale = 1 + Math.sin(time * 2) * 0.15;
            meshRef.current.scale.setScalar(pulseScale);

            // Floating motion - up and down
            meshRef.current.position.y = Math.sin(time * 0.8) * 0.3;
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
            <octahedronGeometry args={[2, 0]} />
            <DynamicMaterial color={color} materialConfig={materialConfig} />
        </mesh>
    );
};

export default PulsatingOctahedronObject;
