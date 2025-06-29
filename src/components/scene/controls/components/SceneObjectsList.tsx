
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SceneObject } from '@/types/sceneObjects';

interface SceneObjectsListProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
}

const SceneObjectsList = ({ objects, selectedObjectId, onSelectObject }: SceneObjectsListProps) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-cyan-400">Objects in Scene ({objects.length})</h4>
      <div className="max-h-32 overflow-y-auto space-y-1">
        {objects.length === 0 ? (
          <p className="text-xs text-gray-400">No objects in scene</p>
        ) : (
          objects.map((object) => (
            <div
              key={object.id}
              className={`flex items-center justify-between p-2 rounded text-xs ${
                selectedObjectId === object.id 
                  ? 'bg-cyan-500/20 border border-cyan-500/40' 
                  : 'bg-gray-800/50 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className="text-xs border-cyan-500/30 text-cyan-300"
                >
                  {object.type}
                </Badge>
                <div 
                  className="w-3 h-3 rounded-full border border-white/30" 
                  style={{ backgroundColor: object.color }}
                />
              </div>
              <Button
                onClick={() => onSelectObject(object.id)}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs hover:bg-cyan-500/20"
              >
                {selectedObjectId === object.id ? 'Selected' : 'Select'}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SceneObjectsList;
