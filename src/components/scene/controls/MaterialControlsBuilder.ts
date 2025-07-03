
import GUI from 'lil-gui';
import { MaterialConfig, SceneConfig } from '@/types/scene';

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
    
    this.addMaterialTypeControl(materialFolder);
    this.addCommonMaterialControls(materialFolder);
    this.addMaterialSpecificControls(materialFolder);
    
    materialFolder.open();
  }

  private addMaterialTypeControl(folder: GUI) {
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

  private addCommonMaterialControls(folder: GUI) {
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

  private addMaterialSpecificControls(folder: GUI) {
    const { material } = this;

    // Standard/Physical material controls
    if (material.materialType === 'standard' || material.materialType === 'physical') {
      this.addStandardPhysicalControls(folder);
    }

    // Physical material specific controls
    if (material.materialType === 'physical') {
      this.addPhysicalControls(folder);
    }

    // Phong material controls
    if (material.materialType === 'phong') {
      this.addPhongControls(folder);
    }

    // Toon material controls
    if (material.materialType === 'toon') {
      this.addToonControls(folder);
    }

    // Matcap material controls
    if (material.materialType === 'matcap') {
      this.addMatcapControls(folder);
    }

    // Animation controls
    this.addAnimationControls(folder);
  }

  private addStandardPhysicalControls(folder: GUI) {
    const { material } = this;
    
    if (material.roughness !== undefined) {
      folder.add(material, 'roughness', 0, 1).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.roughness = value; })
      );
    }

    if (material.metalness !== undefined) {
      folder.add(material, 'metalness', 0, 1).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.metalness = value; })
      );
    }

    if (material.materialType === 'standard' && material.distort !== undefined) {
      folder.add(material, 'distort', 0, 1).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.distort = value; })
      );
    }
  }

  private addPhysicalControls(folder: GUI) {
    const { material } = this;
    const physicalFolder = folder.addFolder('Physical Properties');
    
    if (material.clearcoat !== undefined) {
      physicalFolder.add(material, 'clearcoat', 0, 1).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.clearcoat = value; })
      );
    }

    if (material.clearcoatRoughness !== undefined) {
      physicalFolder.add(material, 'clearcoatRoughness', 0, 1).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.clearcoatRoughness = value; })
      );
    }

    if (material.ior !== undefined) {
      physicalFolder.add(material, 'ior', 1, 2.333).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.ior = value; })
      );
    }

    if (material.thickness !== undefined) {
      physicalFolder.add(material, 'thickness', 0, 5).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.thickness = value; })
      );
    }

    if (material.specularIntensity !== undefined) {
      physicalFolder.add(material, 'specularIntensity', 0, 1).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.specularIntensity = value; })
      );
    }

    if (material.specularColor !== undefined) {
      physicalFolder.addColor(material, 'specularColor').onChange(value => 
        this.updateConfig(c => { c[this.theme].material.specularColor = value; })
      );
    }

    physicalFolder.open();
  }

  private addPhongControls(folder: GUI) {
    const { material } = this;
    const phongFolder = folder.addFolder('Phong Properties');
    
    if (material.shininess !== undefined) {
      phongFolder.add(material, 'shininess', 0, 1024).onChange(value => 
        this.updateConfig(c => { c[this.theme].material.shininess = value; })
      );
    }

    if (material.specularColor !== undefined) {
      phongFolder.addColor(material, 'specularColor').name('specular').onChange(value => 
        this.updateConfig(c => { c[this.theme].material.specularColor = value; })
      );
    }

    phongFolder.open();
  }

  private addToonControls(folder: GUI) {
    const { material } = this;
    const toonFolder = folder.addFolder('Toon Properties');
    
    if (material.gradientMap !== undefined) {
      toonFolder.add(material, 'gradientMap', ['three', 'five']).onChange(value => {
        this.updateConfig(c => { c[this.theme].material.gradientMap = value; });
      });
    }

    toonFolder.open();
  }

  private addMatcapControls(folder: GUI) {
    const { material } = this;
    const matcapFolder = folder.addFolder('Matcap Properties');
    
    matcapFolder.add(material, 'matcapTexture', ['chrome', 'purple', 'gold']).onChange(value => {
      this.updateConfig(c => { c[this.theme].material.matcapTexture = value; });
    });

    matcapFolder.open();
  }

  private addAnimationControls(folder: GUI) {
    const { material } = this;
    const animationFolder = folder.addFolder('Animation');
    
    // Speed control (common for many geometries)
    if (material.speed !== undefined) {
      animationFolder.add(material, 'speed', 0, 10, 0.1).name('Speed').onChange(value => 
        this.updateConfig(c => { c[this.theme].material.speed = value; })
      );
    } else {
      // Add speed even if not defined
      const speedProxy = { speed: 1.0 };
      animationFolder.add(speedProxy, 'speed', 0, 10, 0.1).name('Speed').onChange(value => 
        this.updateConfig(c => { 
          if (!c[this.theme].material.speed) c[this.theme].material.speed = 1.0;
          c[this.theme].material.speed = value; 
        })
      );
    }

    // Distortion control for compatible materials
    if (material.distort !== undefined || material.materialType === 'standard') {
      const distortProxy = { distort: material.distort || 0.5 };
      animationFolder.add(distortProxy, 'distort', 0, 2, 0.01).name('Distortion').onChange(value => 
        this.updateConfig(c => { c[this.theme].material.distort = value; })
      );
    }

    // Scale multiplier
    const scaleProxy = { scale: 1.0 };
    animationFolder.add(scaleProxy, 'scale', 0.1, 3, 0.1).name('Scale').onChange(value => 
      this.updateConfig(c => { c[this.theme].material.scale = value; })
    );

    animationFolder.open();
  }
}
