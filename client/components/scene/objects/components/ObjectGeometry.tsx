import { SceneObject } from "@/types/sceneObjects";

interface ObjectGeometryProps {
    type: SceneObject["type"];
}

const getGeometryArgs = (type: SceneObject["type"]): number[] => {
    switch (type) {
        case "box":
            return [1, 1, 1];
        case "sphere":
            return [0.5, 32, 32];
        case "cylinder":
            return [0.5, 0.5, 1, 32];
        case "cone":
            return [0.5, 1, 32];
        case "torus":
            return [0.4, 0.1, 16, 100];
        case "dodecahedron":
            return [0.5, 0];
        case "icosahedron":
            return [0.5, 0];
        case "octahedron":
            return [0.5, 0];
        case "tetrahedron":
            return [0.5, 0];
        case "plane":
            return [1, 1];
        case "ring":
            return [0.2, 0.5, 32];
        case "torusKnot":
            return [0.4, 0.15, 128, 16];
        default:
            return [1, 1, 1];
    }
};

const ObjectGeometry = ({ type }: ObjectGeometryProps) => {
    const args = getGeometryArgs(type);

    switch (type) {
        case "box":
            return <boxGeometry args={args as [number?, number?, number?]} />;
        case "sphere":
            return (
                <sphereGeometry args={args as [number?, number?, number?]} />
            );
        case "cylinder":
            return (
                <cylinderGeometry
                    args={args as [number?, number?, number?, number?]}
                />
            );
        case "cone":
            return <coneGeometry args={args as [number?, number?, number?]} />;
        case "torus":
            return (
                <torusGeometry
                    args={args as [number?, number?, number?, number?]}
                />
            );
        case "dodecahedron":
            return <dodecahedronGeometry args={args as [number?, number?]} />;
        case "icosahedron":
            return <icosahedronGeometry args={args as [number?, number?]} />;
        case "octahedron":
            return <octahedronGeometry args={args as [number?, number?]} />;
        case "tetrahedron":
            return <tetrahedronGeometry args={args as [number?, number?]} />;
        case "plane":
            return <planeGeometry args={args as [number?, number?]} />;
        case "ring":
            return <ringGeometry args={args as [number?, number?, number?]} />;
        case "torusKnot":
            return (
                <torusKnotGeometry
                    args={args as [number?, number?, number?, number?]}
                />
            );
        default:
            return <boxGeometry args={[1, 1, 1]} />;
    }
};

export default ObjectGeometry;
