import { useRef, useEffect, useCallback } from "react";
import GUI, { Controller } from "lil-gui";
import {
    SceneConfig,
    MaterialConfig,
    LightConfig,
    BackgroundConfig,
    SceneThemeConfig,
} from "@/types/scene";
import { MaterialControlsBuilder } from "./MaterialControlsBuilder";
import { BackgroundControlsBuilder } from "./BackgroundControlsBuilder";
import { LightControlsBuilder } from "./LightControlsBuilder";

/**
 * ViewModel for lil-gui controls
 * Manages GUI state, creation, and updates following MVVM pattern
 */
export class GuiControlsViewModel {
    private gui: GUI | null = null;
    private controllers: Map<string, Controller> = new Map();
    private folders: Map<string, GUI> = new Map();
    private theme: "day" | "night" = "day";
    private sceneConfig: SceneConfig | null = null;
    private onUpdate: ((config: SceneConfig) => void) | null = null;

    constructor(
        private containerRef: React.RefObject<HTMLDivElement>,
        private title: string = "Scene Controls"
    ) {}

    /**
     * Initialize GUI with proper configuration
     */
    initialize(
        sceneConfig: SceneConfig,
        theme: "day" | "night",
        onUpdate: (config: SceneConfig) => void
    ): void {
        this.cleanup();

        if (!this.containerRef.current) return;

        this.sceneConfig = sceneConfig;
        this.theme = theme;
        this.onUpdate = onUpdate;

        // Create main GUI instance
        this.gui = new GUI({
            container: this.containerRef.current,
            title: this.title,
            autoPlace: false,
            width: Math.min(400, this.containerRef.current.clientWidth - 32),
        });

        // Apply theme styling
        this.applyTheme();

        // Build controls
        this.buildControls();
    }

    /**
     * Apply theme styling to GUI
     */
    private applyTheme(): void {
        if (!this.gui) return;

        const guiElement = this.gui.domElement;
        guiElement.setAttribute("data-theme", this.theme);
        guiElement.classList.add(`theme-${this.theme}`);
    }

    /**
     * Build all GUI controls
     */
    private buildControls(): void {
        if (!this.gui || !this.sceneConfig || !this.onUpdate) return;

        const themeConfig = this.sceneConfig[this.theme];

        // Main object color
        this.buildMainObjectControls(themeConfig);

        // Material controls
        this.buildMaterialControls(themeConfig);

        // Background controls
        this.buildBackgroundControls(themeConfig);

        // Light controls
        this.buildLightControls(themeConfig);
    }

    /**
     * Build main object controls
     */
    private buildMainObjectControls(themeConfig: SceneThemeConfig): void {
        if (!this.gui || !this.sceneConfig || !this.onUpdate) return;

        const mainFolder = this.gui.addFolder("🎨 Main Object");
        this.folders.set("main", mainFolder);

        // Main object color
        const colorProxy = { color: themeConfig.mainObjectColor };
        const colorController = mainFolder
            .addColor(colorProxy, "color")
            .name("Color");

        colorController.onChange((value: string) => {
            colorProxy.color = value;
            this.updateSceneConfig(config => {
                config[this.theme].mainObjectColor = value;
            });
        });

        this.controllers.set("mainColor", colorController);
        mainFolder.open();
    }

    /**
     * Build material controls
     */
    private buildMaterialControls(themeConfig: SceneThemeConfig): void {
        if (!this.gui || !this.sceneConfig || !this.onUpdate) return;

        const materialFolder = this.gui.addFolder("⚡ Material");
        this.folders.set("material", materialFolder);

        const materialBuilder = new MaterialControlsBuilder(
            materialFolder,
            themeConfig.material,
            this.theme,
            this.createConfigUpdater()
        );

        materialBuilder.build();
        materialFolder.open();
    }

    /**
     * Build background controls
     */
    private buildBackgroundControls(themeConfig: SceneThemeConfig): void {
        if (!this.gui || !this.sceneConfig || !this.onUpdate) return;

        const backgroundFolder = this.gui.addFolder("🌅 Background");
        this.folders.set("background", backgroundFolder);

        const backgroundBuilder = new BackgroundControlsBuilder(
            backgroundFolder,
            themeConfig.background,
            this.theme,
            this.createConfigUpdater()
        );

        backgroundBuilder.build();
        backgroundFolder.open();
    }

    /**
     * Build light controls
     */
    private buildLightControls(themeConfig: SceneThemeConfig): void {
        if (!this.gui || !this.sceneConfig || !this.onUpdate) return;

        const lightsFolder = this.gui.addFolder("💡 Lights");
        this.folders.set("lights", lightsFolder);

        const lightBuilder = new LightControlsBuilder(
            lightsFolder,
            themeConfig.lights,
            this.theme,
            this.createConfigUpdater()
        );

        lightBuilder.build();
        lightsFolder.open();
    }

    /**
     * Create config updater function
     */
    private createConfigUpdater() {
        return (updater: (config: SceneConfig) => void) => {
            if (!this.sceneConfig || !this.onUpdate) return;

            const newConfig = JSON.parse(JSON.stringify(this.sceneConfig));
            updater(newConfig);
            this.onUpdate(newConfig);
            this.sceneConfig = newConfig;
        };
    }

    /**
     * Update scene config with proper immutability
     */
    private updateSceneConfig(updater: (config: SceneConfig) => void): void {
        if (!this.sceneConfig || !this.onUpdate) return;

        const newConfig = JSON.parse(JSON.stringify(this.sceneConfig));
        updater(newConfig);
        this.onUpdate(newConfig);
        this.sceneConfig = newConfig;
    }

    /**
     * Update GUI when external changes occur
     */
    updateFromExternalChanges(
        sceneConfig: SceneConfig,
        theme: "day" | "night"
    ): void {
        if (!this.gui) return;

        this.sceneConfig = sceneConfig;
        this.theme = theme;

        // Update controller values without triggering onChange
        const themeConfig = sceneConfig[theme];

        // Update main color
        const colorController = this.controllers.get("mainColor");
        if (colorController && typeof colorController.setValue === "function") {
            colorController.setValue(themeConfig.mainObjectColor);
        }

        // Update other controllers as needed
        this.refreshControllers();
    }

    /**
     * Refresh all controllers to match current state
     */
    private refreshControllers(): void {
        this.controllers.forEach(controller => {
            if (controller && typeof controller.updateDisplay === "function") {
                controller.updateDisplay();
            }
        });
    }

    /**
     * Get folder by name
     */
    getFolder(name: string): GUI | undefined {
        return this.folders.get(name);
    }

    /**
     * Get controller by name
     */
    getController(name: string): Controller | undefined {
        return this.controllers.get(name);
    }

    /**
     * Clean up GUI resources
     */
    cleanup(): void {
        if (this.gui) {
            this.gui.destroy();
            this.gui = null;
        }
        this.controllers.clear();
        this.folders.clear();
    }

    /**
     * Check if GUI is initialized
     */
    isInitialized(): boolean {
        return this.gui !== null;
    }
}

/**
 * React hook for using GuiControlsViewModel
 */
export const useGuiControlsViewModel = (
    containerRef: React.RefObject<HTMLDivElement>,
    title: string = "Scene Controls"
) => {
    const viewModelRef = useRef<GuiControlsViewModel | null>(null);

    // Initialize view model
    useEffect(() => {
        viewModelRef.current = new GuiControlsViewModel(containerRef, title);

        return () => {
            viewModelRef.current?.cleanup();
        };
    }, [containerRef, title]);

    // Initialize GUI
    const initialize = useCallback(
        (
            sceneConfig: SceneConfig,
            theme: "day" | "night",
            onUpdate: (config: SceneConfig) => void
        ) => {
            viewModelRef.current?.initialize(sceneConfig, theme, onUpdate);
        },
        []
    );

    // Update from external changes
    const updateFromExternalChanges = useCallback(
        (sceneConfig: SceneConfig, theme: "day" | "night") => {
            viewModelRef.current?.updateFromExternalChanges(sceneConfig, theme);
        },
        []
    );

    // Cleanup
    const cleanup = useCallback(() => {
        viewModelRef.current?.cleanup();
    }, []);

    return {
        initialize,
        updateFromExternalChanges,
        cleanup,
        viewModel: viewModelRef.current,
    };
};
