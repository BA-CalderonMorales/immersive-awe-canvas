
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Info, Shapes, ChevronsUpDown, Palette, Play, Pause } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
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
  isMotionFrozen?: boolean;
  onToggleMotion?: () => void;
}

const SceneSettingsPanel = ({ 
  sceneConfig, 
  onUpdate, 
  isMotionFrozen = false, 
  onToggleMotion 
}: SceneSettingsPanelProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  const [isAddingObject, setIsAddingObject] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
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
    <div className={`h-full ${panelWidth} ${colors.background} ${colors.border} border-l overflow-hidden z-40 relative flex flex-col`}>
      <div className={`${colors.headerBg} z-10 ${colors.headerBorder} border-b ${headerPadding} flex-shrink-0`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className={`${colors.primaryText} flex items-center gap-2 font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>
            <Settings className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            Scene Editor
          </h2>
          <div className="flex items-center gap-2">
            {onToggleMotion && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onToggleMotion}
                    className={`p-1.5 h-auto ${colors.accentHover}`}
                  >
                    {isMotionFrozen ? (
                      <Play className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Pause className="w-4 h-4 text-orange-500" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  {isMotionFrozen ? 'Resume animation' : 'Freeze animation'}
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className={`w-4 h-4 ${colors.infoIcon} cursor-help transition-colors`} />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Adding many objects may impact performance.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <p className={`${colors.secondaryText} ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Modify the main object or add new ones to the scene.
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className={`grid w-full grid-cols-2 mx-4 mt-4 ${colors.cardBg} ${colors.border}`}>
            <TabsTrigger 
              value="main" 
              className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} data-[state=active]:${colors.background} data-[state=active]:${colors.primaryText}`}
            >
              <Palette className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              Main Object
            </TabsTrigger>
            <TabsTrigger 
              value="objects" 
              className={`flex items-center gap-2 ${isMobile ? 'text-xs' : 'text-sm'} data-[state=active]:${colors.background} data-[state=active]:${colors.primaryText}`}
            >
              <Shapes className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
              Scene Objects ({objects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="main" className="flex-1 overflow-y-auto mt-0 mx-4 mb-4">
            <div className={`${colors.cardBg} rounded-xl ${isMobile ? 'p-3' : 'p-4'} border ${colors.border} mt-4`}>
              <MainObjectControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
            </div>
          </TabsContent>

          <TabsContent value="objects" className="flex-1 overflow-y-auto mt-0 mx-4 mb-4">
            <div className={`${colors.cardBg} rounded-xl ${isMobile ? 'p-3' : 'p-4'} border ${colors.border} mt-4`}>
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
                  <div className={`mt-4 pt-4 border-t ${colors.separatorColor}`}>
                    <h4 className={`${colors.primaryText} font-medium mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      Object Properties
                    </h4>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SceneSettingsPanel;
