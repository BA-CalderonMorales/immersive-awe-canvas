
import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import { MaterialControlsBuilder } from './MaterialControlsBuilder';
import { createConfigUpdater } from './ConfigUpdateUtils';

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

    if (guiRef.current) {
      guiRef.current.destroy();
    }

    const gui = new GUI({ 
      container: guiContainerRef.current, 
      title: 'Main Object Properties',
      autoPlace: false,
      width: 320
    });
    guiRef.current = gui;

    // Apply theme class to the GUI element
    const guiElement = gui.domElement;
    guiElement.setAttribute('data-theme', theme);
    guiElement.classList.add(`theme-${theme}`);

    const updateConfig = createConfigUpdater(sceneConfig, onUpdate);

    // Main Object Color
    gui.addColor(themeConfig, 'mainObjectColor').name('Color').onChange((value: string) => {
      updateConfig(c => { c[theme].mainObjectColor = value; });
    });

    // Material Controls
    if (themeConfig.material) {
      new MaterialControlsBuilder(gui, themeConfig.material, theme, updateConfig).build();
    }

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneConfig, onUpdate, theme, themeConfig]);

  const baseClasses = theme === 'day' 
    ? '[&_.lil-gui]:bg-white/95 [&_.lil-gui]:border-gray-200 [&_.lil-gui_.title]:text-gray-900 [&_.lil-gui_.name]:text-gray-600 [&_.lil-gui_input]:text-gray-900 [&_.lil-gui_input]:bg-gray-50'
    : '[&_.lil-gui]:bg-gray-900/95 [&_.lil-gui]:border-cyan-500/30 [&_.lil-gui_.title]:text-cyan-400 [&_.lil-gui_.name]:text-gray-300 [&_.lil-gui_input]:text-white [&_.lil-gui_input]:bg-gray-800';

  return (
    <div 
      ref={guiContainerRef} 
      className={`w-full [&_.lil-gui]:static [&_.lil-gui]:max-w-none [&_.lil-gui]:w-full [&_.lil-gui]:bg-transparent [&_.lil-gui]:border-0 [&_.lil-gui]:shadow-none ${baseClasses}`}
    />
  );
};

export default MainObjectControls;
