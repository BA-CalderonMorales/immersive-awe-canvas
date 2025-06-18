
import { useRef } from 'react';
import GUI from 'lil-gui';
import { SceneConfig, MaterialConfig, TorusKnotConfig } from '@/types/scene';

interface MainObjectControlsProps {
  gui: GUI;
  sceneConfig: SceneConfig;
  theme: 'day' | 'night';
  updateConfig: (updater: (config: SceneConfig) => void) => void;
}

const MainObjectControls = ({ gui, sceneConfig, theme, updateConfig }: MainObjectControlsProps) => {
  const themeConfig = sceneConfig[theme];

  // Main Object Folder
  const mainObjectFolder = gui.addFolder('Main Object');
  mainObjectFolder.addColor(themeConfig, 'mainObjectColor').onChange((value: string) => {
    updateConfig(config => { config[theme].mainObjectColor = value; });
  });

  // Material Folder
  const material = themeConfig.material;
  if (material) {
      const materialFolder = mainObjectFolder.addFolder('Material');
      
      if (material.materialType !== undefined) {
          materialFolder.add(material, 'materialType', ['standard', 'physical', 'toon', 'lambert', 'phong', 'normal', 'basic', 'matcap']).onChange(value => {
              updateConfig(c => { c[theme].material.materialType = value; });
          });
      }
      if (material.wireframe !== undefined) materialFolder.add(material, 'wireframe').onChange(value => updateConfig(c => { c[theme].material.wireframe = value; }));

      if (material.materialType === 'standard' || material.materialType === 'physical') {
          if (material.roughness !== undefined) materialFolder.add(material, 'roughness', 0, 1).onChange(value => updateConfig(c => { c[theme].material.roughness = value; }));
          if (material.metalness !== undefined) materialFolder.add(material, 'metalness', 0, 1).onChange(value => updateConfig(c => { c[theme].material.metalness = value; }));
      }

      if (material.materialType === 'standard') {
          if (material.distort !== undefined) materialFolder.add(material, 'distort', 0, 1).onChange(value => updateConfig(c => { c[theme].material.distort = value; }));
      }
      
      if (material.materialType === 'physical') {
          const physicalFolder = materialFolder.addFolder('Physical Properties');
          if (material.clearcoat !== undefined) physicalFolder.add(material, 'clearcoat', 0, 1).onChange(value => updateConfig(c => { c[theme].material.clearcoat = value; }));
          if (material.clearcoatRoughness !== undefined) physicalFolder.add(material, 'clearcoatRoughness', 0, 1).onChange(value => updateConfig(c => { c[theme].material.clearcoatRoughness = value; }));
          if (material.ior !== undefined) physicalFolder.add(material, 'ior', 1, 2.333).onChange(value => updateConfig(c => { c[theme].material.ior = value; }));
          if (material.thickness !== undefined) physicalFolder.add(material, 'thickness', 0, 5).onChange(value => updateConfig(c => { c[theme].material.thickness = value; }));
          if (material.specularIntensity !== undefined) physicalFolder.add(material, 'specularIntensity', 0, 1).onChange(value => updateConfig(c => { c[theme].material.specularIntensity = value; }));
          if (material.specularColor !== undefined) physicalFolder.addColor(material, 'specularColor').onChange(value => updateConfig(c => { c[theme].material.specularColor = value; }));
          physicalFolder.open();
      }

      if (material.materialType === 'phong') {
          const phongFolder = materialFolder.addFolder('Phong Properties');
          if (material.shininess !== undefined) phongFolder.add(material, 'shininess', 0, 1024).onChange(value => updateConfig(c => { c[theme].material.shininess = value; }));
          if (material.specularColor !== undefined) phongFolder.addColor(material, 'specularColor').name('specular').onChange(value => updateConfig(c => { c[theme].material.specularColor = value; }));
          phongFolder.open();
      }

      if (material.materialType === 'toon') {
          const toonFolder = materialFolder.addFolder('Toon Properties');
          if (material.gradientMap !== undefined) {
              toonFolder.add(material, 'gradientMap', ['three', 'five']).onChange(value => {
                  updateConfig(c => { c[theme].material.gradientMap = value; });
              });
          }
          toonFolder.open();
      }

      if (material.materialType === 'matcap') {
          const matcapFolder = materialFolder.addFolder('Matcap Properties');
          matcapFolder.add(material, 'matcapTexture', ['chrome', 'purple', 'gold']).onChange(value => {
              updateConfig(c => { c[theme].material.matcapTexture = value; });
          });
          matcapFolder.open();
      }

      if (material.speed !== undefined) materialFolder.add(material, 'speed', 0, 10).onChange(value => updateConfig(c => { c[theme].material.speed = value; }));
      if (material.emissive !== undefined) materialFolder.addColor(material, 'emissive').onChange(value => updateConfig(c => { c[theme].material.emissive = value; }));
      if (material.emissiveIntensity !== undefined) materialFolder.add(material, 'emissiveIntensity', 0, 5).onChange(value => updateConfig(c => { c[theme].material.emissiveIntensity = value; }));
      if (material.transparent !== undefined) materialFolder.add(material, 'transparent').onChange(value => updateConfig(c => { c[theme].material.transparent = value; }));
      if (material.opacity !== undefined) materialFolder.add(material, 'opacity', 0, 1).onChange(value => updateConfig(c => { c[theme].material.opacity = value; }));
      materialFolder.open();
  }

  if (sceneConfig.type === 'TorusKnot') {
    const torusKnot = themeConfig.torusKnot;
    if (torusKnot) {
      const torusKnotFolder = mainObjectFolder.addFolder('Geometry');
      if (torusKnot.p !== undefined) torusKnotFolder.add(torusKnot, 'p', 1, 20).step(1).onChange(value => updateConfig(c => { c[theme].torusKnot!.p = value; }));
      if (torusKnot.q !== undefined) torusKnotFolder.add(torusKnot, 'q', 1, 20).step(1).onChange(value => updateConfig(c => { c[theme].torusKnot!.q = value; }));
      if (torusKnot.radius !== undefined) torusKnotFolder.add(torusKnot, 'radius', 0.1, 5).onChange(value => updateConfig(c => { c[theme].torusKnot!.radius = value; }));
      if (torusKnot.tube !== undefined) torusKnotFolder.add(torusKnot, 'tube', 0.1, 2).onChange(value => updateConfig(c => { c[theme].torusKnot!.tube = value; }));
      if (torusKnot.tubularSegments !== undefined) torusKnotFolder.add(torusKnot, 'tubularSegments', 3, 512).step(1).onChange(value => updateConfig(c => { c[theme].torusKnot!.tubularSegments = value; }));
      if (torusKnot.radialSegments !== undefined) torusKnotFolder.add(torusKnot, 'radialSegments', 3, 64).step(1).onChange(value => updateConfig(c => { c[theme].torusKnot!.radialSegments = value; }));
      torusKnotFolder.open();
    }
  }
  mainObjectFolder.open();

  return null;
};

export default MainObjectControls;
