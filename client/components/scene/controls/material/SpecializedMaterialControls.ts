import type GUI from "lil-gui";
import type { MaterialConfig, SceneConfig } from "@/types/scene";

export class SpecializedMaterialControls {
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

    addPhongControls(folder: GUI) {
        const { material } = this;
        const phongFolder = folder.addFolder("Phong Properties");

        if (material.shininess !== undefined) {
            phongFolder.add(material, "shininess", 0, 1024).onChange(value =>
                this.updateConfig(c => {
                    c[this.theme].material.shininess = value;
                })
            );
        }

        if (material.specularColor !== undefined) {
            phongFolder
                .addColor(material, "specularColor")
                .name("specular")
                .onChange(value =>
                    this.updateConfig(c => {
                        c[this.theme].material.specularColor = value;
                    })
                );
        }

        phongFolder.open();
    }

    addToonControls(folder: GUI) {
        const { material } = this;
        const toonFolder = folder.addFolder("Toon Properties");

        if (material.gradientMap !== undefined) {
            toonFolder
                .add(material, "gradientMap", ["three", "five"])
                .onChange(value => {
                    this.updateConfig(c => {
                        c[this.theme].material.gradientMap = value;
                    });
                });
        }

        toonFolder.open();
    }

    addMatcapControls(folder: GUI) {
        const { material } = this;
        const matcapFolder = folder.addFolder("Matcap Properties");

        matcapFolder
            .add(material, "matcapTexture", ["chrome", "purple", "gold"])
            .onChange(value => {
                this.updateConfig(c => {
                    c[this.theme].material.matcapTexture = value;
                });
            });

        matcapFolder.open();
    }
}
