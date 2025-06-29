
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, RotateCcw, Settings } from 'lucide-react';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { SceneObject } from '@/types/sceneObjects';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ObjectGuiControls from '../objects/components/ObjectGuiControls';

interface ObjectManagerControlsProps {
  isOpen: boolean;
}

const ObjectManagerControls = ({ isOpen }: ObjectManagerControlsProps) => {
  const { objects, selectedObject, isAddingObject, availableGeometries, actions } = useSceneObjectsContext();
  const guiContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

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
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">Select an object to add:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {availableGeometries.map((geometry) => (
              <Button
                key={geometry.type}
                size="sm"
                variant="ghost"
                onClick={() => actions.addObject(geometry.type)}
                className="h-10 text-xs whitespace-nowrap hover:bg-primary/20"
              >
                {geometry.name}
              </Button>
            ))}
          </div>
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

        <div className="max-h-96 overflow-y-auto space-y-2">
          {objects.map((object) => (
            <Collapsible key={object.id}>
              <div
                className={`p-2 rounded border cursor-pointer transition-all ${
                  object.id === selectedObject?.id
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border hover:bg-accent'
                }`}
                onClick={() => actions.selectObject(object.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium capitalize">
                    {object.type} #{object.id.slice(-4)}
                  </span>
                  <div className="flex items-center gap-1">
                    <CollapsibleTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                        className="h-6 w-6 p-0"
                      >
                        <Settings className="w-3 h-3" />
                      </Button>
                    </CollapsibleTrigger>
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
              </div>
              
              <CollapsibleContent className="mt-2">
                <div className="bg-background/50 rounded-lg p-2 border">
                  <div
                    ref={(el) => { guiContainerRefs.current[object.id] = el; }}
                    className="
                      [&_.lil-gui]:static
                      [&_.lil-gui.root]:w-full
                      [&_.lil-gui.root]:font-size-xs
                      [&_.lil-gui]:text-xs
                      [&_.lil-gui.root_.title]:text-xs
                      [&_.lil-gui.root_.title]:font-medium
                      [&_.lil-gui.root_.title]:mb-1
                    "
                  />
                  <ObjectGuiControls
                    object={object}
                    onUpdate={(updates) => actions.updateObject(object.id, updates)}
                    containerRef={guiContainerRefs.current[object.id]}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {selectedObject && (
        <>
          <Separator />
          <QuickObjectControls
            object={selectedObject}
            onUpdate={(updates) => actions.updateObject(selectedObject.id, updates)}
          />
        </>
      )}
    </div>
  );
};

interface QuickObjectControlsProps {
  object: SceneObject;
  onUpdate: (updates: Partial<SceneObject>) => void;
}

const QuickObjectControls = ({ object, onUpdate }: QuickObjectControlsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium">Quick Controls</h4>
      
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
