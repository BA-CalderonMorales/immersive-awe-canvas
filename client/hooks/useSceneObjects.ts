import { useState, useCallback, useEffect } from "react";
import {
    SceneObject,
    ObjectManagerState,
    ObjectManagerActions,
} from "@/types/sceneObjects";
import { toast } from "sonner";

const GEOMETRIES = [
    { type: "box" as const, name: "Box" },
    { type: "sphere" as const, name: "Sphere" },
    { type: "cylinder" as const, name: "Cylinder" },
    { type: "cone" as const, name: "Cone" },
    { type: "torus" as const, name: "Torus" },
];

export const useSceneObjects = (mainObjectColor: string = "#ffffff") => {
    const [state, setState] = useState<ObjectManagerState>({
        objects: [],
        selectedObjectId: null,
        isAddingObject: false,
        availableGeometries: GEOMETRIES,
    });

    // Listen for drag mode disable to clear selection
    useEffect(() => {
        const handleClearSelection = () => {
            setState(prev => ({ ...prev, selectedObjectId: null }));
        };

        window.addEventListener("clearSelection", handleClearSelection);
        return () =>
            window.removeEventListener("clearSelection", handleClearSelection);
    }, []);

    const addObject = useCallback(
        (type: SceneObject["type"]) => {
            const newObject: SceneObject = {
                id: `obj_${Date.now()}`,
                type,
                position: [
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 6,
                ],
                rotation: [0, 0, 0],
                scale: [1, 1, 1],
                color: mainObjectColor,
                material: {
                    type: "standard",
                    metalness: 0.1,
                    roughness: 0.4,
                    wireframe: false,
                    transparent: false,
                    opacity: 1,
                },
            };

            setState(prev => ({
                ...prev,
                objects: [...prev.objects, newObject],
                selectedObjectId: newObject.id,
            }));

            toast.success(`${type} added`);
        },
        [mainObjectColor]
    );

    const removeObject = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            objects: prev.objects.filter(obj => obj.id !== id),
            selectedObjectId:
                prev.selectedObjectId === id ? null : prev.selectedObjectId,
        }));
        toast.success("Object removed");
    }, []);

    const updateObject = useCallback(
        (id: string, updates: Partial<SceneObject>) => {
            console.log("🔄 updateObject called:", { id, updates });
            setState(prev => {
                const updatedObjects = prev.objects.map(obj => {
                    if (obj.id === id) {
                        const updatedObj = { ...obj, ...updates };
                        // Ensure arrays are properly cloned for React to detect changes
                        if (updates.position) {
                            updatedObj.position = [...updates.position] as [
                                number,
                                number,
                                number,
                            ];
                        }
                        if (updates.rotation) {
                            updatedObj.rotation = [...updates.rotation] as [
                                number,
                                number,
                                number,
                            ];
                        }
                        if (updates.scale) {
                            updatedObj.scale = [...updates.scale] as [
                                number,
                                number,
                                number,
                            ];
                        }
                        console.log("🔄 Object updated:", {
                            old: obj,
                            new: updatedObj,
                        });
                        return updatedObj;
                    }
                    return obj;
                });

                return {
                    ...prev,
                    objects: updatedObjects,
                };
            });
        },
        []
    );

    const selectObject = useCallback((id: string | null) => {
        setState(prev => ({ ...prev, selectedObjectId: id }));
    }, []);

    const clearObjects = useCallback(() => {
        setState(prev => ({ ...prev, objects: [], selectedObjectId: null }));
        toast.success("All objects cleared");
    }, []);

    const actions: ObjectManagerActions = {
        addObject,
        removeObject,
        updateObject,
        selectObject,
        clearObjects,
        toggleAddMode: () => {}, // Simplified - no longer needed
    };

    return {
        ...state,
        actions,
        selectedObject:
            state.objects.find(obj => obj.id === state.selectedObjectId) ||
            null,
    };
};
