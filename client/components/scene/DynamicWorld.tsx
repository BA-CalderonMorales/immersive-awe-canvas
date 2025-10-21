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
    const { isDragEnabled: contextDragEnabled } = useSceneObjectsContext();
    const { theme } = useExperience();
    const actualDragEnabled = dragEnabled || contextDragEnabled;

    const themeConfig = theme === "day" ? sceneConfig.day : sceneConfig.night;

    return (
        <>
            <DynamicBackground
                background={themeConfig.background}
                extras={themeConfig.extras}
            />
            <DynamicLights lights={themeConfig.lights} />
            <DynamicObject
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
