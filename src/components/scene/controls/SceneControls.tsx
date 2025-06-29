
import { useEffect, useRef, useState } from 'react';
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import { useIsMobile } from "@/hooks/use-mobile";
import { createConfigUpdater } from './ConfigUpdateUtils';
import { MaterialControlsBuilder } from './MaterialControlsBuilder';
import { LightControlsBuilder } from './LightControlsBuilder';
import { BackgroundControlsBuilder } from './BackgroundControlsBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ObjectManagerControls from './ObjectManagerControls';

interface SceneControlsProps {
  sceneConfig: SceneConfig;
  onUpdate: (newConfig: SceneConfig) => void;
}

const SceneControls = ({ sceneConfig, onUpdate }: SceneControlsProps) => {
  const guiRef = useRef<GUI | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useExperience();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("scene");

  const updateConfig = createConfigUpdater(sceneConfig, onUpdate);

  useEffect(() => {
    if (!containerRef.current || activeTab !== "scene") return;

    if (guiRef.current) {
      guiRef.current.destroy();
    }
    
    const gui = new GUI({ container: containerRef.current });
    guiRef.current = gui;

    const themeConfig = sceneConfig[theme];

    // Main Object Controls
    const mainObjectFolder = gui.addFolder('Main Object');
    mainObjectFolder.addColor(themeConfig, 'mainObjectColor').onChange((value: string) => {
      updateConfig(config => { 
        config[theme].mainObjectColor = value; 
      });
    });
    
    // Material Controls
    const materialBuilder = new MaterialControlsBuilder(
      mainObjectFolder,
      themeConfig.material,
      theme,
      updateConfig
    );
    materialBuilder.build();

    mainObjectFolder.open();

    // Light Controls
    const lightBuilder = new LightControlsBuilder(
      gui,
      themeConfig.lights,
      theme,
      updateConfig
    );
    lightBuilder.build();

    // Background Controls
    const backgroundBuilder = new BackgroundControlsBuilder(
      gui,
      themeConfig.background,
      theme,
      updateConfig
    );
    backgroundBuilder.build();

    return () => {
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneConfig, theme, onUpdate, activeTab, updateConfig]);

  return (
    <div className={`w-full h-full ${isMobile ? "max-h-[72vh] overflow-y-auto modal-scrollbar" : ""}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scene">Scene</TabsTrigger>
          <TabsTrigger value="objects">Objects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scene" className="h-full">
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
        </TabsContent>
        
        <TabsContent value="objects" className="h-full p-4">
          <ObjectManagerControls isOpen={activeTab === "objects"} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SceneControls;
