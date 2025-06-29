
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

  // Dynamic color schemes based on theme
  const colorScheme = {
    day: {
      background: 'bg-white/95 backdrop-blur-md',
      border: 'border-gray-200',
      headerBg: 'bg-white/90 backdrop-blur-md',
      headerBorder: 'border-gray-200',
      primaryText: 'text-gray-900',
      secondaryText: 'text-gray-600',
      accentText: 'text-blue-600',
      accentHover: 'hover:bg-blue-50',
      separatorColor: 'bg-gray-200',
      collapsibleHover: 'hover:bg-gray-50',
      infoIcon: 'text-gray-500 hover:text-gray-700',
    },
    night: {
      background: 'bg-gray-900/95 backdrop-blur-md',
      border: 'border-cyan-500/30',
      headerBg: 'bg-gray-900/90 backdrop-blur-md',
      headerBorder: 'border-cyan-500/20',
      primaryText: 'text-white',
      secondaryText: 'text-gray-300',
      accentText: 'text-cyan-400',
      accentHover: 'hover:bg-cyan-500/10',
      separatorColor: 'bg-cyan-500/30',
      collapsibleHover: 'hover:bg-cyan-500/10',
      infoIcon: 'text-gray-400 hover:text-white',
    }
  };

  const colors = colorScheme[theme];

  return (
    <div className={`h-full ${colors.background} ${colors.border} border-l overflow-y-auto z-40 relative`}>
      <Card className="bg-transparent border-0">
        <CardHeader className={`sticky top-0 ${colors.headerBg} z-10 ${colors.headerBorder} border-b`}>
          <div className="flex items-center justify-between">
            <CardTitle className={`${colors.accentText} flex items-center gap-2 font-semibold`}>
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
              <h3 className={`text-base font-semibold ${colors.accentText}`}>Main Scene Object</h3>
              <ChevronsUpDown className={`w-4 h-4 ${colors.accentText}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="p-2">
              <MainObjectControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
            </CollapsibleContent>
          </Collapsible>

          <Separator className={colors.separatorColor} />

          <Collapsible defaultOpen>
            <CollapsibleTrigger className={`w-full flex items-center justify-between p-3 rounded-lg ${colors.collapsibleHover} transition-colors`}>
              <h3 className={`text-base font-semibold ${colors.accentText} flex items-center gap-2`}>
                <Shapes className="w-4 h-4" />
                Editable Scene Objects
              </h3>
              <ChevronsUpDown className={`w-4 h-4 ${colors.accentText}`} />
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
                <div className={`text-center text-xs ${colors.secondaryText} py-4`}>
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
