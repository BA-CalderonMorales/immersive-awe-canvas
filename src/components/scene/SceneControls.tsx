
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

  // Configuration Update Utility Block
  const updateConfig = (updater: (config: SceneConfig) => void) => {
    const newConfig = JSON.parse(JSON.stringify(sceneConfig));
    updater(newConfig);
    onUpdate(newConfig);
  };

  // Enhanced GUI Styling System Block
  const applyModernStyling = (gui: GUI) => {
    const style = document.createElement('style');
    style.textContent = `
      /* === BASE GUI CONTAINER STYLING === */
      .lil-gui {
        --background-color: hsl(var(--background)/0.98);
        --text-color: hsl(var(--foreground));
        --title-background-color: hsl(var(--primary)/0.1);
        --title-text-color: hsl(var(--primary));
        --widget-color: hsl(var(--primary));
        --hover-color: hsl(var(--primary)/0.1);
        --focus-color: hsl(var(--ring));
        --number-color: hsl(var(--primary));
        --string-color: hsl(var(--muted-foreground));
        
        font-family: ui-sans-serif, system-ui, sans-serif;
        border-radius: 16px;
        backdrop-filter: blur(16px);
        border: 2px solid hsl(var(--border));
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        font-size: ${isMobile ? '16px' : '14px'};
      }
      
      /* === CONTROLLER STYLING BLOCK === */
      .lil-gui .controller {
        border-radius: 10px;
        margin: 6px 0;
        padding: 8px 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 1px solid transparent;
        background: hsl(var(--muted)/0.05);
      }
      
      .lil-gui .controller:hover {
        background: hsl(var(--accent)/0.15);
        border-color: hsl(var(--border));
        transform: translateY(-1px);
      }
      
      /* === ENHANCED SLIDER STYLING BLOCK === */
      .lil-gui .controller input[type="range"] {
        height: ${isMobile ? '32px' : '28px'};
        border-radius: 16px;
        background: linear-gradient(to right, hsl(var(--primary)/0.2) 0%, hsl(var(--muted)/0.3) 100%);
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        border: 2px solid hsl(var(--border));
        transition: all 0.2s ease;
      }
      
      .lil-gui .controller input[type="range"]:hover {
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.15), 0 0 0 2px hsl(var(--ring)/0.2);
        transform: scale(1.02);
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb {
        width: ${isMobile ? '28px' : '24px'};
        height: ${isMobile ? '28px' : '24px'};
        border-radius: 50%;
        background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%);
        border: 3px solid hsl(var(--background));
        box-shadow: 0 4px 12px rgba(0,0,0,0.25), 0 0 0 1px hsl(var(--border));
        cursor: grab;
        -webkit-appearance: none;
        appearance: none;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.15);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3), 0 0 0 3px hsl(var(--ring)/0.3);
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb:active {
        cursor: grabbing;
        transform: scale(1.1);
      }
      
      .lil-gui .controller input[type="range"]::-moz-range-thumb {
        width: ${isMobile ? '28px' : '24px'};
        height: ${isMobile ? '28px' : '24px'};
        border-radius: 50%;
        background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%);
        border: 3px solid hsl(var(--background));
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        cursor: grab;
      }
      
      /* === BUTTON STYLING BLOCK === */
      .lil-gui .controller button,
      .lil-gui .controller select {
        border-radius: 8px;
        border: 2px solid hsl(var(--border));
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        padding: ${isMobile ? '12px 16px' : '10px 14px'};
        font-weight: 600;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        min-height: ${isMobile ? '48px' : '40px'};
        cursor: pointer;
      }
      
      .lil-gui .controller button:hover,
      .lil-gui .controller select:hover {
        background: hsl(var(--accent));
        border-color: hsl(var(--primary));
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      
      .lil-gui .controller button:active {
        transform: translateY(0);
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      }
      
      /* === FOLDER STYLING BLOCK === */
      .lil-gui .folder > .title {
        background: linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--muted)/0.1) 100%);
        border-radius: 12px;
        margin-bottom: 12px;
        padding: ${isMobile ? '16px 20px' : '12px 16px'};
        font-weight: 700;
        font-size: ${isMobile ? '18px' : '16px'};
        transition: all 0.3s ease;
        border: 1px solid hsl(var(--border));
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      }
      
      .lil-gui .folder > .title:hover {
        background: linear-gradient(135deg, hsl(var(--primary)/0.15) 0%, hsl(var(--muted)/0.15) 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      }
      
      /* === COLOR PICKER STYLING BLOCK === */
      .lil-gui .controller .color input[type="color"] {
        border-radius: 12px;
        border: 3px solid hsl(var(--border));
        transition: all 0.2s ease;
        width: ${isMobile ? '60px' : '50px'};
        height: ${isMobile ? '60px' : '50px'};
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }
      
      .lil-gui .controller .color input[type="color"]:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        border-color: hsl(var(--primary));
      }
      
      /* === CHECKBOX STYLING BLOCK === */
      .lil-gui .controller input[type="checkbox"] {
        width: ${isMobile ? '28px' : '24px'};
        height: ${isMobile ? '28px' : '24px'};
        cursor: pointer;
        accent-color: hsl(var(--primary));
      }
      
      /* === MOBILE OPTIMIZATIONS BLOCK === */
      ${isMobile ? `
        .lil-gui {
          font-size: 16px;
          max-height: 50vh;
          overflow-y: auto;
        }
        
        .lil-gui .controller {
          padding: 12px 16px;
          margin: 8px 0;
        }
        
        .lil-gui .controller input[type="range"] {
          touch-action: manipulation;
          min-height: 44px;
        }
        
        .lil-gui .folder > .title {
          font-size: 18px;
          padding: 16px 20px;
        }
        
        /* Ensure touch targets are at least 44px */
        .lil-gui .controller button,
        .lil-gui .controller select,
        .lil-gui .controller input {
          min-height: 44px;
          min-width: 44px;
        }
      ` : ''}
      
      /* === ACCESSIBILITY ENHANCEMENTS BLOCK === */
      .lil-gui .controller:focus-within {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }
      
      .lil-gui .controller input:focus,
      .lil-gui .controller button:focus,
      .lil-gui .controller select:focus {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }
    `;
    document.head.appendChild(style);
  };

  // Main Object Configuration Block
  const setupMainObjectControls = (gui: GUI, themeConfig: any) => {
    const mainFolder = gui.addFolder('🎨 Main Object');
    
    // Color Control with Enhanced UX
    mainFolder.addColor(themeConfig, 'mainObjectColor')
      .name('Object Color')
      .onChange((value: string) => {
        updateConfig(config => { config[theme].mainObjectColor = value; });
      });

    // Material Configuration Block
    if (themeConfig.material) {
      const materialFolder = mainFolder.addFolder('⚡ Material Settings');
      const material = themeConfig.material;
      
      // Material Type with Better Labels
      materialFolder.add(material, 'materialType', {
        'Basic (Fast)': 'basic',
        'MatCap (Stylized)': 'matcap', 
        'Normal (Debug)': 'normal'
      }).name('Material Type').onChange(value => {
        updateConfig(c => { c[theme].material.materialType = value; });
      });

      // Core Properties with Descriptive Names
      if (material.wireframe !== undefined) {
        materialFolder.add(material, 'wireframe')
          .name('Show Wireframe')
          .onChange(value => updateConfig(c => { c[theme].material.wireframe = value; }));
      }

      if (material.opacity !== undefined) {
        materialFolder.add(material, 'opacity', 0, 1, 0.01)
          .name('Transparency')
          .onChange(value => updateConfig(c => { c[theme].material.opacity = value; }));
      }

      if (material.emissiveIntensity !== undefined) {
        materialFolder.add(material, 'emissiveIntensity', 0, 3, 0.01)
          .name('Glow Strength')
          .onChange(value => updateConfig(c => { c[theme].material.emissiveIntensity = value; }));
      }

      // MatCap Selection
      if (material.materialType === 'matcap') {
        materialFolder.add(material, 'matcapTexture', {
          'Chrome': 'chrome',
          'Purple': 'purple', 
          'Gold': 'gold'
        }).name('MatCap Style')
          .onChange(value => updateConfig(c => { c[theme].material.matcapTexture = value; }));
      }

      materialFolder.open();
    }

    // Geometry-Specific Controls Block
    if (sceneConfig.type === 'TorusKnot' && themeConfig.torusKnot) {
      const geometryFolder = mainFolder.addFolder('🔮 Shape Parameters');
      const torusKnot = themeConfig.torusKnot;
      
      if (torusKnot.p !== undefined) {
        geometryFolder.add(torusKnot, 'p', 1, 20, 1)
          .name('P Value (Complexity)')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.p = value; }));
      }
      if (torusKnot.q !== undefined) {
        geometryFolder.add(torusKnot, 'q', 1, 20, 1)
          .name('Q Value (Twist)')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.q = value; }));
      }
      if (torusKnot.radius !== undefined) {
        geometryFolder.add(torusKnot, 'radius', 0.1, 5, 0.01)
          .name('Base Size')
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
      const lightFolder = lightsFolder.addFolder(`${getLightIcon(light.type)} ${light.type} Light`);
      
      if (light.intensity !== undefined) {
        lightFolder.add(light, 'intensity', 0, 10, 0.01)
          .name('Light Power')
          .onChange(value => updateConfig(c => { c[theme].lights[index].intensity = value; }));
      }
      
      if (light.color !== undefined) {
        lightFolder.addColor(light, 'color')
          .name('Light Tint')
          .onChange(value => updateConfig(c => { c[theme].lights[index].color = value; }));
      }
      
      if (light.position) {
        const posFolder = lightFolder.addFolder('📍 Position');
        posFolder.add(light.position, '0', -200, 200, 1)
          .name('Left ↔ Right')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![0] = v; }));
        posFolder.add(light.position, '1', -200, 200, 1)
          .name('Down ↔ Up')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![1] = v; }));
        posFolder.add(light.position, '2', -200, 200, 1)
          .name('Back ↔ Forward')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![2] = v; }));
        posFolder.open();
      }
      
      lightFolder.open();
    });
    
    lightsFolder.open();
  };

  // Background Environment Configuration Block
  const setupBackgroundControls = (gui: GUI, themeConfig: any) => {
    const backgroundFolder = gui.addFolder('🌍 Environment');
    const bg = themeConfig.background;
    
    // Background Type with Better Labels
    backgroundFolder.add(bg, 'type', {
      'Solid Color': 'color',
      'Color Gradient': 'gradient', 
      'Starfield': 'stars',
      'Sparkles': 'sparkles',
      'Sky Dome': 'sky',
      'Fog Effect': 'fog',
      'HDRI Environment': 'environment',
      'Noise Pattern': 'noise',
      'Plasma Effect': 'plasma',
      'Aurora Lights': 'aurora',
      'Deep Void': 'void'
    }).name('Background Type').onChange(value => {
      updateConfig(c => {
        const background = c[theme].background;
        background.type = value;
        
        // Smart defaults for different background types
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

  // Background-Specific Configuration Helper Block
  const setupBackgroundSpecificControls = (folder: GUI, bg: any) => {
    switch (bg.type) {
      case 'environment':
        if (bg.preset !== undefined) {
          folder.add(bg, 'preset', {
            'Modern Apartment': 'apartment',
            'City Skyline': 'city',
            'Dawn Sky': 'dawn',
            'Forest': 'forest',
            'Hotel Lobby': 'lobby',
            'Night Sky': 'night',
            'City Park': 'park',
            'Photo Studio': 'studio',
            'Sunset': 'sunset',
            'Warehouse': 'warehouse'
          }).name('Environment').onChange(v => updateConfig(c => { c[theme].background.preset = v; }));
        }
        if (bg.blur !== undefined) {
          folder.add(bg, 'blur', 0, 1, 0.01)
            .name('Blur Amount')
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
            .name('Field Radius')
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
            .name('Fog Thickness')
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

  // Main Effect Block - GUI Setup and Cleanup
  useEffect(() => {
    if (!containerRef.current) return;

    // Cleanup previous GUI instance
    if (guiRef.current) {
      guiRef.current.destroy();
    }

    // Create optimized GUI instance
    const gui = new GUI({ 
      container: containerRef.current,
      width: isMobile ? Math.min(window.innerWidth * 0.9, 350) : 380,
      title: isMobile ? '' : 'Scene Editor'
    });
    
    guiRef.current = gui;
    applyModernStyling(gui);

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
