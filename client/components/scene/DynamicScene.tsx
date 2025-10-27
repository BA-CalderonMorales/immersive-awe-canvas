import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import type { BackgroundConfig, SceneConfig } from "@/types/scene";
import type { Database } from "@database/supabase/types";
import DynamicWorld from "./DynamicWorld";

type World = Database["public"]["Tables"]["worlds"]["Row"];

interface DynamicSceneProps {
    currentBackground?: { type: string; [key: string]: unknown };
    currentGeometry?: { type: string; [key: string]: unknown };
    worldData?: World; // World with scene_config
    editableSceneConfig?: SceneConfig; // User's modified scene config
    theme: "day" | "night";
    isLocked: boolean;
    isDragEnabled?: boolean;
    isMotionFrozen?: boolean;
    onDragStateChange?: (isDragging: boolean) => void;
}

const DynamicScene = ({
    currentBackground,
    currentGeometry,
    worldData,
    editableSceneConfig,
    theme,
    isLocked,
    isDragEnabled,
    isMotionFrozen,
    onDragStateChange,
}: DynamicSceneProps) => {
    const orbitControlsRef = useRef<any>(null);
    const { isDragging } = useSceneObjectsContext();

    // Update orbit controls based on drag state
    useEffect(() => {
        if (orbitControlsRef.current) {
            orbitControlsRef.current.enabled = !isDragging && !isDragEnabled;
        }
    }, [isDragging, isDragEnabled]);
    const dynamicSceneConfig = useMemo<SceneConfig>(() => {
        // Use editableSceneConfig (user's changes) when available
        if (editableSceneConfig) {
            return editableSceneConfig;
        }

        // Use world scene_config if available (primary source for world-specific scenes)
        if (worldData?.scene_config) {
            try {
                const worldSceneConfig = worldData.scene_config as SceneConfig;
                // Ensure it has the required structure
                if (
                    worldSceneConfig.type &&
                    worldSceneConfig.day &&
                    worldSceneConfig.night
                ) {
                    return worldSceneConfig;
                }
            } catch (error) {
                console.warn(
                    "Invalid world scene_config, falling back to defaults:",
                    error
                );
            }
        }

        // Fallback: Create config from database defaults only when no user config exists
        if (!currentBackground || !currentGeometry) {
            return {
                type: "TorusKnot",
                day: {
                    lights: [{ type: "ambient", intensity: 1 }],
                    material: { materialType: "standard" },
                    background: { type: "void" },
                    mainObjectColor: "#ffffff",
                },
                night: {
                    lights: [{ type: "ambient", intensity: 0.5 }],
                    material: { materialType: "standard" },
                    background: { type: "void" },
                    mainObjectColor: "#ffffff",
                },
            };
        }

        const materialConfig = currentGeometry.material_config || {
            materialType: "standard" as const,
            metalness: 0.3,
            roughness: 0.5,
        };

        const backgroundConfig =
            (currentBackground.background_config as BackgroundConfig) || {
                type: "void",
            };

        // Create a complete scene config from database defaults
        const sceneConfig: SceneConfig = {
            type: (currentGeometry.geometry_type as any) || "TorusKnot",
            day: {
                lights: [
                    { type: "ambient", intensity: 1.5 },
                    {
                        type: "directional",
                        position: [10, 10, 5],
                        intensity: 1,
                    },
                ],
                material: materialConfig,
                background: backgroundConfig,
                mainObjectColor:
                    (currentGeometry.color_day as string) || "#ffffff",
            },
            night: {
                lights: [
                    { type: "ambient", intensity: 0.8 },
                    {
                        type: "directional",
                        position: [10, 10, 5],
                        intensity: 0.5,
                    },
                ],
                material: materialConfig,
                background: backgroundConfig,
                mainObjectColor:
                    (currentGeometry.color_night as string) || "#ffffff",
            },
        };

        return sceneConfig;
    }, [editableSceneConfig, worldData, currentBackground, currentGeometry]);

    return (
        <div className="absolute inset-0">
            <Canvas
                camera={{ position: [0, 0, 12], fov: 75 }}
                className="w-full h-full"
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: false,
                }}
                dpr={[1, 2]}
                performance={{ min: 0.5 }}
            >
                <OrbitControls
                    ref={orbitControlsRef}
                    enabled={!isDragging && !isDragEnabled}
                    enableZoom={true}
                    enablePan={false}
                    enableRotate={!isDragging && !isDragEnabled}
                    enableDamping={true}
                    dampingFactor={0.1}
                    maxDistance={20}
                    minDistance={2}
                    makeDefault
                />
                <DynamicWorld
                    key={String(currentGeometry?.id || 'default')}
                    sceneConfig={dynamicSceneConfig}
                    isLocked={isLocked}
                    isDragEnabled={isDragEnabled}
                    isMotionFrozen={isMotionFrozen}
                    onDragStateChange={onDragStateChange}
                />
            </Canvas>
        </div>
    );
};

export default DynamicScene;
