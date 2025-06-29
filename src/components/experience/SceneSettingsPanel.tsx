
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Move } from 'lucide-react';
import { SceneConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import SceneObjectsList from '../scene/controls/components/SceneObjectsList';
import ObjectTransformControls from '../scene/controls/components/ObjectTransformControls';

interface SceneSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const SceneSettingsPanel = ({ sceneConfig, onUpdate }: SceneSettingsPanelProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  return (
    <div className="h-full bg-black/95 border-l border-cyan-500/30 overflow-y-auto">
      <Card className="bg-transparent border-0 text-white">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Move className="w-5 h-5" />
            Object Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SceneObjectsList
            objects={objects}
            selectedObjectId={selectedObjectId}
            onSelectObject={actions.selectObject}
          />

          {selectedObject && (
            <>
              <Separator className="bg-cyan-500/30" />
              <ObjectTransformControls
                selectedObject={selectedObject}
                onUpdateObject={actions.updateObject}
                onRemoveObject={actions.removeObject}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SceneSettingsPanel;
