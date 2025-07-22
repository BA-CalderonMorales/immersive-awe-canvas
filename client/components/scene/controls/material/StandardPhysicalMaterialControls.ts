import GUI from "lil-gui";
import { MaterialConfig, SceneConfig } from "@/types/scene";

export class StandardPhysicalMaterialControls {
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

    addStandardPhysicalControls(folder: GUI) {
        const { material } = this;

        if (material.roughness !== undefined) {
            folder.add(material, "roughness", 0, 1).onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.roughness = value;
                })
            );
        }

        if (material.metalness !== undefined) {
            folder.add(material, "metalness", 0, 1).onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.metalness = value;
                })
            );
        }

        if (
            material.materialType === "standard" &&
            material.distort !== undefined
        ) {
            folder.add(material, "distort", 0, 1).onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.distort = value;
                })
            );
        }
    }

    addPhysicalControls(folder: GUI) {
        const { material } = this;
        const physicalFolder = folder.addFolder("Physical Properties");

        if (material.clearcoat !== undefined) {
            physicalFolder.add(material, "clearcoat", 0, 1).onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.clearcoat = value;
                })
            );
        }

        if (material.clearcoatRoughness !== undefined) {
            physicalFolder
                .add(material, "clearcoatRoughness", 0, 1)
                .onChange(value =>
                    this.updateConfig(c => {
                        c[this.theme].material.clearcoatRoughness = value;
                    })
                );
        }

        if (material.ior !== undefined) {
            physicalFolder.add(material, "ior", 1, 2.333).onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.ior = value;
                })
            );
        }

        if (material.thickness !== undefined) {
            physicalFolder.add(material, "thickness", 0, 5).onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.thickness = value;
                })
            );
        }

        if (material.specularIntensity !== undefined) {
            physicalFolder
                .add(material, "specularIntensity", 0, 1)
                .onChange(value =>
                    this.updateConfig(c => {
                        c[this.theme].material.specularIntensity = value;
                    })
                );
        }

        if (material.specularColor !== undefined) {
            physicalFolder.addColor(material, "specularColor").onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.specularColor = value;
                })
            );
        }

        physicalFolder.open();
    }
}
