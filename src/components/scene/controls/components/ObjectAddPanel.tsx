
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';

interface ObjectAddPanelProps {
  isAddingObject: boolean;
  onToggleAddMode: () => void;
}

const ObjectAddPanel = ({ isAddingObject, onToggleAddMode }: ObjectAddPanelProps) => {
  const { availableGeometries, actions } = useSceneObjectsContext();

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Scene Objects</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleAddMode}
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
    </>
  );
};

export default ObjectAddPanel;
