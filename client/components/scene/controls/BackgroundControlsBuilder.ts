import type GUI from "lil-gui";
import type {
    BackgroundConfig,
    EnvironmentPreset,
    SceneConfig,
} from "@/types/scene";

export class BackgroundControlsBuilder {
    private gui: GUI;
    private background: BackgroundConfig;
    private theme: "day" | "night";
    private updateConfig: (updater: (config: SceneConfig) => void) => void;

    constructor(
        gui: GUI,
        background: BackgroundConfig,
        theme: "day" | "night",
        updateConfig: (updater: (config: SceneConfig) => void) => void
    ) {
        this.gui = gui;
        this.background = background;
        this.theme = theme;
        this.updateConfig = updateConfig;
    }

    build() {
        const bgFolder = this.gui.addFolder("Background");

        this.createBackgroundTypeControl(bgFolder);
        this.createBackgroundSpecificControls(bgFolder);

        bgFolder.open();
    }

    private createBackgroundTypeControl(folder: GUI) {
        folder
            .add(this.background, "type", [
                "sky",
                "stars",
                "fog",
                "sparkles",
                "color",
                "environment",
                "gradient",
                "noise",
                "plasma",
                "void",
                "aurora",
            ])
            .name("Type")
            .onChange(value => {
                this.updateConfig(c => {
                    const bg = c[this.theme].background;
                    bg.type = value as BackgroundConfig["type"];
                    this.setBackgroundDefaults(bg, value);
                });
            });
    }

    private setBackgroundDefaults(bg: BackgroundConfig, type: string) {
        // Set defaults for new background types
        if (type === "environment") {
            if (bg.preset === undefined) bg.preset = "night";
            if (bg.blur === undefined) bg.blur = 0.5;
        } else if (type === "gradient") {
            if (bg.colorTop === undefined) bg.colorTop = "#ff6b6b";
            if (bg.colorBottom === undefined) bg.colorBottom = "#4ecdc4";
            if (bg.speed === undefined) bg.speed = 0.1;
        } else if (type === "noise") {
            if (bg.noiseScale === undefined) bg.noiseScale = 10.0;
            if (bg.noiseIntensity === undefined) bg.noiseIntensity = 0.5;
            if (bg.noiseSpeed === undefined) bg.noiseSpeed = 0.1;
            if (bg.color === undefined) bg.color = "#1a1a2e";
        } else if (type === "plasma") {
            if (bg.plasmaSpeed === undefined) bg.plasmaSpeed = 1.0;
            if (bg.plasmaIntensity === undefined) bg.plasmaIntensity = 0.5;
            if (bg.plasmaColor1 === undefined) bg.plasmaColor1 = "#ff0080";
            if (bg.plasmaColor2 === undefined) bg.plasmaColor2 = "#0080ff";
        } else if (type === "aurora") {
            if (bg.auroraSpeed === undefined) bg.auroraSpeed = 0.5;
            if (bg.auroraIntensity === undefined) bg.auroraIntensity = 2.0;
            if (bg.auroraColors === undefined)
                bg.auroraColors = ["#00ff88", "#0088ff", "#ff0088"];
        } else if (type === "stars") {
            if (bg.radius === undefined) bg.radius = 100;
            if (bg.depth === undefined) bg.depth = 50;
            if (bg.count === undefined) bg.count = 5000;
            if (bg.factor === undefined) bg.factor = 4;
            if (bg.saturation === undefined) bg.saturation = 0;
            if (bg.fade === undefined) bg.fade = true;
            if (bg.speed === undefined) bg.speed = 1;
        } else if (type === "sparkles") {
            if (bg.count === undefined) bg.count = 100;
            if (bg.scale === undefined) bg.scale = 10;
            if (bg.size === undefined) bg.size = 2;
            if (bg.speed === undefined) bg.speed = 0.3;
            if (bg.opacity === undefined) bg.opacity = 1;
            if (bg.color === undefined) bg.color = "#ffffff";
        } else if (type === "fog") {
            if (bg.color === undefined) bg.color = "#ffffff";
            if (bg.near === undefined) bg.near = 1;
            if (bg.far === undefined) bg.far = 100;
            if (bg.density === undefined) bg.density = 0.01;
        }
    }

    private createBackgroundSpecificControls(folder: GUI) {
        const { background } = this;

        if (background.type === "environment") {
            this.createEnvironmentControls(folder);
        } else if (background.type === "sky") {
            this.createSkyControls(folder);
        } else if (background.type === "stars") {
            this.createStarsControls(folder);
        } else if (background.type === "sparkles") {
            this.createSparklesControls(folder);
        } else if (background.type === "fog") {
            this.createFogControls(folder);
        } else if (background.type === "color") {
            this.createColorControls(folder);
        } else if (background.type === "gradient") {
            this.createGradientControls(folder);
        } else if (background.type === "noise") {
            this.createNoiseControls(folder);
        } else if (background.type === "plasma") {
            this.createPlasmaControls(folder);
        } else if (background.type === "aurora") {
            this.createAuroraControls(folder);
        }
    }

    private createEnvironmentControls(folder: GUI) {
        const { background } = this;
        const presets: EnvironmentPreset[] = [
            "apartment",
            "city",
            "dawn",
            "forest",
            "lobby",
            "night",
            "park",
            "studio",
            "sunset",
            "warehouse",
        ];

        if (background.preset === undefined) {
            this.updateConfig(c => {
                c[this.theme].background.preset = "night";
            });
        }

        folder.add(background, "preset", presets).onChange(v =>
            this.updateConfig(c => {
                c[this.theme].background.preset = v as EnvironmentPreset;
            })
        );

        if (background.blur === undefined) {
            this.updateConfig(c => {
                c[this.theme].background.blur = 0.5;
            });
        }

        folder.add(background, "blur", 0, 1).onChange(v =>
            this.updateConfig(c => {
                c[this.theme].background.blur = v;
            })
        );
    }

    private createSkyControls(folder: GUI) {
        const { background } = this;

        if (background.sunPosition) {
            const sunPosFolder = folder.addFolder("Sun Position");
            sunPosFolder
                .add(background.sunPosition, "0", -200, 200)
                .name("x")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.sunPosition![0] = v;
                    })
                );
            sunPosFolder
                .add(background.sunPosition, "1", -200, 200)
                .name("y")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.sunPosition![1] = v;
                    })
                );
            sunPosFolder
                .add(background.sunPosition, "2", -200, 200)
                .name("z")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.sunPosition![2] = v;
                    })
                );
            sunPosFolder.open();
        }
    }

    private createStarsControls(folder: GUI) {
        const { background } = this;

        if (background.radius !== undefined)
            folder.add(background, "radius", 10, 2000).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.radius = v;
                })
            );
        if (background.depth !== undefined)
            folder.add(background, "depth", 1, 200).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.depth = v;
                })
            );
        if (background.count !== undefined)
            folder
                .add(background, "count", 0, 20000)
                .step(100)
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.count = v;
                    })
                );
        if (background.factor !== undefined)
            folder.add(background, "factor", 0, 20).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.factor = v;
                })
            );
        if (background.saturation !== undefined)
            folder.add(background, "saturation", 0, 2).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.saturation = v;
                })
            );
        if (background.speed !== undefined)
            folder.add(background, "speed", 0, 5).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.speed = v;
                })
            );
        if (background.fade !== undefined)
            folder.add(background, "fade").onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.fade = v;
                })
            );
    }

    private createSparklesControls(folder: GUI) {
        const { background } = this;

        if (background.count !== undefined)
            folder
                .add(background, "count", 0, 10000)
                .step(100)
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.count = v;
                    })
                );
        if (background.scale !== undefined)
            folder.add(background, "scale", 0, 50).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.scale = v;
                })
            );
        if (background.size !== undefined)
            folder.add(background, "size", 0, 20).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.size = v;
                })
            );
        if (background.speed !== undefined)
            folder.add(background, "speed", 0, 5).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.speed = v;
                })
            );
        if (background.opacity !== undefined)
            folder.add(background, "opacity", 0, 1).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.opacity = v;
                })
            );
        if (background.color !== undefined)
            folder.addColor(background, "color").onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.color = v;
                })
            );
    }

    private createFogControls(folder: GUI) {
        const { background } = this;

        if (background.color !== undefined)
            folder.addColor(background, "color").onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.color = v;
                })
            );
        if (background.near !== undefined)
            folder.add(background, "near", 0, 100).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.near = v;
                })
            );
        if (background.far !== undefined)
            folder.add(background, "far", 0, 200).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.far = v;
                })
            );
        if (background.density !== undefined)
            folder.add(background, "density", 0, 1).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.density = v;
                })
            );
    }

    private createColorControls(folder: GUI) {
        const { background } = this;

        if (background.color !== undefined)
            folder.addColor(background, "color").onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.color = v;
                })
            );
        if (background.colorTop !== undefined)
            folder
                .addColor(background, "colorTop")
                .name("Top Color")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.colorTop = v;
                    })
                );
        if (background.colorBottom !== undefined)
            folder
                .addColor(background, "colorBottom")
                .name("Bottom Color")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.colorBottom = v;
                    })
                );
    }

    private createGradientControls(folder: GUI) {
        const { background } = this;

        if (background.colorTop !== undefined)
            folder
                .addColor(background, "colorTop")
                .name("Top Color")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.colorTop = v;
                    })
                );
        if (background.colorBottom !== undefined)
            folder
                .addColor(background, "colorBottom")
                .name("Bottom Color")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.colorBottom = v;
                    })
                );
        if (background.speed !== undefined)
            folder.add(background, "speed", 0, 2).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.speed = v;
                })
            );
    }

    private createNoiseControls(folder: GUI) {
        const { background } = this;

        if (background.color !== undefined)
            folder.addColor(background, "color").onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.color = v;
                })
            );
        if (background.noiseScale !== undefined)
            folder.add(background, "noiseScale", 1, 50).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.noiseScale = v;
                })
            );
        if (background.noiseIntensity !== undefined)
            folder.add(background, "noiseIntensity", 0, 2).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.noiseIntensity = v;
                })
            );
        if (background.noiseSpeed !== undefined)
            folder.add(background, "noiseSpeed", 0, 1).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.noiseSpeed = v;
                })
            );
    }

    private createPlasmaControls(folder: GUI) {
        const { background } = this;

        if (background.plasmaColor1 !== undefined)
            folder
                .addColor(background, "plasmaColor1")
                .name("Color 1")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.plasmaColor1 = v;
                    })
                );
        if (background.plasmaColor2 !== undefined)
            folder
                .addColor(background, "plasmaColor2")
                .name("Color 2")
                .onChange(v =>
                    this.updateConfig(c => {
                        c[this.theme].background.plasmaColor2 = v;
                    })
                );
        if (background.plasmaSpeed !== undefined)
            folder.add(background, "plasmaSpeed", 0, 3).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.plasmaSpeed = v;
                })
            );
        if (background.plasmaIntensity !== undefined)
            folder.add(background, "plasmaIntensity", 0, 2).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.plasmaIntensity = v;
                })
            );
    }

    private createAuroraControls(folder: GUI) {
        const { background } = this;

        if (background.auroraSpeed !== undefined)
            folder.add(background, "auroraSpeed", 0, 2).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.auroraSpeed = v;
                })
            );
        if (background.auroraIntensity !== undefined)
            folder.add(background, "auroraIntensity", 0, 5).onChange(v =>
                this.updateConfig(c => {
                    c[this.theme].background.auroraIntensity = v;
                })
            );
    }
}
