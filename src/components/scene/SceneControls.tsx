
import { useEffect, useRef, useState } from 'react';
import GUI from 'lil-gui';
import { SceneConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import { useIsMobile } from "@/hooks/use-mobile";
import { GuiControlsFactory } from './controls/GuiControlsFactory';
import { createConfigUpdater } from './controls/ConfigUpdateUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ObjectManagerControls from './controls/ObjectManagerControls';
import { SceneObjectsProvider } from '@/context/SceneObjectsContext';

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

  // Helper for deep cloning and updating to avoid state mutation issues
  const updateConfig = createConfigUpdater(sceneConfig, onUpdate);

  useEffect(() => {
    if (!containerRef.current || activeTab !== "scene") return;

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
  }, [sceneConfig, theme, onUpdate, activeTab]);

  const themeConfig = sceneConfig[theme];
  const mainObjectColor = themeConfig?.mainObjectColor || '#ffffff';

  return (
    <SceneObjectsProvider mainObjectColor={mainObjectColor}>
      <div
        className={`w-full h-full ${
          isMobile ? "max-h-[72vh] overflow-y-auto modal-scrollbar" : ""
        }`}
      >
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
    </SceneObjectsProvider>
  );
};

export default SceneControls;
