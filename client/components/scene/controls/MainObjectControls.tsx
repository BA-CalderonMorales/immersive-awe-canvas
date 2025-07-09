
import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import { MaterialControlsBuilder } from './MaterialControlsBuilder';
import { createConfigUpdater } from './ConfigUpdateUtils';
import ColorInput from '@/components/ui/color-input';

interface MainObjectControlsProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const MainObjectControls = ({ sceneConfig, onUpdate }: MainObjectControlsProps) => {
  const guiContainerRef = useRef<HTMLDivElement>(null);
  const guiRef = useRef<GUI | null>(null);
  const { theme } = useExperience();
  const themeConfig = sceneConfig[theme];

  useEffect(() => {
    if (!guiContainerRef.current) return;

    // Early cleanup
    if (guiRef.current) {
      guiRef.current.destroy();
    }

    const gui = new GUI({ 
      container: guiContainerRef.current, 
      title: 'Main Object Properties',
      autoPlace: false,
      width: Math.min(400, guiContainerRef.current.clientWidth - 32) // Responsive width with padding
    });
    guiRef.current = gui;

    // Apply theme styling
    const guiElement = gui.domElement;
    guiElement.setAttribute('data-theme', theme);
    guiElement.classList.add(`theme-${theme}`);

    const updateConfig = createConfigUpdater(sceneConfig, onUpdate);

    // Create a proxy object for reactive updates with better state management
    const colorProxy = { color: themeConfig.mainObjectColor };

    // CRITICAL FIX: Main Object Color with immediate update and proper reactivity
    const colorController = gui.addColor(colorProxy, 'color').name('Main Color');
    colorController.onChange((value: string) => {
      // Update proxy immediately for UI responsiveness
      colorProxy.color = value;
      
      // CRITICAL: Create new config object to trigger React re-render
      const newConfig = {
        ...sceneConfig,
        [theme]: {
          ...sceneConfig[theme],
          mainObjectColor: value
        }
      };
      
      // Trigger immediate update to force re-render of main object
      onUpdate(newConfig);
    });

    // Material Controls - early return if no material
    if (!themeConfig.material) return;
    
    new MaterialControlsBuilder(gui, themeConfig.material, theme, updateConfig).build();

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneConfig, onUpdate, theme, themeConfig]);

  const handleColorChange = (value: string) => {
    const update = createConfigUpdater(sceneConfig, onUpdate);
    update(c => { c[theme].mainObjectColor = value; });
  };

  return (
    <div 
      ref={guiContainerRef} 
      className="w-full min-h-0 [&_.lil-gui]:static [&_.lil-gui]:max-w-none [&_.lil-gui]:w-full [&_.lil-gui]:bg-transparent [&_.lil-gui]:border-0 [&_.lil-gui]:shadow-none [&_.lil-gui_.controller]:min-h-[28px]"
    />
  );
};

export default MainObjectControls;
