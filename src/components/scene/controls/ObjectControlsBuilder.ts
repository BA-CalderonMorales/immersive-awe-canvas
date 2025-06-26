
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';

export class ObjectControlsBuilder {
  private parentFolder: GUI;
  private sceneConfig: SceneConfig;
  private theme: 'day' | 'night';
  private updateConfig: (updater: (config: SceneConfig) => void) => void;

  constructor(
    parentFolder: GUI,
    sceneConfig: SceneConfig,
    theme: 'day' | 'night',
    updateConfig: (updater: (config: SceneConfig) => void) => void
  ) {
    this.parentFolder = parentFolder;
    this.sceneConfig = sceneConfig;
    this.theme = theme;
    this.updateConfig = updateConfig;
  }

  build() {
    if (this.sceneConfig.type === 'TorusKnot') {
      this.createTorusKnotControls();
    }
    // Add other object types here as needed
  }

  private createTorusKnotControls() {
    const themeConfig = this.sceneConfig[this.theme];
    const torusKnot = themeConfig.torusKnot;
    
    if (!torusKnot) return;

    const torusKnotFolder = this.parentFolder.addFolder('Geometry');
    
    if (torusKnot.p !== undefined) {
      torusKnotFolder.add(torusKnot, 'p', 1, 20).step(1).onChange(value => 
        this.updateConfig(c => { c[this.theme].torusKnot!.p = value; })
      );
    }

    if (torusKnot.q !== undefined) {
      torusKnotFolder.add(torusKnot, 'q', 1, 20).step(1).onChange(value => 
        this.updateConfig(c => { c[this.theme].torusKnot!.q = value; })
      );
    }

    if (torusKnot.radius !== undefined) {
      torusKnotFolder.add(torusKnot, 'radius', 0.1, 5).onChange(value => 
        this.updateConfig(c => { c[this.theme].torusKnot!.radius = value; })
      );
    }

    if (torusKnot.tube !== undefined) {
      torusKnotFolder.add(torusKnot, 'tube', 0.1, 2).onChange(value => 
        this.updateConfig(c => { c[this.theme].torusKnot!.tube = value; })
      );
    }

    if (torusKnot.tubularSegments !== undefined) {
      torusKnotFolder.add(torusKnot, 'tubularSegments', 3, 512).step(1).onChange(value => 
        this.updateConfig(c => { c[this.theme].torusKnot!.tubularSegments = value; })
      );
    }

    if (torusKnot.radialSegments !== undefined) {
      torusKnotFolder.add(torusKnot, 'radialSegments', 3, 64).step(1).onChange(value => 
        this.updateConfig(c => { c[this.theme].torusKnot!.radialSegments = value; })
      );
    }

    torusKnotFolder.open();
  }
}
