import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Settings, Info, Trash2 } from 'lucide-react';
import { SceneConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import ObjectAddPanel from '../scene/controls/components/ObjectAddPanel';
import SceneObjectsList from '../scene/controls/components/SceneObjectsList';
import ObjectGuiControls from '../scene/objects/components/ObjectGuiControls';

interface SceneSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const SceneSettingsPanel = ({ sceneConfig, onUpdate }: SceneSettingsPanelProps) => {
  const { objects, selectedObjectId, actions, isAddingObject } = useSceneObjectsContext();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  
  const [guiContainer, setGuiContainer] = useState<HTMLDivElement | null>(null);
  const guiContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setGuiContainer(node);
    }
  }, []);

  return (
    <div className="h-full bg-black/95 border-l border-cyan-500/30 overflow-y-auto text-white">
      <Card className="bg-transparent border-0">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Scene Editor
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-cyan-400/70" />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs max-w-xs">
                  Adding many objects may affect performance, especially on less powerful devices.
                </p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ObjectAddPanel 
            isAddingObject={isAddingObject}
            onToggleAddMode={actions.toggleAddMode}
          />
          <SceneObjectsList
            objects={objects}
            selectedObjectId={selectedObjectId}
            onSelectObject={actions.selectObject}
          />

          {selectedObject && (
            <>
              <Separator className="bg-cyan-500/30" />
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-cyan-400">
                    Edit: {selectedObject.type}
                  </h4>
                  <Button 
                    onClick={() => actions.removeObject(selectedObject.id)} 
                    variant="destructive" 
                    size="sm"
                    className="h-7"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
                <div ref={guiContainerRef} className="lil-gui-container" />
                {guiContainer && (
                  <ObjectGuiControls 
                    object={selectedObject} 
                    onUpdate={(updates) => actions.updateObject(selectedObject.id, updates)}
                    containerRef={guiContainer}
                  />
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SceneSettingsPanel;