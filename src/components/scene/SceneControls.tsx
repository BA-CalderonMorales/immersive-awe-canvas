
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
    
    bgFolder.add(backgroundConf, 'type', ['sky', 'stars', 'fog', 'sparkles', 'color']).name('Type').onChange(value => {
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
    } else if (backgroundConf.type === 'color') {
        if (backgroundConf.color !== undefined) bgFolder.addColor(backgroundConf, 'color').onChange(v => updateConfig(c => {c[theme].background.color = v}));
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
      <div
        ref={containerRef}
        className="
          [&_.lil-gui]:static
          [&_.lil-gui.root]:w-full
          [&_.lil-gui.popup]:z-50
          [&_.lil-gui.popup]:rounded-md
          [&_.lil-gui.popup]:border
          [&_.lil-gui.popup]:border-border
          [&_.lil-gui.popup]:bg-popover
          [&_.lil-gui.popup]:p-1
          [&_.lil-gui.popup]:text-popover-foreground
          [&_.lil-gui.popup]:shadow-lg
          [&_.lil-gui.popup_.lil-gui_ul]:p-0
          [&_.lil-gui.popup_.lil-gui_ul_li]:px-2
          [&_.lil-gui.popup_.lil-gui_ul_li:hover]:bg-accent
        "
      />
    </div>
  );
};

export default SceneControls;
