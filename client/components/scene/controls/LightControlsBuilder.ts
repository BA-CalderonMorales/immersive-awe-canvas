import type GUI from "lil-gui";
import type { LightConfig, SceneConfig } from "@/types/scene";

export class LightControlsBuilder {
    private gui: GUI;
    private lights: LightConfig[];
    private theme: "day" | "night";
    private updateConfig: (updater: (config: SceneConfig) => void) => void;

    constructor(
        gui: GUI,
        lights: LightConfig[],
        theme: "day" | "night",
        updateConfig: (updater: (config: SceneConfig) => void) => void
    ) {
        this.gui = gui;
        this.lights = lights;
        this.theme = theme;
        this.updateConfig = updateConfig;
    }

    build() {
        const lightsFolder = this.gui.addFolder("Lights");

        this.lights.forEach((light, index) => {
            this.createLightControls(lightsFolder, light, index);
        });

        lightsFolder.open();
    }

    private createLightControls(
        parentFolder: GUI,
        light: LightConfig,
        index: number
    ) {
        const lightFolder = parentFolder.addFolder(
            `Light ${index + 1} (${light.type})`
        );

        if (light.intensity !== undefined) {
            lightFolder.add(light, "intensity", 0, 5).onChange(value => {
                this.updateConfig(c => {
                    c[this.theme].lights[index].intensity = value;
                });
            });
        }

        if (light.color !== undefined) {
            lightFolder.addColor(light, "color").onChange(value => {
                this.updateConfig(c => {
                    c[this.theme].lights[index].color = value;
                });
            });
        }

        if (light.position) {
            this.createPositionControls(lightFolder, light, index);
        }

        if (light.groundColor !== undefined) {
            lightFolder
                .addColor(light, "groundColor")
                .name("Ground Color")
                .onChange(value => {
                    this.updateConfig(c => {
                        c[this.theme].lights[index].groundColor = value;
                    });
                });
        }

        lightFolder.open();
    }

    private createPositionControls(
        parentFolder: GUI,
        light: LightConfig,
        index: number
    ) {
        const posFolder = parentFolder.addFolder("Position");

        posFolder
            .add(light.position!, "0", -200, 200)
            .name("x")
            .onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].lights[index].position![0] = v;
                })
            );

        posFolder
            .add(light.position!, "1", -200, 200)
            .name("y")
            .onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].lights[index].position![1] = v;
                })
            );

        posFolder
            .add(light.position!, "2", -200, 200)
            .name("z")
            .onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].lights[index].position![2] = v;
                })
            );

        posFolder.open();
    }
}
