import GUI from 'lil-gui';
import { MaterialConfig, SceneConfig } from '@/types/scene';

export class CommonMaterialControls {
  private parentFolder: GUI;
  private material: MaterialConfig;
  private theme: 'day' | 'night';
  private updateConfig: (updater: (config: SceneConfig) => void) => void;

  constructor(
    parentFolder: GUI,
    material: MaterialConfig,
    theme: 'day' | 'night',
    updateConfig: (updater: (config: SceneConfig) => void) => void
  ) {
    this.parentFolder = parentFolder;
    this.material = material;
    this.theme = theme;
    this.updateConfig = updateConfig;
  }

  addMaterialTypeControl(folder: GUI) {
    if (this.material.materialType !== undefined) {
      folder.add(this.material, 'materialType', [
        'standard', 'physical', 'toon', 'lambert', 'phong', 'normal', 'basic', 'matcap'
      ]).onChange(value => {
        this.updateConfig(c => { 
          c[this.theme].material.materialType = value; 
        });
      });
    }
  }

  addCommonControls(folder: GUI) {
    const { material } = this;
    
    if (material.wireframe !== undefined) {
      folder.add(material, 'wireframe').onChange(value => 
        this.updateConfig(c => { c[this.theme].material.wireframe = value; })
      );
    }

    if (material.speed !== undefined) {
      folder.add(material, 'speed', 0, 10).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.speed = value; })
      );
    }

    if (material.emissive !== undefined) {
      folder.addColor(material, 'emissive').onChange(value => 
        this.updateConfig(c => { c[this.theme].material.emissive = value; })
      );
    }

    if (material.emissiveIntensity !== undefined) {
      folder.add(material, 'emissiveIntensity', 0, 5).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.emissiveIntensity = value; })
      );
    }

    if (material.transparent !== undefined) {
      folder.add(material, 'transparent').onChange(value => 
        this.updateConfig(c => { c[this.theme].material.transparent = value; })
      );
    }

    if (material.opacity !== undefined) {
      folder.add(material, 'opacity', 0, 1).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.opacity = value; })
      );
    }
  }
}