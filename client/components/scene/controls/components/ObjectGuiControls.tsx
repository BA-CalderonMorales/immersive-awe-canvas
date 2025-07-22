import { useEffect, useRef } from "react";
import GUI from "lil-gui";
import { SceneObject } from "@/types/sceneObjects";
import { useExperience } from "@/hooks/useExperience";
import ColorInput from "@/components/ui/color-input";

interface ObjectGuiControlsProps {
    object: SceneObject;
    onUpdate: (updates: Partial<SceneObject>) => void;
}

const ObjectGuiControls = ({ object, onUpdate }: ObjectGuiControlsProps) => {
    const guiContainerRef = useRef<HTMLDivElement>(null);
    const guiRef = useRef<GUI | null>(null);
    const { theme } = useExperience();

    useEffect(() => {
        if (!guiContainerRef.current) return;

        if (guiRef.current) {
            guiRef.current.destroy();
        }

        const gui = new GUI({
            container: guiContainerRef.current,
            title: `${object.type.charAt(0).toUpperCase() + object.type.slice(1)} Properties`,
            autoPlace: false,
            width: Math.min(400, guiContainerRef.current.clientWidth - 32), // Responsive width with padding
        });
        guiRef.current = gui;

        // Apply theme class to the GUI element
        const guiElement = gui.domElement;
        guiElement.setAttribute("data-theme", theme);
        guiElement.classList.add(`theme-${theme}`);

        // CRITICAL FIX: Position controls with enhanced reactive proxy and immediate 3D updates
        const positionFolder = gui.addFolder("🎯 Position");
        const positionProxy = {
            x: object.position[0],
            y: object.position[1],
            z: object.position[2],
        };

        // Sync proxy with object changes to prevent GUI desync
        const syncProxies = () => {
            positionProxy.x = object.position[0];
            positionProxy.y = object.position[1];
            positionProxy.z = object.position[2];
            rotationProxy.x = object.rotation[0];
            rotationProxy.y = object.rotation[1];
            rotationProxy.z = object.rotation[2];
            uniformScale.value = object.scale[0];
            colorProxy.color = object.color;
            Object.assign(materialProxy, object.material);
        };

        // Remove duplicate controls - they are created below with controller references

        // CRITICAL FIX: Rotation controls with enhanced reactive proxy and immediate 3D updates
        const rotationFolder = gui.addFolder("🔄 Rotation");
        const rotationProxy = {
            x: object.rotation[0],
            y: object.rotation[1],
            z: object.rotation[2],
        };

        // CRITICAL FIX: Scale controls with enhanced UX and immediate 3D updates
        const scaleFolder = gui.addFolder("📏 Scale");
        const uniformScale = { value: object.scale[0] };

        // CRITICAL FIX: Material controls with enhanced reactive proxy and immediate 3D updates
        const materialFolder = gui.addFolder("🎨 Material");
        const colorProxy = { color: object.color };
        const materialProxy = { ...object.material };

        // Initialize proxy sync
        syncProxies();

        // Store controllers for external updates
        const controllers = {
            positionX: null as any,
            positionY: null as any,
            positionZ: null as any,
            rotationX: null as any,
            rotationY: null as any,
            rotationZ: null as any,
            scale: null as any,
            color: null as any,
            metalness: null as any,
            roughness: null as any,
            opacity: null as any,
        };

        controllers.positionX = positionFolder
            .add(positionProxy, "x", -10, 10, 0.01)
            .name("X Position")
            .onChange((value: number) => {
                console.log(
                    "🎯 GUI Position X changed:",
                    value,
                    "proxy:",
                    positionProxy
                );
                positionProxy.x = value;
                const newPosition = [value, positionProxy.y, positionProxy.z];
                console.log("🎯 Calling onUpdate with position:", newPosition);
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    position: newPosition as [number, number, number],
                });
            });
        controllers.positionY = positionFolder
            .add(positionProxy, "y", -10, 10, 0.01)
            .name("Y Position")
            .onChange((value: number) => {
                positionProxy.y = value;
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    position: [positionProxy.x, value, positionProxy.z],
                });
            });
        controllers.positionZ = positionFolder
            .add(positionProxy, "z", -10, 10, 0.01)
            .name("Z Position")
            .onChange((value: number) => {
                positionProxy.z = value;
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    position: [positionProxy.x, positionProxy.y, value],
                });
            });

        controllers.rotationX = rotationFolder
            .add(rotationProxy, "x", 0, Math.PI * 2, 0.01)
            .name("X Rotation")
            .onChange((value: number) => {
                rotationProxy.x = value;
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    rotation: [value, rotationProxy.y, rotationProxy.z],
                });
            });
        controllers.rotationY = rotationFolder
            .add(rotationProxy, "y", 0, Math.PI * 2, 0.01)
            .name("Y Rotation")
            .onChange((value: number) => {
                rotationProxy.y = value;
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    rotation: [rotationProxy.x, value, rotationProxy.z],
                });
            });
        controllers.rotationZ = rotationFolder
            .add(rotationProxy, "z", 0, Math.PI * 2, 0.01)
            .name("Z Rotation")
            .onChange((value: number) => {
                rotationProxy.z = value;
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    rotation: [rotationProxy.x, rotationProxy.y, value],
                });
            });

        controllers.scale = scaleFolder
            .add(uniformScale, "value", 0.1, 5, 0.01)
            .name("Uniform Scale")
            .onChange((value: number) => {
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    scale: [value, value, value],
                });
            });

        controllers.color = materialFolder
            .addColor(colorProxy, "color")
            .name("Object Color")
            .onChange((value: string) => {
                colorProxy.color = value;
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    color: value,
                });
            });

        if (object.material.metalness !== undefined) {
            controllers.metalness = materialFolder
                .add(materialProxy, "metalness", 0, 1, 0.01)
                .name("Metalness")
                .onChange((value: number) => {
                    materialProxy.metalness = value;
                    // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                    onUpdate({
                        material: { ...materialProxy, metalness: value },
                    });
                });
        }

        if (object.material.roughness !== undefined) {
            controllers.roughness = materialFolder
                .add(materialProxy, "roughness", 0, 1, 0.01)
                .name("Roughness")
                .onChange((value: number) => {
                    materialProxy.roughness = value;
                    // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                    onUpdate({
                        material: { ...materialProxy, roughness: value },
                    });
                });
        }

        controllers.opacity = materialFolder
            .add(materialProxy, "opacity", 0, 1, 0.01)
            .name("Opacity")
            .onChange((value: number) => {
                materialProxy.opacity = value;
                // CRITICAL FIX: Only pass the specific property update to avoid stale object references
                onUpdate({
                    material: {
                        ...materialProxy,
                        opacity: value,
                        transparent: value < 1,
                    },
                });
            });

        // CRITICAL FIX: External sync mechanism to refresh GUI when object changes externally
        const refreshGUI = () => {
            syncProxies();
            // Update all controllers with new values without triggering onChange
            controllers.positionX?.updateDisplay();
            controllers.positionY?.updateDisplay();
            controllers.positionZ?.updateDisplay();
            controllers.rotationX?.updateDisplay();
            controllers.rotationY?.updateDisplay();
            controllers.rotationZ?.updateDisplay();
            controllers.scale?.updateDisplay();
            controllers.color?.updateDisplay();
            controllers.metalness?.updateDisplay();
            controllers.roughness?.updateDisplay();
            controllers.opacity?.updateDisplay();
        };

        // Store refresh function for external access
        (gui as any).refreshGUI = refreshGUI;

        positionFolder.open();
        materialFolder.open();

        return () => {
            if (guiRef.current) {
                guiRef.current.destroy();
                guiRef.current = null;
            }
        };
    }, [object, onUpdate, theme]);

    // CRITICAL FIX: Auto-refresh GUI when object properties change externally
    // Use individual array elements in dependencies to ensure React detects array changes
    useEffect(() => {
        if (guiRef.current && (guiRef.current as any).refreshGUI) {
            (guiRef.current as any).refreshGUI();
        }
    }, [
        object.position[0],
        object.position[1],
        object.position[2],
        object.rotation[0],
        object.rotation[1],
        object.rotation[2],
        object.scale[0],
        object.scale[1],
        object.scale[2],
        object.color,
        object.material.metalness,
        object.material.roughness,
        object.material.opacity,
        object.material.wireframe,
        object.material.transparent,
    ]);

    return (
        <div
            ref={guiContainerRef}
            className="w-full min-h-0 [&_.lil-gui]:static [&_.lil-gui]:max-w-none [&_.lil-gui]:w-full [&_.lil-gui]:bg-transparent [&_.lil-gui]:border-0 [&_.lil-gui]:shadow-none [&_.lil-gui_.controller]:min-h-[28px] [&_.lil-gui_.folder>.title]:font-medium"
        />
    );
};

export default ObjectGuiControls;
