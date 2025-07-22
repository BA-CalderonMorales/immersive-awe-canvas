import { createContext, type ReactNode, useContext, useState } from "react";
import { useSceneObjects } from "@/hooks/useSceneObjects";
import type {
    ObjectManagerActions,
    ObjectManagerState,
    SceneObject,
} from "@/types/sceneObjects";

interface SceneObjectsContextType extends ObjectManagerState {
    actions: ObjectManagerActions;
    selectedObject: SceneObject | null;
    isDragEnabled: boolean;
    isDragging: boolean;
    setIsDragging: (isDragging: boolean) => void;
}

const SceneObjectsContext = createContext<SceneObjectsContextType | null>(null);

interface SceneObjectsProviderProps {
    children: ReactNode;
    mainObjectColor?: string;
    isDragEnabled?: boolean;
}

export const SceneObjectsProvider = ({
    children,
    mainObjectColor = "#ffffff",
    isDragEnabled = false,
}: SceneObjectsProviderProps) => {
    const sceneObjectsData = useSceneObjects(mainObjectColor);
    const [isDragging, setIsDragging] = useState(false);

    return (
        <SceneObjectsContext.Provider
            value={{
                ...sceneObjectsData,
                isDragEnabled,
                isDragging,
                setIsDragging,
            }}
        >
            {children}
        </SceneObjectsContext.Provider>
    );
};

export const useSceneObjectsContext = () => {
    const context = useContext(SceneObjectsContext);
    if (!context) {
        throw new Error(
            "useSceneObjectsContext must be used within a SceneObjectsProvider"
        );
    }
    return context;
};
