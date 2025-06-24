
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

  // Enhanced GUI styling system
  const applyEnhancedStyling = (gui: GUI) => {
    const style = document.createElement('style');
    style.textContent = `
      /* Base GUI Container Styling */
      .lil-gui {
        --background-color: hsl(var(--background)/0.95);
        --text-color: hsl(var(--foreground));
        --title-background-color: hsl(var(--muted)/0.8);
        --title-text-color: hsl(var(--muted-foreground));
        --widget-color: hsl(var(--primary));
        --hover-color: hsl(var(--accent));
        --focus-color: hsl(var(--ring));
        --number-color: hsl(var(--primary));
        --string-color: hsl(var(--secondary));
        
        font-family: ui-sans-serif, system-ui, sans-serif;
        border-radius: 12px;
        backdrop-filter: blur(12px);
        border: 1px solid hsl(var(--border)/0.5);
        box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      }
      
      /* Enhanced Controller Styling */
      .lil-gui .controller {
        border-radius: 6px;
        margin: 3px 0;
        padding: 2px 4px;
        transition: all 0.2s ease;
      }
      
      .lil-gui .controller:hover {
        background: hsl(var(--accent)/0.1);
      }
      
      /* Improved Range Slider Styling */
      .lil-gui .controller input[type="range"] {
        height: 24px;
        border-radius: 12px;
        background: hsl(var(--muted)/0.3);
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: hsl(var(--primary));
        border: 2px solid hsl(var(--background));
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        transition: all 0.2s ease;
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      
      .lil-gui .controller input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 10px;
        background: hsl(var(--primary));
        border: 2px solid hsl(var(--background));
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
      }
      
      /* Enhanced Folder Styling */
      .lil-gui .folder > .title {
        background: hsl(var(--muted)/0.6);
        border-radius: 6px;
        margin-bottom: 6px;
        padding: 8px 12px;
        font-weight: 600;
        transition: all 0.2s ease;
      }
      
      .lil-gui .folder > .title:hover {
        background: hsl(var(--muted)/0.8);
      }
      
      /* Color Picker Enhancements */
      .lil-gui .controller .color input[type="color"] {
        border-radius: 6px;
        border: 2px solid hsl(var(--border));
        transition: all 0.2s ease;
      }
      
      /* Select Dropdown Styling */
      .lil-gui .controller select {
        border-radius: 6px;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        padding: 4px 8px;
      }
      
      /* Mobile-specific adjustments */
      ${isMobile ? `
        .lil-gui {
          font-size: 14px;
        }
        
        .lil-gui .controller input[type="range"] {
          height: 28px;
          touch-action: manipulation;
        }
        
        .lil-gui .controller input[type="range"]::-webkit-slider-thumb {
          width: 24px;
          height: 24px;
        }
        
        .lil-gui .folder > .title {
          padding: 10px 12px;
          font-size: 15px;
        }
      ` : ''}
    `;
    document.head.appendChild(style);
  };

  // Main Object Configuration Block
  const setupMainObjectControls = (gui: GUI, themeConfig: any) => {
    const mainFolder = gui.addFolder('🎨 Main Object');
    
    // Color Control
    mainFolder.addColor(themeConfig, 'mainObjectColor')
      .name('Color')
      .onChange((value: string) => {
        updateConfig(config => { config[theme].mainObjectColor = value; });
      });

    // Material Configuration Block
    if (themeConfig.material) {
      const materialFolder = mainFolder.addFolder('⚡ Material Properties');
      const material = themeConfig.material;
      
      // Material Type Selection
      materialFolder.add(material, 'materialType', [
        'basic', 'matcap', 'normal', 'standard', 'physical', 'toon', 'lambert', 'phong'
      ]).name('Material Type').onChange(value => {
        updateConfig(c => { c[theme].material.materialType = value; });
      });

      // Core Material Properties
      if (material.wireframe !== undefined) {
        materialFolder.add(material, 'wireframe')
          .name('Wireframe Mode')
          .onChange(value => updateConfig(c => { c[theme].material.wireframe = value; }));
      }

      if (material.opacity !== undefined) {
        materialFolder.add(material, 'opacity', 0, 1, 0.01)
          .name('Opacity')
          .onChange(value => updateConfig(c => { c[theme].material.opacity = value; }));
      }

      if (material.emissiveIntensity !== undefined) {
        materialFolder.add(material, 'emissiveIntensity', 0, 3, 0.01)
          .name('Glow Intensity')
          .onChange(value => updateConfig(c => { c[theme].material.emissiveIntensity = value; }));
      }

      // Advanced Material Properties
      if (material.materialType === 'standard' || material.materialType === 'physical') {
        if (material.roughness !== undefined) {
          materialFolder.add(material, 'roughness', 0, 1, 0.01)
            .name('Surface Roughness')
            .onChange(value => updateConfig(c => { c[theme].material.roughness = value; }));
        }
        if (material.metalness !== undefined) {
          materialFolder.add(material, 'metalness', 0, 1, 0.01)
            .name('Metallic Factor')
            .onChange(value => updateConfig(c => { c[theme].material.metalness = value; }));
        }
      }

      // Matcap Texture Selection
      if (material.materialType === 'matcap') {
        materialFolder.add(material, 'matcapTexture', ['chrome', 'purple', 'gold'])
          .name('Matcap Style')
          .onChange(value => updateConfig(c => { c[theme].material.matcapTexture = value; }));
      }

      materialFolder.open();
    }

    // Geometry-Specific Controls
    if (sceneConfig.type === 'TorusKnot' && themeConfig.torusKnot) {
      const geometryFolder = mainFolder.addFolder('🔮 Torus Knot Shape');
      const torusKnot = themeConfig.torusKnot;
      
      if (torusKnot.p !== undefined) {
        geometryFolder.add(torusKnot, 'p', 1, 20, 1)
          .name('P Parameter')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.p = value; }));
      }
      if (torusKnot.q !== undefined) {
        geometryFolder.add(torusKnot, 'q', 1, 20, 1)
          .name('Q Parameter')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.q = value; }));
      }
      if (torusKnot.radius !== undefined) {
        geometryFolder.add(torusKnot, 'radius', 0.1, 5, 0.01)
          .name('Base Radius')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.radius = value; }));
      }
      
      geometryFolder.open();
    }

    mainFolder.open();
  };

  // Lighting System Configuration Block
  const setupLightingControls = (gui: GUI, themeConfig: any) => {
    const lightsFolder = gui.addFolder('💡 Lighting System');
    
    themeConfig.lights.forEach((light: any, index: number) => {
      const lightFolder = lightsFolder.addFolder(`${getLightIcon(light.type)} ${light.type} Light ${index + 1}`);
      
      if (light.intensity !== undefined) {
        lightFolder.add(light, 'intensity', 0, 10, 0.01)
          .name('Brightness')
          .onChange(value => updateConfig(c => { c[theme].lights[index].intensity = value; }));
      }
      
      if (light.color !== undefined) {
        lightFolder.addColor(light, 'color')
          .name('Light Color')
          .onChange(value => updateConfig(c => { c[theme].lights[index].color = value; }));
      }
      
      if (light.position) {
        const posFolder = lightFolder.addFolder('📍 Position');
        posFolder.add(light.position, '0', -200, 200, 1)
          .name('X Position')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![0] = v; }));
        posFolder.add(light.position, '1', -200, 200, 1)
          .name('Y Position')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![1] = v; }));
        posFolder.add(light.position, '2', -200, 200, 1)
          .name('Z Position')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![2] = v; }));
        posFolder.open();
      }
      
      lightFolder.open();
    });
    
    lightsFolder.open();
  };

  // Background Environment Configuration Block
  const setupBackgroundControls = (gui: GUI, themeConfig: any) => {
    const backgroundFolder = gui.addFolder('🌍 Background Environment');
    const bg = themeConfig.background;
    
    // Background Type Selection
    backgroundFolder.add(bg, 'type', [
      'color', 'gradient', 'stars', 'sparkles', 'sky', 'fog', 
      'environment', 'noise', 'plasma', 'aurora', 'void'
    ]).name('Environment Type').onChange(value => {
      updateConfig(c => {
        const background = c[theme].background;
        background.type = value;
        
        // Intelligent default configurations
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
          Object.assign(background, defaults[value as keyof typeof defaults]);
        }
      });
    });

    // Dynamic Background-Specific Controls
    setupBackgroundSpecificControls(backgroundFolder, bg);
    backgroundFolder.open();
  };

  // Background-Specific Configuration Helper
  const setupBackgroundSpecificControls = (folder: GUI, bg: any) => {
    switch (bg.type) {
      case 'environment':
        if (bg.preset !== undefined) {
          folder.add(bg, 'preset', [
            'apartment', 'city', 'dawn', 'forest', 'lobby', 
            'night', 'park', 'studio', 'sunset', 'warehouse'
          ]).name('Environment Preset').onChange(v => updateConfig(c => { c[theme].background.preset = v; }));
        }
        if (bg.blur !== undefined) {
          folder.add(bg, 'blur', 0, 1, 0.01)
            .name('Environment Blur')
            .onChange(v => updateConfig(c => { c[theme].background.blur = v; }));
        }
        break;
        
      case 'gradient':
        if (bg.colorTop) {
          folder.addColor(bg, 'colorTop')
            .name('Top Color')
            .onChange(v => updateConfig(c => { c[theme].background.colorTop = v; }));
        }
        if (bg.colorBottom) {
          folder.addColor(bg, 'colorBottom')
            .name('Bottom Color')
            .onChange(v => updateConfig(c => { c[theme].background.colorBottom = v; }));
        }
        if (bg.speed !== undefined) {
          folder.add(bg, 'speed', 0, 2, 0.01)
            .name('Animation Speed')
            .onChange(v => updateConfig(c => { c[theme].background.speed = v; }));
        }
        break;
        
      case 'stars':
        if (bg.count !== undefined) {
          folder.add(bg, 'count', 1000, 20000, 100)
            .name('Star Count')
            .onChange(v => updateConfig(c => { c[theme].background.count = v; }));
        }
        if (bg.radius !== undefined) {
          folder.add(bg, 'radius', 10, 500, 1)
            .name('Star Field Radius')
            .onChange(v => updateConfig(c => { c[theme].background.radius = v; }));
        }
        if (bg.speed !== undefined) {
          folder.add(bg, 'speed', 0, 5, 0.01)
            .name('Motion Speed')
            .onChange(v => updateConfig(c => { c[theme].background.speed = v; }));
        }
        break;
        
      case 'sparkles':
        if (bg.count !== undefined) {
          folder.add(bg, 'count', 10, 500, 10)
            .name('Sparkle Count')
            .onChange(v => updateConfig(c => { c[theme].background.count = v; }));
        }
        if (bg.size !== undefined) {
          folder.add(bg, 'size', 0.5, 10, 0.1)
            .name('Sparkle Size')
            .onChange(v => updateConfig(c => { c[theme].background.size = v; }));
        }
        if (bg.speed !== undefined) {
          folder.add(bg, 'speed', 0, 2, 0.01)
            .name('Animation Speed')
            .onChange(v => updateConfig(c => { c[theme].background.speed = v; }));
        }
        break;
        
      case 'fog':
        if (bg.color) {
          folder.addColor(bg, 'color')
            .name('Fog Color')
            .onChange(v => updateConfig(c => { c[theme].background.color = v; }));
        }
        if (bg.density !== undefined) {
          folder.add(bg, 'density', 0, 0.1, 0.001)
            .name('Fog Density')
            .onChange(v => updateConfig(c => { c[theme].background.density = v; }));
        }
        break;
    }
  };

  // Utility function for light type icons
  const getLightIcon = (type: string) => {
    const icons = {
      ambient: '🌐',
      directional: '☀️',
      point: '💡',
      hemisphere: '🌅'
    };
    return icons[type as keyof typeof icons] || '💡';
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous GUI instance
    if (guiRef.current) {
      guiRef.current.destroy();
    }

    // Create optimized GUI instance
    const gui = new GUI({ 
      container: containerRef.current,
      width: isMobile ? Math.min(window.innerWidth * 0.45, 300) : 350,
      title: isMobile ? '' : 'Scene Editor'
    });
    
    guiRef.current = gui;
    applyEnhancedStyling(gui);

    const themeConfig = sceneConfig[theme];

    // Build organized control sections
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
          [&_.lil-gui.popup]:rounded-xl
          [&_.lil-gui.popup]:border
          [&_.lil-gui.popup]:border-border/50
          [&_.lil-gui.popup]:bg-background/95
          [&_.lil-gui.popup]:backdrop-blur-md
          [&_.lil-gui.popup]:p-2
          [&_.lil-gui.popup]:text-foreground
          [&_.lil-gui.popup]:shadow-2xl
        "
      />
    </div>
  );
};

export default SceneControls;
