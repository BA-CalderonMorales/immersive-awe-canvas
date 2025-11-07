import type { ThreeEvent } from "@react-three/fiber";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import { useExperience } from "@/hooks/useExperience";
import type { SceneConfig } from "@/types/scene";
import DynamicBackground from "./DynamicBackground";
import DynamicLights from "./DynamicLights";
import DynamicObject from "./DynamicObject";
import ObjectManager from "./ObjectManager";

interface DynamicWorldProps {
    sceneConfig: SceneConfig;
    isLocked: boolean;
    isDragEnabled?: boolean;
    isMotionFrozen?: boolean;
    onDragStateChange?: (isDragging: boolean) => void;
}

const DynamicWorld = ({
    sceneConfig,
    isLocked,
    isDragEnabled: dragEnabled,
    isMotionFrozen,
    onDragStateChange,
}: DynamicWorldProps) => {
    const {
        isDragEnabled: contextDragEnabled,
        actions,
        selectedObjectId,
    } = useSceneObjectsContext();
    const { theme } = useExperience();
    const actualDragEnabled = dragEnabled || contextDragEnabled;

    const themeConfig = theme === "day" ? sceneConfig.day : sceneConfig.night;

    console.log("🌍 DynamicWorld RENDER:", {
        type: sceneConfig.type,
        theme,
        hasLights: themeConfig.lights?.length,
        mainColor: themeConfig.mainObjectColor,
    });

    // Handle clicks on empty space to deselect objects
    const handleBackgroundClick = (e: ThreeEvent<MouseEvent>) => {
        // Only deselect if we have a selected object and clicked on the background
        if (selectedObjectId) {
            e.stopPropagation();
            actions.selectObject(null);
        }
    };

    return (
        <>
            <DynamicBackground
                background={themeConfig.background}
                extras={themeConfig.extras}
            />

            {/* Invisible background mesh to catch clicks for deselection - behind everything */}
            <mesh
                position={[0, 0, -200]}
                onClick={handleBackgroundClick}
                renderOrder={-1}
            >
                <planeGeometry args={[10000, 10000]} />
                <meshBasicMaterial
                    transparent
                    opacity={0}
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>

            <DynamicLights lights={themeConfig.lights} />
            <DynamicObject
                key={sceneConfig.type}
                type={sceneConfig.type}
                themeConfig={themeConfig}
                isLocked={isLocked}
                isMotionFrozen={isMotionFrozen}
            />
            <ObjectManager
                isDragEnabled={actualDragEnabled}
                gizmoMode="translate"
                onDragStateChange={onDragStateChange}
            />
        </>
    );
};

export default DynamicWorld;
