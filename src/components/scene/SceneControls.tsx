
import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';

interface SceneControlsProps {
  sceneConfig: SceneConfig;
  onUpdate: (newConfig: SceneConfig) => void;
}

const SceneControls = ({ sceneConfig, onUpdate }: SceneControlsProps) => {
  const guiRef = useRef<GUI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useExperience();

  // Helper for deep cloning and updating to avoid state mutation issues
  const updateConfig = (updater: (config: SceneConfig) => void) => {
    const newConfig = JSON.parse(JSON.stringify(sceneConfig));
    updater(newConfig);
    onUpdate(newConfig);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous GUI if it exists
    if (guiRef.current) {
      guiRef.current.destroy();
    }
    const gui = new GUI({ container: containerRef.current });
    guiRef.current = gui;

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
        if (material.roughness !== undefined) materialFolder.add(material, 'roughness', 0, 1).onChange(value => updateConfig(c => { c[theme].material.roughness = value; }));
        if (material.metalness !== undefined) materialFolder.add(material, 'metalness', 0, 1).onChange(value => updateConfig(c => { c[theme].material.metalness = value; }));
        if (material.distort !== undefined) materialFolder.add(material, 'distort', 0, 1).onChange(value => updateConfig(c => { c[theme].material.distort = value; }));
        if (material.speed !== undefined) materialFolder.add(material, 'speed', 0, 10).onChange(value => updateConfig(c => { c[theme].material.speed = value; }));
        if (material.emissiveIntensity !== undefined) materialFolder.add(material, 'emissiveIntensity', 0, 5).onChange(value => updateConfig(c => { c[theme].material.emissiveIntensity = value; }));
        materialFolder.open();
    }
    mainObjectFolder.open();
    
    // Background Folder
    const backgroundConf = themeConfig.background;
    const bgFolder = gui.addFolder('Background');
    if (backgroundConf.sunPosition) {
      const sunPosFolder = bgFolder.addFolder('Sun Position');
      sunPosFolder.add(backgroundConf.sunPosition, '0', -200, 200).name('x').onChange(v => updateConfig(c => {c[theme].background.sunPosition![0] = v}));
      sunPosFolder.add(backgroundConf.sunPosition, '1', -200, 200).name('y').onChange(v => updateConfig(c => {c[theme].background.sunPosition![1] = v}));
      sunPosFolder.add(backgroundConf.sunPosition, '2', -200, 200).name('z').onChange(v => updateConfig(c => {c[theme].background.sunPosition![2] = v}));
    }
    if (backgroundConf.saturation !== undefined) bgFolder.add(backgroundConf, 'saturation', 0, 2).onChange(v => updateConfig(c => {c[theme].background.saturation = v}));
    if (backgroundConf.radius !== undefined) bgFolder.add(backgroundConf, 'radius', 10, 2000).onChange(v => updateConfig(c => {c[theme].background.radius = v}));
    if (backgroundConf.count !== undefined) bgFolder.add(backgroundConf, 'count', 0, 10000).step(100).onChange(v => updateConfig(c => {c[theme].background.count = v}));

    bgFolder.open();

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneConfig, theme]); // Re-create GUI when config or theme changes

  return <div ref={containerRef} className="[&_.lil-gui]:static [&_.lil-gui.root]:w-full" />;
};

export default SceneControls;
