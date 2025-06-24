
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

  // Enhanced GUI Styling System Block - Fixed jiggle and improved UX
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
        font-weight: 500;
        position: relative;
        overflow: hidden;
      }
      
      /* === CONTROLLER STYLING BLOCK - FIXED JIGGLE ISSUE === */
      .lil-gui .controller {
        border-radius: 10px;
        margin: 6px 0;
        padding: 10px 14px;
        border: 1px solid transparent;
        background: hsl(var(--muted)/0.05);
        transition: background-color 0.2s ease, border-color 0.2s ease;
        /* FIXED: Remove transform on hover to prevent jiggle */
        position: relative;
        min-height: ${isMobile ? '48px' : '40px'};
        display: flex;
        align-items: center;
      }
      
      .lil-gui .controller:hover {
        background: hsl(var(--accent)/0.15);
        border-color: hsl(var(--border));
        /* REMOVED: transform: translateY(-1px); - this caused the jiggle */
      }
      
      /* === ENHANCED SLIDER STYLING BLOCK - IMPROVED CLICK ANYWHERE === */
      .lil-gui .controller input[type="range"] {
        height: ${isMobile ? '32px' : '28px'};
        border-radius: 16px;
        background: linear-gradient(to right, hsl(var(--primary)/0.3) 0%, hsl(var(--muted)/0.3) 100%);
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        border: 2px solid hsl(var(--border));
        transition: all 0.2s ease;
        width: 100%;
        /* IMPROVED: Better click area */
        position: relative;
        z-index: 1;
      }
      
      .lil-gui .controller input[type="range"]:hover {
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.15), 0 0 0 2px hsl(var(--ring)/0.2);
        /* REMOVED: transform: scale(1.02); - prevented smooth interaction */
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
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        z-index: 2;
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0,0,0,0.3), 0 0 0 3px hsl(var(--ring)/0.3);
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb:active {
        cursor: grabbing;
        transform: scale(1.05);
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
      
      /* === BUTTON STYLING BLOCK - FIXED DROPDOWN JIGGLE === */
      .lil-gui .controller button,
      .lil-gui .controller select {
        border-radius: 8px;
        border: 2px solid hsl(var(--border));
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        padding: ${isMobile ? '12px 16px' : '10px 14px'};
        font-weight: 600;
        transition: background-color 0.2s ease, border-color 0.2s ease;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        min-height: ${isMobile ? '48px' : '40px'};
        cursor: pointer;
        width: 100%;
        font-size: ${isMobile ? '16px' : '14px'};
        /* FIXED: Prevent layout shift */
        position: relative;
      }
      
      .lil-gui .controller button:hover,
      .lil-gui .controller select:hover {
        background: hsl(var(--accent));
        border-color: hsl(var(--primary));
        /* REMOVED: transform and extra box-shadow to prevent jiggle */
      }
      
      .lil-gui .controller button:active,
      .lil-gui .controller select:active {
        background: hsl(var(--accent)/0.8);
        /* REMOVED: transform to prevent jump */
      }
      
      /* === FOLDER STYLING BLOCK - STABLE POSITIONING === */
      .lil-gui .folder > .title {
        background: linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--muted)/0.1) 100%);
        border-radius: 12px;
        margin-bottom: 12px;
        padding: ${isMobile ? '16px 20px' : '12px 16px'};
        font-weight: 700;
        font-size: ${isMobile ? '18px' : '16px'};
        transition: background-color 0.2s ease;
        border: 1px solid hsl(var(--border));
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        cursor: pointer;
        /* FIXED: Prevent layout shift on hover */
        position: relative;
      }
      
      .lil-gui .folder > .title:hover {
        background: linear-gradient(135deg, hsl(var(--primary)/0.15) 0%, hsl(var(--muted)/0.15) 100%);
        /* REMOVED: transform to prevent jiggle */
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
      
      /* === PROFESSIONAL LABEL STYLING === */
      .lil-gui .controller .name {
        font-weight: 600;
        color: hsl(var(--foreground));
        margin-right: 12px;
        min-width: ${isMobile ? '120px' : '100px'};
        font-size: ${isMobile ? '16px' : '14px'};
      }
      
      /* === MOBILE OPTIMIZATIONS BLOCK === */
      ${isMobile ? `
        .lil-gui {
          font-size: 16px;
          max-height: 50vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .lil-gui .controller {
          padding: 14px 18px;
          margin: 10px 0;
        }
        
        .lil-gui .controller input[type="range"] {
          touch-action: manipulation;
          min-height: 44px;
        }
        
        .lil-gui .folder > .title {
          font-size: 18px;
          padding: 18px 22px;
        }
        
        /* Ensure touch targets are at least 44px */
        .lil-gui .controller button,
        .lil-gui .controller select,
        .lil-gui .controller input {
          min-height: 48px;
          min-width: 48px;
        }
        
        /* Better mobile scrolling */
        .lil-gui .children {
          max-height: none;
        }
      ` : ''}
      
      /* === ACCESSIBILITY ENHANCEMENTS BLOCK === */
      .lil-gui .controller:focus-within {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
        border-radius: 12px;
      }
      
      .lil-gui .controller input:focus,
      .lil-gui .controller button:focus,
      .lil-gui .controller select:focus {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }
      
      /* === SMOOTH INTERACTION BLOCK === */
      .lil-gui * {
        box-sizing: border-box;
      }
      
      .lil-gui .controller input,
      .lil-gui .controller button,
      .lil-gui .controller select {
        will-change: auto;
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
        'Standard (Realistic)': 'standard',
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

      // Standard Material Properties
      if (material.materialType === 'standard') {
        if (material.roughness !== undefined) {
          materialFolder.add(material, 'roughness', 0, 1, 0.01)
            .name('Surface Roughness')
            .onChange(value => updateConfig(c => { c[theme].material.roughness = value; }));
        }
        
        if (material.metalness !== undefined) {
          materialFolder.add(material, 'metalness', 0, 1, 0.01)
            .name('Metallic Look')
            .onChange(value => updateConfig(c => { c[theme].material.metalness = value; }));
        }
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
      if (torusKnot.tube !== undefined) {
        geometryFolder.add(torusKnot, 'tube', 0.01, 1, 0.01)
          .name('Tube Thickness')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.tube = value; }));
      }
      
      geometryFolder.open();
    }

    mainFolder.open();
  };

  // Lighting System Configuration Block - TONED DOWN DEFAULTS
  const setupLightingControls = (gui: GUI, themeConfig: any) => {
    const lightsFolder = gui.addFolder('💡 Lighting System');
    
    themeConfig.lights.forEach((light: any, index: number) => {
      const lightFolder = lightsFolder.addFolder(`${getLightIcon(light.type)} ${light.type} Light`);
      
      if (light.intensity !== undefined) {
        // FIXED: Reduced default max intensity from 10 to 5 for less brightness
        lightFolder.add(light, 'intensity', 0, 5, 0.01)
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

  // Background Environment Configuration Block - EXPANDED
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

  // Background-Specific Configuration Helper Block - EXPANDED
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
        if (bg.factor !== undefined) {
          folder.add(bg, 'factor', 1, 10, 0.1)
            .name('Star Brightness')
            .onChange(v => updateConfig(c => { c[theme].background.factor = v; }));
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
        if (bg.opacity !== undefined) {
          folder.add(bg, 'opacity', 0, 1, 0.01)
            .name('Sparkle Opacity')
            .onChange(v => updateConfig(c => { c[theme].background.opacity = v; }));
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
        if (bg.near !== undefined) {
          folder.add(bg, 'near', 0.1, 50, 0.1)
            .name('Fog Start Distance')
            .onChange(v => updateConfig(c => { c[theme].background.near = v; }));
        }
        if (bg.far !== undefined) {
          folder.add(bg, 'far', 10, 1000, 10)
            .name('Fog End Distance')
            .onChange(v => updateConfig(c => { c[theme].background.far = v; }));
        }
        break;
        
      case 'noise':
        if (bg.noiseScale !== undefined) {
          folder.add(bg, 'noiseScale', 1, 50, 0.1)
            .name('Noise Scale')
            .onChange(v => updateConfig(c => { c[theme].background.noiseScale = v; }));
        }
        if (bg.noiseIntensity !== undefined) {
          folder.add(bg, 'noiseIntensity', 0, 2, 0.01)
            .name('Noise Intensity')
            .onChange(v => updateConfig(c => { c[theme].background.noiseIntensity = v; }));
        }
        if (bg.noiseSpeed !== undefined) {
          folder.add(bg, 'noiseSpeed', 0, 1, 0.01)
            .name('Animation Speed')
            .onChange(v => updateConfig(c => { c[theme].background.noiseSpeed = v; }));
        }
        break;
        
      case 'plasma':
        if (bg.plasmaSpeed !== undefined) {
          folder.add(bg, 'plasmaSpeed', 0, 5, 0.01)
            .name('Plasma Speed')
            .onChange(v => updateConfig(c => { c[theme].background.plasmaSpeed = v; }));
        }
        if (bg.plasmaIntensity !== undefined) {
          folder.add(bg, 'plasmaIntensity', 0, 2, 0.01)
            .name('Plasma Intensity')
            .onChange(v => updateConfig(c => { c[theme].background.plasmaIntensity = v; }));
        }
        break;
        
      case 'aurora':
        if (bg.auroraSpeed !== undefined) {
          folder.add(bg, 'auroraSpeed', 0, 2, 0.01)
            .name('Aurora Speed')
            .onChange(v => updateConfig(c => { c[theme].background.auroraSpeed = v; }));
        }
        if (bg.auroraIntensity !== undefined) {
          folder.add(bg, 'auroraIntensity', 0, 5, 0.01)
            .name('Aurora Intensity')
            .onChange(v => updateConfig(c => { c[theme].background.auroraIntensity = v; }));
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
