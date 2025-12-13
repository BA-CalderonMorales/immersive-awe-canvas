import type { SceneConfig, SceneThemeConfig } from "@/types/scene";
import CrystallineSpireObject from "./objects/CrystallineSpireObject";
import DistortionSphereObject from "./objects/DistortionSphereObject";
import FibonacciSphereObject from "./objects/FibonacciSphereObject";
import JellyTorusObject from "./objects/JellyTorusObject";
import MandalaFlowerObject from "./objects/MandalaFlowerObject";
import MorphingIcosahedronObject from "./objects/MorphingIcosahedronObject";
import SacredGeometryObject from "./objects/SacredGeometryObject";
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
                    color={mainObjectColor}
                    materialConfig={material}
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
        default:
            return null;
    }
};

export default DynamicObject;
