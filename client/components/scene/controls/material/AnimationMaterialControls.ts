import type GUI from "lil-gui";
import type { MaterialConfig, SceneConfig } from "@/types/scene";

export class AnimationMaterialControls {
    private material: MaterialConfig;
    private theme: "day" | "night";
    private updateConfig: (updater: (config: SceneConfig) => void) => void;

    constructor(
        material: MaterialConfig,
        theme: "day" | "night",
        updateConfig: (updater: (config: SceneConfig) => void) => void
    ) {
        this.material = material;
        this.theme = theme;
        this.updateConfig = updateConfig;
    }

    addAnimationControls(folder: GUI) {
        const { material } = this;
        const animationFolder = folder.addFolder("Animation");

        // Speed control (common for many geometries)
        if (material.speed !== undefined) {
            animationFolder
                .add(material, "speed", 0, 10, 0.1)
                .name("Speed")
                .onChange(value =>
                    this.updateConfig(c => {
                        c[this.theme].material.speed = value;
                    })
                );
        } else {
            // Add speed even if not defined
            const speedProxy = { speed: 1.0 };
            animationFolder
                .add(speedProxy, "speed", 0, 10, 0.1)
                .name("Speed")
                .onChange(value =>
                    this.updateConfig(c => {
                        if (!c[this.theme].material.speed)
                            c[this.theme].material.speed = 1.0;
                        c[this.theme].material.speed = value;
                    })
                );
        }

        // Distortion control for compatible materials
        if (
            material.distort !== undefined ||
            material.materialType === "standard"
        ) {
            const distortProxy = { distort: material.distort || 0.5 };
            animationFolder
                .add(distortProxy, "distort", 0, 2, 0.01)
                .name("Distortion")
                .onChange(value =>
                    this.updateConfig(c => {
                        c[this.theme].material.distort = value;
                    })
                );
        }

        // Scale multiplier
        const scaleProxy = { scale: 1.0 };
        animationFolder
            .add(scaleProxy, "scale", 0.1, 3, 0.1)
            .name("Scale")
            .onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.scale = value;
                })
            );

        animationFolder.open();
    }
}
