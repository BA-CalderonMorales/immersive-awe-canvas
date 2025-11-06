import { useExperience } from "@/hooks/useExperience";
import type { SceneConfig, SceneThemeConfig } from "@/types/scene";
import { GeometryRegistry } from "./objects/GeometryRegistry";
import type { GeometryRenderConfig } from "./objects/GeometryContract";

// Legacy component imports - for backward compatibility with old worlds
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
    const { theme } = useExperience();
    const { mainObjectColor, material } = themeConfig;

    // Transform SceneThemeConfig to GeometryRenderConfig for new registry geometries
    const geometryConfig: GeometryRenderConfig = {
        mainObjectColor: themeConfig.mainObjectColor,
        material: {
            materialType: themeConfig.material.materialType || "standard",
            metalness: themeConfig.material.metalness,
            roughness: themeConfig.material.roughness,
            emissive: themeConfig.material.emissive,
            emissiveIntensity: themeConfig.material.emissiveIntensity,
            clearcoat: themeConfig.material.clearcoat,
            clearcoatRoughness: themeConfig.material.clearcoatRoughness,
            ior: themeConfig.material.ior,
        },
        lights: themeConfig.lights.map(light => ({
            type: light.type,
            intensity: light.intensity,
            position: light.position,
            color: light.color,
            groundColor: light.groundColor,
        })),
        background: {
            type: themeConfig.background.type,
            ...themeConfig.background,
        },
    };

    const sceneConfig: SceneConfig = {
        type,
        day: themeConfig,
        night: themeConfig,
    };

    // Try to render using GeometryRegistry first (for new geometries)
    const registryElement = GeometryRegistry.render(type, {
        theme,
        sceneConfig,
        config: geometryConfig,
        isLocked,
        isMotionFrozen,
    });

    // If registry has this geometry, use it
    if (registryElement) {
        return registryElement;
    }

    // Fallback: Use legacy components for old geometry types
    // This ensures backward compatibility while allowing gradual migration
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
        default:
            console.error(`Unknown geometry type: ${type}`);
            return null;
    }
};

export default DynamicObject;
