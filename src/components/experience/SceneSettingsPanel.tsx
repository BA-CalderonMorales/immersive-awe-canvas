
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
import { useExperience } from '@/hooks/useExperience';

interface SceneSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const SceneSettingsPanel = ({ sceneConfig, onUpdate }: SceneSettingsPanelProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  const [isAddingObject, setIsAddingObject] = useState(false);
  const { theme } = useExperience();

  // High contrast professional color schemes
  const colorScheme = {
    day: {
      background: 'bg-white',
      border: 'border-gray-300',
      headerBg: 'bg-gray-50',
      headerBorder: 'border-gray-300',
      primaryText: 'text-gray-900',
      secondaryText: 'text-gray-700',
      accentText: 'text-gray-900',
      accentHover: 'hover:bg-gray-100',
      separatorColor: 'bg-gray-300',
      collapsibleHover: 'hover:bg-gray-50',
      infoIcon: 'text-gray-600 hover:text-gray-900',
    },
    night: {
      background: 'bg-gray-900',
      border: 'border-gray-600',
      headerBg: 'bg-gray-800',
      headerBorder: 'border-gray-600',
      primaryText: 'text-gray-100',
      secondaryText: 'text-gray-300',
      accentText: 'text-gray-100',
      accentHover: 'hover:bg-gray-800',
      separatorColor: 'bg-gray-600',
      collapsibleHover: 'hover:bg-gray-800',
      infoIcon: 'text-gray-400 hover:text-gray-100',
    }
  };

  const colors = colorScheme[theme];

  return (
    <div className={`h-full ${colors.background} ${colors.border} border-l overflow-y-auto z-40 relative`}>
      <Card className="bg-transparent border-0">
        <CardHeader className={`sticky top-0 ${colors.headerBg} z-10 ${colors.headerBorder} border-b`}>
          <div className="flex items-center justify-between">
            <CardTitle className={`${colors.primaryText} flex items-center gap-2 font-semibold`}>
              <Settings className="w-5 h-5" />
              Scene Editor
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className={`w-4 h-4 ${colors.infoIcon} cursor-help transition-colors`} />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Adding many objects may impact performance.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription className={colors.secondaryText}>
            Modify the main object or add new ones to the scene.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          
          <Collapsible defaultOpen>
            <CollapsibleTrigger className={`w-full flex items-center justify-between p-3 rounded-lg ${colors.collapsibleHover} transition-colors`}>
              <h3 className={`text-base font-semibold ${colors.primaryText}`}>Main Scene Object</h3>
              <ChevronsUpDown className={`w-4 h-4 ${colors.primaryText}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2">
              <MainObjectControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
            </CollapsibleContent>
          </Collapsible>

          <Separator className={colors.separatorColor} />

          <Collapsible defaultOpen>
            <CollapsibleTrigger className={`w-full flex items-center justify-between p-3 rounded-lg ${colors.collapsibleHover} transition-colors`}>
              <h3 className={`text-base font-semibold ${colors.primaryText} flex items-center gap-2`}>
                <Shapes className="w-4 h-4" />
                Editable Scene Objects
              </h3>
              <ChevronsUpDown className={`w-4 h-4 ${colors.primaryText}`} />
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
                />
              ) : (
                <div className={`text-center text-sm ${colors.secondaryText} py-4`}>
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
