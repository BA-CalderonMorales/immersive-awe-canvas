
import GUI from 'lil-gui';
import { MaterialConfig, SceneConfig } from '@/types/scene';
import { CommonMaterialControls } from './material/CommonMaterialControls';
import { StandardPhysicalMaterialControls } from './material/StandardPhysicalMaterialControls';
import { SpecializedMaterialControls } from './material/SpecializedMaterialControls';
import { AnimationMaterialControls } from './material/AnimationMaterialControls';

export class MaterialControlsBuilder {
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

  build() {
    if (!this.material) return;

    const materialFolder = this.parentFolder.addFolder('Material');
    
    const commonControls = new CommonMaterialControls(
      materialFolder, 
      this.material, 
      this.theme, 
      this.updateConfig
    );
    
    commonControls.addMaterialTypeControl(materialFolder);
    commonControls.addCommonControls(materialFolder);
    this.addMaterialSpecificControls(materialFolder);
    
    materialFolder.open();
  }

  private addMaterialSpecificControls(folder: GUI) {
    const { material } = this;

    const standardPhysicalControls = new StandardPhysicalMaterialControls(
      material, 
      this.theme, 
      this.updateConfig
    );

    const specializedControls = new SpecializedMaterialControls(
      material, 
      this.theme, 
      this.updateConfig
    );

    const animationControls = new AnimationMaterialControls(
      material, 
      this.theme, 
      this.updateConfig
    );

    // Standard/Physical material controls
    if (material.materialType === 'standard' || material.materialType === 'physical') {
      standardPhysicalControls.addStandardPhysicalControls(folder);
    }

    // Physical material specific controls
    if (material.materialType === 'physical') {
      standardPhysicalControls.addPhysicalControls(folder);
    }

    // Phong material controls
    if (material.materialType === 'phong') {
      specializedControls.addPhongControls(folder);
    }

    // Toon material controls
    if (material.materialType === 'toon') {
      specializedControls.addToonControls(folder);
    }

    // Matcap material controls
    if (material.materialType === 'matcap') {
      specializedControls.addMatcapControls(folder);
    }

    // Animation controls
    animationControls.addAnimationControls(folder);
  }
}
