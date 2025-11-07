import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import GizmoControls from "./controls/GizmoControls";
import DynamicSceneObject from "./objects/DynamicSceneObject";

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
    const {
        objects,
        selectedObjectId,
        actions,
        isDragEnabled: contextDragEnabled,
    } = useSceneObjectsContext();

    // Use context drag enabled if prop not provided
    const actualDragEnabled = isDragEnabled || contextDragEnabled;

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

            {/* Show gizmo for selected object OR main object when drag mode is enabled */}
            <GizmoControls
                enabled={!!selectedObjectId || actualDragEnabled}
                mode={gizmoMode}
                onDragStateChange={onDragStateChange}
            />
        </>
    );
};

export default ObjectManager;
