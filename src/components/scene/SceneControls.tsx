import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import { useIsMobile } from "@/hooks/use-mobile";

interface SceneControlsProps {
  sceneConfig: SceneConfig;
  onUpdate: (newConfig: SceneConfig) => void;
}

const SceneControls = ({ sceneConfig, onUpdate }: SceneControlsProps) => {
  const guiRef = useRef<GUI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useExperience();
  const isMobile = useIsMobile();

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
        if (material.emissive !== undefined) materialFolder.addColor(material, 'emissive').onChange(value => updateConfig(c => { c[theme].material.emissive = value; }));
        if (material.emissiveIntensity !== undefined) materialFolder.add(material, 'emissiveIntensity', 0, 5).onChange(value => updateConfig(c => { c[theme].material.emissiveIntensity = value; }));
        if (material.transparent !== undefined) materialFolder.add(material, 'transparent').onChange(value => updateConfig(c => { c[theme].material.transparent = value; }));
        if (material.opacity !== undefined) materialFolder.add(material, 'opacity', 0, 1).onChange(value => updateConfig(c => { c[theme].material.opacity = value; }));
        materialFolder.open();
    }
    mainObjectFolder.open();
    
    // Lights Folder
    const lightsFolder = gui.addFolder('Lights');
    themeConfig.lights.forEach((light, index) => {
      const lightFolder = lightsFolder.addFolder(`Light ${index + 1} (${light.type})`);
      if (light.intensity !== undefined) {
        lightFolder.add(light, 'intensity', 0, 5).onChange(value => {
          updateConfig(c => { c[theme].lights[index].intensity = value; });
        });
      }
      if (light.color !== undefined) {
        lightFolder.addColor(light, 'color').onChange(value => {
          updateConfig(c => { c[theme].lights[index].color = value; });
        });
      }
      if (light.position) {
        const posFolder = lightFolder.addFolder('Position');
        posFolder.add(light.position, '0', -200, 200).name('x').onChange(v => updateConfig(c => { c[theme].lights[index].position![0] = v; }));
        posFolder.add(light.position, '1', -200, 200).name('y').onChange(v => updateConfig(c => { c[theme].lights[index].position![1] = v; }));
        posFolder.add(light.position, '2', -200, 200).name('z').onChange(v => updateConfig(c => { c[theme].lights[index].position![2] = v; }));
        posFolder.open();
      }
      if (light.groundColor !== undefined) {
        lightFolder.addColor(light, 'groundColor').name('Ground Color').onChange(value => {
          updateConfig(c => { c[theme].lights[index].groundColor = value; });
        });
      }
      lightFolder.open();
    });
    lightsFolder.open();
    
    // Background Folder
    const backgroundConf = themeConfig.background;
    const bgFolder = gui.addFolder('Background');
    
    bgFolder.add(backgroundConf, 'type', ['sky', 'stars', 'fog', 'sparkles']).name('Type').onChange(value => {
        updateConfig(c => { c[theme].background.type = value; });
    });

    if (backgroundConf.type === 'sky' && backgroundConf.sunPosition) {
        const sunPosFolder = bgFolder.addFolder('Sun Position');
        sunPosFolder.add(backgroundConf.sunPosition, '0', -200, 200).name('x').onChange(v => updateConfig(c => {c[theme].background.sunPosition![0] = v}));
        sunPosFolder.add(backgroundConf.sunPosition, '1', -200, 200).name('y').onChange(v => updateConfig(c => {c[theme].background.sunPosition![1] = v}));
        sunPosFolder.add(backgroundConf.sunPosition, '2', -200, 200).name('z').onChange(v => updateConfig(c => {c[theme].background.sunPosition![2] = v}));
        sunPosFolder.open();
    } else if (backgroundConf.type === 'stars') {
        if (backgroundConf.radius !== undefined) bgFolder.add(backgroundConf, 'radius', 10, 2000).onChange(v => updateConfig(c => {c[theme].background.radius = v}));
        if (backgroundConf.count !== undefined) bgFolder.add(backgroundConf, 'count', 0, 10000).step(100).onChange(v => updateConfig(c => {c[theme].background.count = v}));
        if (backgroundConf.saturation !== undefined) bgFolder.add(backgroundConf, 'saturation', 0, 2).onChange(v => updateConfig(c => {c[theme].background.saturation = v}));
        if (backgroundConf.factor !== undefined) bgFolder.add(backgroundConf, 'factor', 0, 20).onChange(v => updateConfig(c => {c[theme].background.factor = v}));
        if (backgroundConf.speed !== undefined) bgFolder.add(backgroundConf, 'speed', 0, 5).onChange(v => updateConfig(c => {c[theme].background.speed = v}));
        if (backgroundConf.fade !== undefined) bgFolder.add(backgroundConf, 'fade').onChange(v => updateConfig(c => {c[theme].background.fade = v}));
    } else if (backgroundConf.type === 'sparkles') {
        if (backgroundConf.count !== undefined) bgFolder.add(backgroundConf, 'count', 0, 10000).step(100).onChange(v => updateConfig(c => {c[theme].background.count = v}));
        if (backgroundConf.speed !== undefined) bgFolder.add(backgroundConf, 'speed', 0, 5).onChange(v => updateConfig(c => {c[theme].background.speed = v}));
        if (backgroundConf.opacity !== undefined) bgFolder.add(backgroundConf, 'opacity', 0, 1).onChange(v => updateConfig(c => {c[theme].background.opacity = v}));
        if (backgroundConf.color !== undefined) bgFolder.addColor(backgroundConf, 'color').onChange(v => updateConfig(c => {c[theme].background.color = v}));
        if (backgroundConf.size !== undefined) bgFolder.add(backgroundConf, 'size', 0, 20).onChange(v => updateConfig(c => {c[theme].background.size = v}));
        if (backgroundConf.scale !== undefined) bgFolder.add(backgroundConf, 'scale', 0, 50).onChange(v => updateConfig(c => {c[theme].background.scale = v}));
    } else if (backgroundConf.type === 'fog') {
        if (backgroundConf.color !== undefined) bgFolder.addColor(backgroundConf, 'color').onChange(v => updateConfig(c => {c[theme].background.color = v}));
        if (backgroundConf.near !== undefined) bgFolder.add(backgroundConf, 'near', 0, 100).onChange(v => updateConfig(c => {c[theme].background.near = v}));
        if (backgroundConf.far !== undefined) bgFolder.add(backgroundConf, 'far', 0, 200).onChange(v => updateConfig(c => {c[theme].background.far = v}));
    }

    bgFolder.open();

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneConfig, theme, onUpdate]); // Re-create GUI when config or theme changes

  return (
    <div
      className={`w-full h-full ${
        isMobile ? "max-h-[72vh] overflow-y-auto modal-scrollbar" : ""
      }`}
    >
      <div ref={containerRef} className="[&_.lil-gui]:static [&_.lil-gui.root]:w-full" />
    </div>
  );
};

export default SceneControls;
