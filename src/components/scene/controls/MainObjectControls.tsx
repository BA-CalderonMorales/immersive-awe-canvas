
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
      width: 320
    });
    guiRef.current = gui;

    // Apply theme styling
    const guiElement = gui.domElement;
    guiElement.setAttribute('data-theme', theme);
    guiElement.classList.add(`theme-${theme}`);

    const updateConfig = createConfigUpdater(sceneConfig, onUpdate);

    // Main Object Color
    gui.addColor(themeConfig, 'mainObjectColor').name('Color').onChange((value: string) => {
      updateConfig(c => { c[theme].mainObjectColor = value; });
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
    <div className="space-y-4">
      <ColorInput label="Color" value={themeConfig.mainObjectColor} onChange={handleColorChange} />
      <div
        ref={guiContainerRef}
        className="w-full [&_.lil-gui]:static [&_.lil-gui]:max-w-none [&_.lil-gui]:w-full [&_.lil-gui]:bg-transparent [&_.lil-gui]:border-0 [&_.lil-gui]:shadow-none"
      />
    </div>
  );
};

export default MainObjectControls;
