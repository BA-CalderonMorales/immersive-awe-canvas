
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { SceneObject } from '@/types/sceneObjects';

interface QuickObjectControlsProps {
  object: SceneObject;
  onUpdate: (updates: Partial<SceneObject>) => void;
}

const QuickObjectControls = ({ object, onUpdate }: QuickObjectControlsProps) => {
  return (
    <>
      <Separator />
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
    </>
  );
};

export default QuickObjectControls;
