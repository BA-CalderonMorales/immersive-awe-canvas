export interface SceneObject {
    id: string;
    type:
        | "box"
        | "sphere"
        | "cylinder"
        | "cone"
        | "torus"
        | "dodecahedron"
        | "icosahedron"
        | "octahedron"
        | "tetrahedron"
        | "plane"
        | "ring"
        | "torusKnot";
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    color: string;
    material: {
        type: "basic" | "standard" | "physical";
        metalness?: number;
        roughness?: number;
        wireframe?: boolean;
        transparent?: boolean;
        opacity?: number;
    };
    isMainObject?: boolean;
}

export interface ObjectManagerState {
    objects: SceneObject[];
    selectedObjectId: string | null;
    isAddingObject: boolean;
    availableGeometries: {
        type: SceneObject["type"];
        name: string;
        defaultArgs?: unknown[];
    }[];
}

export interface ObjectManagerActions {
    addObject: (type: SceneObject["type"]) => void;
    removeObject: (id: string) => void;
    updateObject: (id: string, updates: Partial<SceneObject>) => void;
    selectObject: (id: string | null) => void;
    clearObjects: () => void;
    toggleAddMode: () => void;
}
