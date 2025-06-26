
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';
import { MaterialControlsBuilder } from './MaterialControlsBuilder';
import { LightControlsBuilder } from './LightControlsBuilder';
import { BackgroundControlsBuilder } from './BackgroundControlsBuilder';
import { ObjectControlsBuilder } from './ObjectControlsBuilder';

export class GuiControlsFactory {
  private gui: GUI;
  private sceneConfig: SceneConfig;
  private theme: 'day' | 'night';
  private updateConfig: (updater: (config: SceneConfig) => void) => void;

  constructor(
    gui: GUI,
    sceneConfig: SceneConfig,
    theme: 'day' | 'night',
    updateConfig: (updater: (config: SceneConfig) => void) => void
  ) {
    this.gui = gui;
    this.sceneConfig = sceneConfig;
    this.theme = theme;
    this.updateConfig = updateConfig;
  }

  createAllControls() {
    const themeConfig = this.sceneConfig[this.theme];

    // Main Object Controls
    const mainObjectFolder = this.gui.addFolder('Main Object');
    this.createMainObjectColorControl(mainObjectFolder, themeConfig);
    
    // Material Controls
    const materialBuilder = new MaterialControlsBuilder(
      mainObjectFolder,
      themeConfig.material,
      this.theme,
      this.updateConfig
    );
    materialBuilder.build();

    // Object-specific Controls
    const objectBuilder = new ObjectControlsBuilder(
      mainObjectFolder,
      this.sceneConfig,
      this.theme,
      this.updateConfig
    );
    objectBuilder.build();

    mainObjectFolder.open();

    // Light Controls
    const lightBuilder = new LightControlsBuilder(
      this.gui,
      themeConfig.lights,
      this.theme,
      this.updateConfig
    );
    lightBuilder.build();

    // Background Controls
    const backgroundBuilder = new BackgroundControlsBuilder(
      this.gui,
      themeConfig.background,
      this.theme,
      this.updateConfig
    );
    backgroundBuilder.build();
  }

  private createMainObjectColorControl(folder: GUI, themeConfig: any) {
    folder.addColor(themeConfig, 'mainObjectColor').onChange((value: string) => {
      this.updateConfig(config => { 
        config[this.theme].mainObjectColor = value; 
      });
    });
  }
}
