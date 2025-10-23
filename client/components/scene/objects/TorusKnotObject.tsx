import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import type { Group } from "three";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { SceneThemeConfig } from "@/types/scene";
import DynamicMaterial from "../materials/DynamicMaterial";

const MAIN_OBJECT_NAME = "main-scene-object";

interface TorusKnotObjectProps {
    themeConfig: SceneThemeConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const TorusKnotObject = ({
    themeConfig,
    isLocked,
    isMotionFrozen,
}: TorusKnotObjectProps) => {
    const groupRef = useRef<Group>(null);
    const [isHovered, setIsHovered] = useState(false);
    const { isDragEnabled, actions, selectedObjectId } =
        useSceneObjectsContext();

    const isSelected = selectedObjectId === MAIN_OBJECT_NAME;

    useFrame(state => {
        if (isMotionFrozen || !groupRef.current || isLocked) return;

        groupRef.current.rotation.x = state.clock.elapsedTime * 0.2;
        groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
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
        <group
            ref={groupRef}
            name={MAIN_OBJECT_NAME}
            onClick={() => actions.selectObject(MAIN_OBJECT_NAME)}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <mesh>
                <torusKnotGeometry
                    args={[
                        themeConfig.torusKnot?.radius ?? 1,
                        themeConfig.torusKnot?.tube ?? 0.3,
                        themeConfig.torusKnot?.tubularSegments ?? 128,
                        themeConfig.torusKnot?.radialSegments ?? 16,
                        themeConfig.torusKnot?.p ?? 2,
                        themeConfig.torusKnot?.q ?? 3,
                    ]}
                />
                <DynamicMaterial
                    materialConfig={themeConfig.material}
                    color={themeConfig.mainObjectColor}
                />
            </mesh>

            {(isDragEnabled || (isHovered && !isSelected)) && (
                <mesh>
                    <torusKnotGeometry
                        args={[
                            themeConfig.torusKnot?.radius ?? 1,
                            themeConfig.torusKnot?.tube ?? 0.3,
                            themeConfig.torusKnot?.tubularSegments ?? 128,
                            themeConfig.torusKnot?.radialSegments ?? 16,
                            themeConfig.torusKnot?.p ?? 2,
                            themeConfig.torusKnot?.q ?? 3,
                        ]}
                    />
                    <meshBasicMaterial
                        wireframe
                        color={isDragEnabled ? "#00ff00" : "#ffff00"}
                        transparent
                        opacity={isDragEnabled ? 0.5 : 0.3}
                    />
                </mesh>
            )}

            {!isDragEnabled && isSelected && (
                <mesh>
                    <torusKnotGeometry
                        args={[
                            themeConfig.torusKnot?.radius ?? 1,
                            themeConfig.torusKnot?.tube ?? 0.3,
                            themeConfig.torusKnot?.tubularSegments ?? 128,
                            themeConfig.torusKnot?.radialSegments ?? 16,
                            themeConfig.torusKnot?.p ?? 2,
                            themeConfig.torusKnot?.q ?? 3,
                        ]}
                    />
                    <meshBasicMaterial
                        wireframe
                        color="#00ff00"
                        transparent
                        opacity={0.5}
                    />
                </mesh>
            )}
        </group>
    );
};

export default TorusKnotObject;
