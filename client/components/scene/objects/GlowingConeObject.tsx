import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Mesh } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface GlowingConeObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const GlowingConeObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: GlowingConeObjectProps) => {
    const meshRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (meshRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && meshRef.current) {
            const time = state.clock.elapsedTime;

            // Spinning vortex effect - cone rotates around its axis
            meshRef.current.rotation.y = time * 1.2;
            meshRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;

            // Pulsing glow effect
            const glowScale = 1 + Math.sin(time * 2.5) * 0.1;
            meshRef.current.scale.set(glowScale, glowScale, glowScale);

            // Vertical oscillation - up and down movement
            meshRef.current.position.y = Math.sin(time * 0.7) * 0.25;
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
            <coneGeometry args={[1.5, 3, 32]} />
            <DynamicMaterial
                color={color}
                materialConfig={materialConfig}
            />
        </mesh>
    );
};

export default GlowingConeObject;
