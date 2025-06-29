
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Move } from 'lucide-react';
import SceneObjectsList from './components/SceneObjectsList';
import ObjectTransformControls from './components/ObjectTransformControls';

const ObjectMoveControls = () => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  return (
    <div className="space-y-4">
      <Card className="bg-black/80 border-cyan-500/30 text-white">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Move className="w-5 h-5" />
            Object Controls
          </CardTitle>
          <CardDescription className="text-gray-300">
            Manage objects in the scene
          </CardDescription>
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

export default ObjectMoveControls;
