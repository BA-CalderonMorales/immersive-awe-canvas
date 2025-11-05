import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { MaterialConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface OrbitingCylinderObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const OrbitingCylinderObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: OrbitingCylinderObjectProps) => {
    const groupRef = useRef<Group>(null!);
    const meshRef = useRef<Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (meshRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked) {
            const time = state.clock.elapsedTime;

            if (groupRef.current) {
                // Orbital rotation of the entire group
                groupRef.current.rotation.y = time * 0.4;
            }

            if (meshRef.current) {
                // Cylinder spins on its own axis
                meshRef.current.rotation.z = time * 1.5;

                // Wave-like distortion along the cylinder
                const waveScale = 1 + Math.sin(time * 1.8) * 0.08;
                meshRef.current.scale.set(waveScale, 1, waveScale);

                // Tilt animation
                meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.3;
            }
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
        <group ref={groupRef} name={MAIN_OBJECT_NAME}>
            <mesh
                ref={meshRef}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                userData={{ objectId: MAIN_OBJECT_NAME }}
            >
                <cylinderGeometry args={[1, 1, 3, 32]} />
                <DynamicMaterial
                    color={color}
                    materialConfig={materialConfig}
                />
            </mesh>
        </group>
    );
};

export default OrbitingCylinderObject;
