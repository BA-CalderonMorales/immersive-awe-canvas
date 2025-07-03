
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
import { useDeviceType } from '@/hooks/use-mobile';

interface SceneSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const SceneSettingsPanel = ({ sceneConfig, onUpdate }: SceneSettingsPanelProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  const [isAddingObject, setIsAddingObject] = useState(false);
  const { theme } = useExperience();
  const { isMobile, isTablet, isDesktop } = useDeviceType();

  // Responsive settings based on device type
  const panelWidth = isMobile ? 'w-full' : isTablet ? 'w-80' : 'w-96';
  const headerPadding = isMobile ? 'p-3' : 'p-4';
  const contentPadding = isMobile ? 'p-3' : 'p-4';
  const spacingY = isMobile ? 'space-y-4' : 'space-y-6';

  // Clean, modern color schemes inspired by Excalidraw
  const colorScheme = {
    day: {
      background: 'bg-white',
      border: 'border-gray-200',
      headerBg: 'bg-white',
      headerBorder: 'border-gray-200',
      primaryText: 'text-gray-900',
      secondaryText: 'text-gray-600',
      accentText: 'text-gray-800',
      accentHover: 'hover:bg-gray-50',
      separatorColor: 'bg-gray-100',
      collapsibleHover: 'hover:bg-gray-50',
      infoIcon: 'text-gray-500 hover:text-gray-700',
      cardBg: 'bg-gray-50/50',
      buttonSecondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200',
    },
    night: {
      background: 'bg-gray-950',
      border: 'border-gray-800',
      headerBg: 'bg-gray-950',
      headerBorder: 'border-gray-800',
      primaryText: 'text-gray-100',
      secondaryText: 'text-gray-400',
      accentText: 'text-gray-200',
      accentHover: 'hover:bg-gray-900',
      separatorColor: 'bg-gray-800',
      collapsibleHover: 'hover:bg-gray-900',
      infoIcon: 'text-gray-500 hover:text-gray-300',
      cardBg: 'bg-gray-900/50',
      buttonSecondary: 'bg-gray-800 hover:bg-gray-700 text-gray-300 border-gray-700',
    }
  };

  const colors = colorScheme[theme];

  return (
    <div className={`h-full ${panelWidth} ${colors.background} ${colors.border} border-l overflow-y-auto z-40 relative`}>
      <div className="bg-transparent border-0">
        <div className={`sticky top-0 ${colors.headerBg} z-10 ${colors.headerBorder} border-b ${headerPadding}`}>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`${colors.primaryText} flex items-center gap-2 font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
              <Settings className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
              Scene Editor
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className={`w-4 h-4 ${colors.infoIcon} cursor-help transition-colors`} />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Adding many objects may impact performance.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className={`${colors.secondaryText} ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Modify the main object or add new ones to the scene.
          </p>
        </div>
        <div className={`${contentPadding} ${spacingY}`}>
          
          <div className={`${colors.cardBg} rounded-xl ${isMobile ? 'p-3' : 'p-4'} border ${colors.border}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium ${colors.primaryText}`}>Main Scene Object</h3>
            </div>
            <MainObjectControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
          </div>

          <div className={`${colors.cardBg} rounded-xl ${isMobile ? 'p-3' : 'p-4'} border ${colors.border}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium ${colors.primaryText} flex items-center gap-2`}>
                <Shapes className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                Scene Objects
              </h3>
            </div>
            
            <div className={`${isMobile ? 'space-y-3' : 'space-y-4'}`}>
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
                <div className={`mt-4 pt-4 border-t border-gray-200 dark:border-gray-700`}>
                  <ObjectGuiControls 
                    object={selectedObject}
                    onUpdate={(updates) => actions.updateObject(selectedObject.id, updates)}
                  />
                </div>
              ) : (
                <div className={`text-center ${isMobile ? 'text-xs' : 'text-sm'} ${colors.secondaryText} py-6 ${colors.cardBg} rounded-lg border border-dashed ${colors.border}`}>
                  Select an object to edit its properties
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SceneSettingsPanel;
