import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Info, Shapes, ChevronsUpDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { SceneConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import SceneObjectsList from '../scene/controls/components/SceneObjectsList';
import ObjectAddPanel from '../scene/controls/components/ObjectAddPanel';
import ObjectGuiControls from '../scene/controls/components/ObjectGuiControls';
import MainObjectControls from '../scene/controls/MainObjectControls';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SceneSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const SceneSettingsPanel = ({ sceneConfig, onUpdate }: SceneSettingsPanelProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  const [isAddingObject, setIsAddingObject] = useState(false);

  return (
    <div className="h-full bg-black/80 backdrop-blur-md border-l border-cyan-500/30 overflow-y-auto z-40 relative text-white">
      <Card className="bg-transparent border-0">
        <CardHeader className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-cyan-500/20">
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
            Modify the main object or add new ones to the scene.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full flex items-center justify-between p-2 rounded-md hover:bg-cyan-500/10">
              <h3 className="text-base font-semibold text-cyan-300">Main Scene Object</h3>
              <ChevronsUpDown className="w-4 h-4 text-cyan-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2">
              <MainObjectControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
            </CollapsibleContent>
          </Collapsible>

          <Separator className="bg-cyan-500/30" />

          <Collapsible defaultOpen>
            <CollapsibleTrigger className="w-full flex items-center justify-between p-2 rounded-md hover:bg-cyan-500/10">
              <h3 className="text-base font-semibold text-cyan-300 flex items-center gap-2">
                <Shapes className="w-4 h-4" />
                Editable Scene Objects
              </h3>
              <ChevronsUpDown className="w-4 h-4 text-cyan-400" />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2 space-y-4">
              <ObjectAddPanel 
                isAddingObject={isAddingObject}
                onToggleAddMode={() => setIsAddingObject(!isAddingObject)}
              />
              <SceneObjectsList
                objects={objects}
                selectedObjectId={selectedObjectId}
                onSelectObject={actions.selectObject}
              />
              {selectedObject ? (
                <ObjectGuiControls 
                  object={selectedObject}
                  onUpdate={(updates) => actions.updateObject(selectedObject.id, updates)}
                  containerRef={null} // lil-gui will be managed inside
                />
              ) : (
                <div className="text-center text-xs text-gray-500 py-4">
                  Select an object to see its properties.
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

        </CardContent>
      </Card>
    </div>
  );
};

export default SceneSettingsPanel;