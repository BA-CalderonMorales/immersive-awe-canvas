
import { useEffect, useRef, useCallback } from 'react';
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

  // FIXED: Stable update function to prevent GUI re-renders
  const updateConfig = useCallback((updater: (config: SceneConfig) => void) => {
    const newConfig = JSON.parse(JSON.stringify(sceneConfig));
    updater(newConfig);
    onUpdate(newConfig);
  }, [sceneConfig, onUpdate]);

  // FIXED: Completely rewritten styling system to prevent jiggle and improve UX
  const applyModernStyling = (gui: GUI) => {
    const style = document.createElement('style');
    style.textContent = `
      /* BASE GUI CONTAINER - CLEAN AND STABLE */
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
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        font-size: ${isMobile ? '16px' : '14px'};
        font-weight: 500;
        overflow: hidden;
      }
      
      /* CONTROLLER LAYOUT - FIXED JIGGLE ISSUE */
      .lil-gui .controller {
        margin: 4px 0;
        padding: 8px 12px;
        border: 1px solid transparent;
        background: hsl(var(--muted)/0.05);
        transition: background-color 0.15s ease;
        min-height: ${isMobile ? '48px' : '40px'};
        display: flex;
        align-items: center;
        position: relative;
        /* CRITICAL: Prevent layout shift */
        box-sizing: border-box;
      }
      
      .lil-gui .controller:hover {
        background: hsl(var(--accent)/0.1);
        border-color: hsl(var(--border));
      }
      
      /* SLIDER STYLING - IMPROVED USABILITY */
      .lil-gui .controller input[type="range"] {
        height: ${isMobile ? '32px' : '28px'};
        background: linear-gradient(to right, hsl(var(--primary)/0.3) 0%, hsl(var(--muted)/0.3) 100%);
        cursor: pointer;
        -webkit-appearance: none;
        appearance: none;
        border: 2px solid hsl(var(--border));
        transition: box-shadow 0.2s ease;
        width: 100%;
        box-sizing: border-box;
      }
      
      .lil-gui .controller input[type="range"]:hover {
        box-shadow: 0 0 0 2px hsl(var(--ring)/0.2);
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb {
        width: ${isMobile ? '28px' : '24px'};
        height: ${isMobile ? '28px' : '24px'};
        background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%);
        border: 3px solid hsl(var(--background));
        box-shadow: 0 4px 12px rgba(0,0,0,0.25);
        cursor: grab;
        -webkit-appearance: none;
        appearance: none;
        transition: transform 0.15s ease;
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
      }
      
      .lil-gui .controller input[type="range"]::-webkit-slider-thumb:active {
        cursor: grabbing;
        transform: scale(1.05);
      }
      
      /* BUTTON & DROPDOWN STYLING - NO ROUNDED EDGES ON DROPDOWNS */
      .lil-gui .controller button,
      .lil-gui .controller select {
        border: 2px solid hsl(var(--border));
        background: hsl(var(--background));
        color: hsl(var(--foreground));
        padding: ${isMobile ? '12px 16px' : '10px 14px'};
        font-weight: 500;
        transition: background-color 0.15s ease, border-color 0.15s ease;
        min-height: ${isMobile ? '48px' : '40px'};
        cursor: pointer;
        width: 100%;
        font-size: ${isMobile ? '16px' : '14px'};
        box-sizing: border-box;
        /* FIXED: No rounded edges on dropdowns */
        border-radius: 0;
      }
      
      .lil-gui .controller button:hover,
      .lil-gui .controller select:hover {
        background: hsl(var(--accent));
        border-color: hsl(var(--primary));
      }
      
      .lil-gui .controller button:active,
      .lil-gui .controller select:active {
        background: hsl(var(--accent)/0.8);
      }
      
      /* FOLDER STYLING - STABLE AND CLEAN */
      .lil-gui .folder > .title {
        background: linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--muted)/0.1) 100%);
        border-radius: 8px;
        margin-bottom: 8px;
        padding: ${isMobile ? '14px 18px' : '10px 14px'};
        font-weight: 600;
        font-size: ${isMobile ? '16px' : '14px'};
        transition: background-color 0.15s ease;
        border: 1px solid hsl(var(--border));
        cursor: pointer;
        box-sizing: border-box;
      }
      
      .lil-gui .folder > .title:hover {
        background: linear-gradient(135deg, hsl(var(--primary)/0.15) 0%, hsl(var(--muted)/0.15) 100%);
      }
      
      /* COLOR PICKER STYLING */
      .lil-gui .controller .color input[type="color"] {
        border: 3px solid hsl(var(--border));
        transition: transform 0.2s ease;
        width: ${isMobile ? '50px' : '40px'};
        height: ${isMobile ? '50px' : '40px'};
        cursor: pointer;
        border-radius: 8px;
      }
      
      .lil-gui .controller .color input[type="color"]:hover {
        transform: scale(1.05);
        border-color: hsl(var(--primary));
      }
      
      /* CHECKBOX STYLING */
      .lil-gui .controller input[type="checkbox"] {
        width: ${isMobile ? '24px' : '20px'};
        height: ${isMobile ? '24px' : '20px'};
        cursor: pointer;
        accent-color: hsl(var(--primary));
      }
      
      /* LABEL STYLING */
      .lil-gui .controller .name {
        font-weight: 500;
        color: hsl(var(--foreground));
        margin-right: 12px;
        min-width: ${isMobile ? '120px' : '100px'};
        font-size: ${isMobile ? '16px' : '14px'};
      }
      
      /* MOBILE OPTIMIZATIONS */
      ${isMobile ? `
        .lil-gui {
          font-size: 16px;
          max-height: 50vh;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        .lil-gui .controller {
          padding: 12px 16px;
          margin: 6px 0;
        }
        
        .lil-gui .controller input[type="range"] {
          touch-action: manipulation;
          min-height: 44px;
        }
        
        .lil-gui .controller button,
        .lil-gui .controller select,
        .lil-gui .controller input {
          min-height: 48px;
          min-width: 48px;
        }
      ` : ''}
      
      /* ACCESSIBILITY */
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

  // Main Object Configuration
  const setupMainObjectControls = (gui: GUI, themeConfig: any) => {
    const mainFolder = gui.addFolder('Main Object');
    
    mainFolder.addColor(themeConfig, 'mainObjectColor')
      .name('Object Color')
      .onChange((value: string) => {
        updateConfig(config => { config[theme].mainObjectColor = value; });
      });

    if (themeConfig.material) {
      const materialFolder = mainFolder.addFolder('Material Settings');
      const material = themeConfig.material;
      
      materialFolder.add(material, 'materialType', {
        'Basic': 'basic',
        'MatCap': 'matcap', 
        'Standard': 'standard',
        'Normal': 'normal'
      }).name('Material Type').onChange(value => {
        updateConfig(c => { c[theme].material.materialType = value; });
      });

      if (material.wireframe !== undefined) {
        materialFolder.add(material, 'wireframe')
          .name('Wireframe')
          .onChange(value => updateConfig(c => { c[theme].material.wireframe = value; }));
      }

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

      if (material.materialType === 'standard') {
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
        materialFolder.add(material, 'matcapTexture', {
          'Chrome': 'chrome',
          'Purple': 'purple', 
          'Gold': 'gold'
        }).name('MatCap Style')
          .onChange(value => updateConfig(c => { c[theme].material.matcapTexture = value; }));
      }

      materialFolder.open();
    }

    // Geometry-Specific Controls
    if (sceneConfig.type === 'TorusKnot' && themeConfig.torusKnot) {
      const geometryFolder = mainFolder.addFolder('Shape Parameters');
      const torusKnot = themeConfig.torusKnot;
      
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
          .name('Size')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.radius = value; }));
      }
      if (torusKnot.tube !== undefined) {
        geometryFolder.add(torusKnot, 'tube', 0.01, 1, 0.01)
          .name('Thickness')
          .onChange(value => updateConfig(c => { c[theme].torusKnot!.tube = value; }));
      }
      
      geometryFolder.open();
    }

    mainFolder.open();
  };

  // FIXED: Reduced default light intensity
  const setupLightingControls = (gui: GUI, themeConfig: any) => {
    const lightsFolder = gui.addFolder('Lighting');
    
    themeConfig.lights.forEach((light: any, index: number) => {
      const lightFolder = lightsFolder.addFolder(`${light.type} Light`);
      
      if (light.intensity !== undefined) {
        lightFolder.add(light, 'intensity', 0, 3, 0.01)
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
        posFolder.add(light.position, '0', -100, 100, 1)
          .name('X')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![0] = v; }));
        posFolder.add(light.position, '1', -100, 100, 1)
          .name('Y')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![1] = v; }));
        posFolder.add(light.position, '2', -100, 100, 1)
          .name('Z')
          .onChange(v => updateConfig(c => { c[theme].lights[index].position![2] = v; }));
      }
      
      lightFolder.open();
    });
    
    lightsFolder.open();
  };

  const setupBackgroundControls = (gui: GUI, themeConfig: any) => {
    const backgroundFolder = gui.addFolder('Background');
    const bg = themeConfig.background;
    
    backgroundFolder.add(bg, 'type', {
      'Color': 'color',
      'Gradient': 'gradient', 
      'Stars': 'stars',
      'Sparkles': 'sparkles',
      'Environment': 'environment',
      'Fog': 'fog',
      'Noise': 'noise',
      'Plasma': 'plasma',
      'Aurora': 'aurora'
    }).name('Type').onChange(value => {
      updateConfig(c => { c[theme].background.type = value; });
    });

    // Background-specific controls
    switch (bg.type) {
      case 'environment':
        if (bg.preset !== undefined) {
          backgroundFolder.add(bg, 'preset', {
            'Apartment': 'apartment',
            'City': 'city',
            'Dawn': 'dawn',
            'Forest': 'forest',
            'Night': 'night',
            'Studio': 'studio',
            'Sunset': 'sunset'
          }).name('Environment').onChange(v => updateConfig(c => { c[theme].background.preset = v; }));
        }
        if (bg.blur !== undefined) {
          backgroundFolder.add(bg, 'blur', 0, 1, 0.01)
            .name('Blur')
            .onChange(v => updateConfig(c => { c[theme].background.blur = v; }));
        }
        break;
        
      case 'gradient':
        if (bg.colorTop) {
          backgroundFolder.addColor(bg, 'colorTop')
            .name('Top Color')
            .onChange(v => updateConfig(c => { c[theme].background.colorTop = v; }));
        }
        if (bg.colorBottom) {
          backgroundFolder.addColor(bg, 'colorBottom')
            .name('Bottom Color')
            .onChange(v => updateConfig(c => { c[theme].background.colorBottom = v; }));
        }
        break;
        
      case 'stars':
        if (bg.count !== undefined) {
          backgroundFolder.add(bg, 'count', 1000, 10000, 100)
            .name('Count')
            .onChange(v => updateConfig(c => { c[theme].background.count = v; }));
        }
        if (bg.speed !== undefined) {
          backgroundFolder.add(bg, 'speed', 0, 2, 0.01)
            .name('Speed')
            .onChange(v => updateConfig(c => { c[theme].background.speed = v; }));
        }
        break;
    }
    
    backgroundFolder.open();
  };

  // Main Effect - FIXED: Stable GUI creation
  useEffect(() => {
    if (!containerRef.current) return;

    if (guiRef.current) {
      guiRef.current.destroy();
    }

    const gui = new GUI({ 
      container: containerRef.current,
      width: isMobile ? Math.min(window.innerWidth * 0.9, 350) : 380,
      title: isMobile ? '' : 'Scene Editor'
    });
    
    guiRef.current = gui;
    applyModernStyling(gui);

    const themeConfig = sceneConfig[theme];

    setupMainObjectControls(gui, themeConfig);
    setupLightingControls(gui, themeConfig);
    setupBackgroundControls(gui, themeConfig);

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneConfig, theme, updateConfig, isMobile]);

  return (
    <div className={`w-full h-full ${isMobile ? "max-h-[50vh] overflow-y-auto" : ""}`}>
      <div
        ref={containerRef}
        className="[&_.lil-gui]:static [&_.lil-gui.root]:w-full"
      />
    </div>
  );
};

export default SceneControls;
