import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { SceneObject } from '@/types/sceneObjects';
import { Slider } from '@/components/ui/slider';

interface ObjectManagerControlsProps {
  isOpen: boolean;
}

const ObjectManagerControls = ({ isOpen }: ObjectManagerControlsProps) => {
  const { objects, selectedObject, isAddingObject, availableGeometries, actions } = useSceneObjectsContext();

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Scene Objects</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={actions.toggleAddMode}
          className="h-8"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Object
        </Button>
      </div>

      {isAddingObject && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {availableGeometries.map((geometry) => (
            <Button
              key={geometry.type}
              size="sm"
              variant="ghost"
              onClick={() => actions.addObject(geometry.type)}
              className="h-10 text-xs whitespace-nowrap"
            >
              {geometry.name}
            </Button>
          ))}
        </div>
      )}

      <Separator />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Objects: {objects.length}
          </span>
          {objects.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={actions.clearObjects}
              className="h-6 w-6 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          )}
        </div>

        <div className="max-h-32 overflow-y-auto space-y-2">
          {objects.map((object) => (
            <div
              key={object.id}
              className={`p-2 rounded border cursor-pointer transition-all ${
                object.id === selectedObject?.id
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border hover:bg-accent'
              }`}
              onClick={() => actions.selectObject(object.id)}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium capitalize">
                  {object.type}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.removeObject(object.id);
                  }}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedObject && (
        <>
          <Separator />
          <ObjectPropertyControls
            object={selectedObject}
            onUpdate={(updates) => actions.updateObject(selectedObject.id, updates)}
          />
        </>
      )}
    </div>
  );
};

interface ObjectPropertyControlsProps {
  object: SceneObject;
  onUpdate: (updates: Partial<SceneObject>) => void;
}

const ObjectPropertyControls = ({ object, onUpdate }: ObjectPropertyControlsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium">Selected Object Properties</h4>
      
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Position X</label>
        <Slider
          value={[object.position[0]]}
          onValueChange={([value]) => 
            onUpdate({ position: [value, object.position[1], object.position[2]] })
          }
          min={-10}
          max={10}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Position Y</label>
        <Slider
          value={[object.position[1]]}
          onValueChange={([value]) => 
            onUpdate({ position: [object.position[0], value, object.position[2]] })
          }
          min={-10}
          max={10}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Position Z</label>
        <Slider
          value={[object.position[2]]}
          onValueChange={([value]) => 
            onUpdate({ position: [object.position[0], object.position[1], value] })
          }
          min={-10}
          max={10}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Scale</label>
        <Slider
          value={[object.scale[0]]}
          onValueChange={([value]) => 
            onUpdate({ scale: [value, value, value] })
          }
          min={0.1}
          max={3}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Color</label>
        <input
          type="color"
          value={object.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="w-full h-8 rounded border"
        />
      </div>
    </div>
  );
};

export default ObjectManagerControls;
