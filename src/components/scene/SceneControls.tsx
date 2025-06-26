
import { useEffect, useRef } from 'react';
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import { useIsMobile } from "@/hooks/use-mobile";
import { GuiControlsFactory } from './controls/GuiControlsFactory';
import { createConfigUpdater } from './controls/ConfigUpdateUtils';

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
  const updateConfig = createConfigUpdater(sceneConfig, onUpdate);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous GUI if it exists
    if (guiRef.current) {
      guiRef.current.destroy();
    }
    
    const gui = new GUI({ container: containerRef.current });
    guiRef.current = gui;

    // Create all controls using the factory
    const factory = new GuiControlsFactory(gui, sceneConfig, theme, updateConfig);
    factory.createAllControls();

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneConfig, theme, onUpdate]);

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
