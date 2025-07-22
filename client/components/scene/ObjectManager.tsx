import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import DynamicSceneObject from "./objects/DynamicSceneObject";
import GizmoControls from "./controls/GizmoControls";

interface ObjectManagerProps {
    isDragEnabled?: boolean;
    gizmoMode?: "translate" | "rotate" | "scale";
    onDragStateChange?: (isDragging: boolean) => void;
}

const ObjectManager = ({
    isDragEnabled = false,
    gizmoMode = "translate",
    onDragStateChange,
}: ObjectManagerProps) => {
    const { objects, selectedObjectId, actions } = useSceneObjectsContext();

    return (
        <>
            {objects.map(object => (
                <DynamicSceneObject
                    key={object.id}
                    object={object}
                    isSelected={object.id === selectedObjectId}
                    onSelect={() => actions.selectObject(object.id)}
                />
            ))}
            {/* Show gizmo for any selected object, including on mobile */}
            <GizmoControls
                enabled={!!selectedObjectId}
                mode={gizmoMode}
                onDragStateChange={onDragStateChange}
            />
        </>
    );
};

export default ObjectManager;
