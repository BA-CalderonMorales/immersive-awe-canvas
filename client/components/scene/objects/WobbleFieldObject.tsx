import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, DoubleSide } from "three";
import { MaterialConfig } from "@/types/scene";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface WobbleFieldObjectProps {
    color: string;
    materialConfig: MaterialConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const WobbleFieldObject = ({
    color,
    materialConfig,
    isLocked,
    isMotionFrozen,
}: WobbleFieldObjectProps) => {
    const groupRef = useRef<Group>(null!);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled } = useSceneObjectsContext();

    useFrame(state => {
        if (groupRef.current?.userData.isBeingDragged) return;
        if (isMotionFrozen) return;
        if (!isLocked && groupRef.current) {
            // Subtle morphing rotations - advanced 3D artist technique
            groupRef.current.rotation.x =
                Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
            groupRef.current.rotation.z =
                Math.cos(state.clock.elapsedTime * 0.4) * 0.05;

            // Breathing scale effect with golden ratio pacing
            const breathingScale =
                1 + Math.sin(state.clock.elapsedTime * 0.618) * 0.05;
            groupRef.current.scale.setScalar(breathingScale);
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
            ref={groupRef}
            name={MAIN_OBJECT_NAME}
            onPointerOver={handlePointerEnter}
            onPointerOut={handlePointerLeave}
        >
            {/* Main torus - elegant and simple */}
            <mesh>
                <torusGeometry args={[1, 0.4, 16, 50]} />
                <DynamicMaterial
                    materialConfig={materialConfig}
                    color={color}
                />

                {/* Wireframe overlay - show when drag is enabled or when hovered */}
                {(isDragEnabled || isHovered) && (
                    <mesh>
                        <torusGeometry args={[1, 0.4, 16, 50]} />
                        <meshBasicMaterial
                            wireframe
                            color="#ffff00"
                            transparent
                            opacity={0.5}
                        />
                    </mesh>
                )}
            </mesh>

            {/* Inner sphere with negative space effect */}
            <mesh>
                <sphereGeometry args={[0.6, 32, 32]} />
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.3,
                        materialType: "standard",
                    }}
                    color={color}
                />
            </mesh>

            {/* Outer ring for depth */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1.8, 0.05, 8, 32]} />
                <DynamicMaterial
                    materialConfig={{
                        ...materialConfig,
                        transparent: true,
                        opacity: 0.6,
                        materialType: "standard",
                    }}
                    color={color}
                />
            </mesh>
        </group>
    );
};

export default WobbleFieldObject;
