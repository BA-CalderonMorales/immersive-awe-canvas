import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SceneConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import SceneObjectsList from '../scene/controls/components/SceneObjectsList';
import ObjectAddPanel from '../scene/controls/components/ObjectAddPanel';
import ObjectGuiControls from '../scene/controls/components/ObjectGuiControls';
import { useState, useRef } from 'react';

interface SceneSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const SceneSettingsPanel = ({ sceneConfig, onUpdate }: SceneSettingsPanelProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  const [isAddingObject, setIsAddingObject] = useState(false);
  const guiContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full bg-black/95 border-l border-cyan-500/30 overflow-y-auto z-40 relative">
      <Card className="bg-transparent border-0 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Scene Editor
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-gray-400 hover:text-white cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Adding many objects may impact performance.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription className="text-gray-400">
            Add, remove, and edit objects in the scene.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ObjectAddPanel 
            isAddingObject={isAddingObject}
            onToggleAddMode={() => setIsAddingObject(!isAddingObject)}
          />
          <Separator className="bg-cyan-500/30" />
          <SceneObjectsList
            objects={objects}
            selectedObjectId={selectedObjectId}
            onSelectObject={actions.selectObject}
          />

          {selectedObject && (
            <>
              <Separator className="bg-cyan-500/30" />
              <div ref={guiContainerRef} className="w-full [&_.lil-gui]:static [&_.lil-gui]:max-w-none [&_.lil-gui]:w-full [&_.lil-gui]:bg-transparent [&_.lil-gui_.title]:text-cyan-400 [&_.lil-gui_.name]:text-gray-300 [&_.lil-gui_input]:text-white [&_.lil-gui_input]:bg-gray-800" />
              <ObjectGuiControls 
                object={selectedObject}
                onUpdate={(updates) => actions.updateObject(selectedObject.id, updates)}
                containerRef={guiContainerRef.current}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SceneSettingsPanel;