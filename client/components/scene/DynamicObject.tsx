import type { SceneConfig, SceneThemeConfig } from "@/types/scene";
import CrystallineSpireObject from "./objects/CrystallineSpireObject";
import DistortionSphereObject from "./objects/DistortionSphereObject";
import FibonacciSphereObject from "./objects/FibonacciSphereObject";
import FloatingCapsuleObject from "./objects/FloatingCapsuleObject";
import GlowingConeObject from "./objects/GlowingConeObject";
import JellyTorusObject from "./objects/JellyTorusObject";
import MandalaFlowerObject from "./objects/MandalaFlowerObject";
import MorphingBoxObject from "./objects/MorphingBoxObject";
import MorphingIcosahedronObject from "./objects/MorphingIcosahedronObject";
import OrbitingCylinderObject from "./objects/OrbitingCylinderObject";
import PulsatingOctahedronObject from "./objects/PulsatingOctahedronObject";
import PyramidTetrahedronObject from "./objects/PyramidTetrahedronObject";
import SacredGeometryObject from "./objects/SacredGeometryObject";
import SpinningDodecahedronObject from "./objects/SpinningDodecahedronObject";
import TorusKnotObject from "./objects/TorusKnotObject";
import WavyGridObject from "./objects/WavyGridObject";
import WobbleFieldObject from "./objects/WobbleFieldObject";

interface DynamicObjectProps {
    type: SceneConfig["type"];
    themeConfig: SceneThemeConfig;
    isLocked: boolean;
    isMotionFrozen?: boolean;
}

const DynamicObject = ({
    type,
    themeConfig,
    isLocked,
    isMotionFrozen,
}: DynamicObjectProps) => {
    const { mainObjectColor, material } = themeConfig;

    switch (type) {
        case "TorusKnot":
            return (
                <TorusKnotObject
                    themeConfig={themeConfig}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "WobbleField":
            return (
                <WobbleFieldObject
                    themeConfig={themeConfig}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "CrystallineSpire":
            return (
                <CrystallineSpireObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "DistortionSphere":
            return (
                <DistortionSphereObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "MorphingIcosahedron":
            return (
                <MorphingIcosahedronObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "WavyGrid":
            return (
                <WavyGridObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "JellyTorus":
            return (
                <JellyTorusObject
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "FibonacciSphere":
            return (
                <FibonacciSphereObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "SacredGeometry":
            return (
                <SacredGeometryObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "MandalaFlower":
            return (
                <MandalaFlowerObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "PulsatingOctahedron":
            return (
                <PulsatingOctahedronObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "SpinningDodecahedron":
            return (
                <SpinningDodecahedronObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "PyramidTetrahedron":
            return (
                <PyramidTetrahedronObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "GlowingCone":
            return (
                <GlowingConeObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "OrbitingCylinder":
            return (
                <OrbitingCylinderObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "MorphingBox":
            return (
                <MorphingBoxObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        case "FloatingCapsule":
            return (
                <FloatingCapsuleObject
                    color={mainObjectColor}
                    materialConfig={material}
                    isLocked={isLocked}
                    isMotionFrozen={isMotionFrozen}
                />
            );
        default:
            return null;
    }
};

export default DynamicObject;
