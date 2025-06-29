
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

  // Professional neutral color schemes
  const colorScheme = {
    day: {
      background: 'bg-slate-50/95 backdrop-blur-md',
      border: 'border-slate-200',
      headerBg: 'bg-white/95 backdrop-blur-md',
      headerBorder: 'border-slate-200',
      primaryText: 'text-slate-900',
      secondaryText: 'text-slate-600',
      accentText: 'text-slate-700',
      accentHover: 'hover:bg-slate-100',
      separatorColor: 'bg-slate-200',
      collapsibleHover: 'hover:bg-slate-50',
      infoIcon: 'text-slate-500 hover:text-slate-700',
    },
    night: {
      background: 'bg-slate-900/95 backdrop-blur-md',
      border: 'border-slate-700',
      headerBg: 'bg-slate-800/95 backdrop-blur-md',
      headerBorder: 'border-slate-700',
      primaryText: 'text-slate-100',
      secondaryText: 'text-slate-300',
      accentText: 'text-slate-200',
      accentHover: 'hover:bg-slate-800/50',
      separatorColor: 'bg-slate-700',
      collapsibleHover: 'hover:bg-slate-800/30',
      infoIcon: 'text-slate-400 hover:text-slate-200',
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
