
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

  // Configuration update utility
  const updateConfig = (updater: (config: SceneConfig) => void) => {
    const newConfig = JSON.parse(JSON.stringify(sceneConfig));
    updater(newConfig);
    onUpdate(newConfig);
  };

  // Custom GUI styling for consistent app appearance
  const applyCustomStyling = (gui: GUI) => {
    const style = document.createElement('style');
    style.textContent = `
      .lil-gui {
        --background-color: hsl(var(--background));
        --text-color: hsl(var(--foreground));
        --title-background-color: hsl(var(--muted));
        --title-text-color: hsl(var(--muted-foreground));
        --widget-color: hsl(var(--primary));
        --hover-color: hsl(var(--accent));
        --focus-color: hsl(var(--ring));
        --number-color: hsl(var(--primary));
        --string-color: hsl(var(--secondary));
        font-family: ui-sans-serif, system-ui, sans-serif;
        border-radius: 8px;
        backdrop-filter: blur(8px);
        border: 1px solid hsl(var(--border));
      }
      
      .lil-gui .controller {
        border-radius: 4px;
        margin: 2px 0;
      }
      
      .lil-gui .controller input[type="range"] {
        height: 20px;
        border-radius: 10px;
        background: hsl(var(--muted));
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb {
        width: 16px;
        height: 16px;
        border-radius: 8px;
        background: hsl(var(--primary));
        border: 2px solid hsl(var(--background));
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      
      .lil-gui .folder > .title {
        background: hsl(var(--muted));
        border-radius: 4px;
        margin-bottom: 4px;
      }
    `;
    document.head.appendChild(style);
  };

  // Main object configuration block
  const setupMainObjectControls = (gui: GUI, themeConfig: any) => {
    const mainObjectFolder = gui.addFolder('Main Object');
    
    // Color control
    mainObjectFolder.addColor(themeConfig, 'mainObjectColor')
      .name('Color')
      .onChange((value: string) => {
        updateConfig(config => { config[theme].mainObjectColor = value; });
      });

    // Material controls block
    const material = themeConfig.material;
    if (material) {
      const materialFolder = mainObjectFolder.addFolder('Material');
      
      // Material type selector
      materialFolder.add(material, 'materialType', [
        'basic', 'matcap', 'normal', 'standard', 'physical', 'toon', 'lambert', 'phong'
      ]).name('Type').onChange(value => {
        updateConfig(c => { c[theme].material.materialType = value; });
      });

      // Performance-oriented material properties
      if (material.wireframe !== undefined) {
        materialFolder.add(material, 'wireframe')
          .name('Wireframe')
          .onChange(value => updateConfig(c => { c[theme].material.wireframe = value; }));
      }

      // Enhanced slider controls for precise adjustment
      if (material.opacity !== undefined) {
        materialFolder.add(material, 'opacity', 0, 1, 0.01)
          .name('Opacity')
          .onChange(value => updateConfig(c => { c[theme].material.opacity = value; }));
      }

      if (material.emissiveIntensity !== undefined) {
        materialFolder.add(material, 'emissiveIntensity', 0, 2, 0.01)
          .name('Glow')
          .onChange(value => updateConfig(c => { c[theme].material.emissiveIntensity = value; }));
      }

      // Conditional material properties
      if (material.materialType === 'standard' || material.materialType === 'physical') {
        if (material.roughness !== undefined) {
          materialFolder.add(material, 'roughness', 0, 1, 0.01)
            .name('Roughness')
            .onChange(value => updateConfig(c => { c[theme].material.roughness = value; }));
        }
        if (material.metalness !== undefined) {
          materialFolder.add(material, 'metalness', 0, 1, 0.01)
            .name('Metalness')
            .onChange(value => updateConfig(c => { c[theme].material.metalness = value; }));
        }
      }

      if (material.materialType === 'matcap') {
        materialFolder.add(material, 'matcapTexture', ['chrome', 'purple', 'gold'])
          .name('Style')
          .onChange(value => updateConfig(c => { c[theme].material.matcapTexture = value; }));
      }

      materialFolder.open();
    }

    // Geometry-specific controls block
    if (sceneConfig.type === 'TorusKnot' && themeConfig.torusKnot) {
      const torusKnot = themeConfig.torusKnot;
      const geometryFolder = mainObjectFolder.addFolder('Geometry');
      
      if (torusKnot.p !== undefined) {
        geometryFolder.add(torusKnot, 'p', 1, 20, 1)
          .name('P Value')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.p = value; }));
      }
      if (torusKnot.q !== undefined) {
        geometryFolder.add(torusKnot, 'q', 1, 20, 1)
          .name('Q Value')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.q = value; }));
      }
      if (torusKnot.radius !== undefined) {
        geometryFolder.add(torusKnot, 'radius', 0.1, 5, 0.01)
          .name('Radius')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.radius = value; }));
      }
      
      geometryFolder.open();
    }

    mainObjectFolder.open();
  };

  // Lighting configuration block
  const setupLightingControls = (gui: GUI, themeConfig: any) => {
    const lightsFolder = gui.addFolder('Lighting');
    
    themeConfig.lights.forEach((light: any, index: number) => {
      const lightFolder = lightsFolder.addFolder(`${light.type} Light ${index + 1}`);
      
      if (light.intensity !== undefined) {
        lightFolder.add(light, 'intensity', 0, 5, 0.01)
          .name('Intensity')
          .onChange(value => updateConfig(c => { c[theme].lights[index].intensity = value; }));
      }
      
      if (light.color !== undefined) {
        lightFolder.addColor(light, 'color')
          .name('Color')
          .onChange(value => updateConfig(c => { c[theme].lights[index].color = value; }));
      }
      
      if (light.position) {
        const posFolder = lightFolder.addFolder('Position');
        posFolder.add(light.position, '0', -200, 200, 1)
          .name('X')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![0] = v; }));
        posFolder.add(light.position, '1', -200, 200, 1)
          .name('Y')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![1] = v; }));
        posFolder.add(light.position, '2', -200, 200, 1)
          .name('Z')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![2] = v; }));
        posFolder.open();
      }
      
      lightFolder.open();
    });
    
    lightsFolder.open();
  };

  // Background configuration block
  const setupBackgroundControls = (gui: GUI, themeConfig: any) => {
    const backgroundConf = themeConfig.background;
    const bgFolder = gui.addFolder('Background');
    
    // Background type selector
    bgFolder.add(backgroundConf, 'type', [
      'color', 'gradient', 'stars', 'sparkles', 'sky', 'fog', 
      'environment', 'noise', 'plasma', 'aurora', 'void'
    ]).name('Type').onChange(value => {
      updateConfig(c => {
        const bg = c[theme].background;
        bg.type = value;
        
        // Set intelligent defaults for new background types
        const defaults = {
          environment: { preset: 'night', blur: 0.5 },
          gradient: { colorTop: '#ff6b6b', colorBottom: '#4ecdc4', speed: 0.1 },
          stars: { radius: 100, depth: 50, count: 5000, factor: 4, speed: 1 },
          sparkles: { count: 100, scale: 10, size: 2, speed: 0.3, opacity: 1 },
          fog: { color: '#ffffff', near: 1, far: 100, density: 0.01 },
          noise: { noiseScale: 10.0, noiseIntensity: 0.5, noiseSpeed: 0.1 },
          plasma: { plasmaSpeed: 1.0, plasmaIntensity: 0.5 },
          aurora: { auroraSpeed: 0.5, auroraIntensity: 2.0 }
        };
        
        if (defaults[value as keyof typeof defaults]) {
          Object.assign(bg, defaults[value as keyof typeof defaults]);
        }
      });
    });

    // Dynamic background-specific controls
    const setupBackgroundSpecificControls = () => {
      switch (backgroundConf.type) {
        case 'environment':
          if (backgroundConf.preset !== undefined) {
            bgFolder.add(backgroundConf, 'preset', [
              'apartment', 'city', 'dawn', 'forest', 'lobby', 
              'night', 'park', 'studio', 'sunset', 'warehouse'
            ]).name('Environment').onChange(v => updateConfig(c => { c[theme].background.preset = v; }));
          }
          if (backgroundConf.blur !== undefined) {
            bgFolder.add(backgroundConf, 'blur', 0, 1, 0.01)
              .name('Blur')
              .onChange(v => updateConfig(c => { c[theme].background.blur = v; }));
          }
          break;
          
        case 'gradient':
          if (backgroundConf.colorTop) {
            bgFolder.addColor(backgroundConf, 'colorTop')
              .name('Top Color')
              .onChange(v => updateConfig(c => { c[theme].background.colorTop = v; }));
          }
          if (backgroundConf.colorBottom) {
            bgFolder.addColor(backgroundConf, 'colorBottom')
              .name('Bottom Color')
              .onChange(v => updateConfig(c => { c[theme].background.colorBottom = v; }));
          }
          if (backgroundConf.speed !== undefined) {
            bgFolder.add(backgroundConf, 'speed', 0, 2, 0.01)
              .name('Animation Speed')
              .onChange(v => updateConfig(c => { c[theme].background.speed = v; }));
          }
          break;
          
        case 'stars':
          if (backgroundConf.count !== undefined) {
            bgFolder.add(backgroundConf, 'count', 1000, 20000, 100)
              .name('Count')
              .onChange(v => updateConfig(c => { c[theme].background.count = v; }));
          }
          if (backgroundConf.radius !== undefined) {
            bgFolder.add(backgroundConf, 'radius', 10, 500, 1)
              .name('Radius')
              .onChange(v => updateConfig(c => { c[theme].background.radius = v; }));
          }
          if (backgroundConf.speed !== undefined) {
            bgFolder.add(backgroundConf, 'speed', 0, 5, 0.01)
              .name('Speed')
              .onChange(v => updateConfig(c => { c[theme].background.speed = v; }));
          }
          break;
      }
    };

    setupBackgroundSpecificControls();
    bgFolder.open();
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous GUI
    if (guiRef.current) {
      guiRef.current.destroy();
    }

    // Create new GUI with mobile optimization
    const gui = new GUI({ 
      container: containerRef.current,
      width: isMobile ? Math.min(window.innerWidth * 0.5, 280) : 320
    });
    
    guiRef.current = gui;
    applyCustomStyling(gui);

    const themeConfig = sceneConfig[theme];

    // Organized control blocks
    setupMainObjectControls(gui, themeConfig);
    setupLightingControls(gui, themeConfig);
    setupBackgroundControls(gui, themeConfig);

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneConfig, theme, onUpdate, isMobile]);

  return (
    <div className={`w-full h-full ${isMobile ? "max-h-[50vh] overflow-y-auto" : ""}`}>
      <div
        ref={containerRef}
        className="
          [&_.lil-gui]:static
          [&_.lil-gui.root]:w-full
          [&_.lil-gui.popup]:z-50
          [&_.lil-gui.popup]:rounded-md
          [&_.lil-gui.popup]:border
          [&_.lil-gui.popup]:border-border/50
          [&_.lil-gui.popup]:bg-background/95
          [&_.lil-gui.popup]:backdrop-blur-md
          [&_.lil-gui.popup]:p-1
          [&_.lil-gui.popup]:text-foreground
          [&_.lil-gui.popup]:shadow-2xl
        "
      />
    </div>
  );
};

export default SceneControls;
