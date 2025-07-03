
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
      <Button
        size="sm"
        variant="outline"
        onClick={onToggleAddMode}
        className="w-full h-9 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add New Object
      </Button>

      {isAddingObject && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700">
          <p className="text-xs text-gray-600 mb-3 dark:text-gray-400">Choose a geometry:</p>
          <div className="grid grid-cols-2 gap-2">
            {availableGeometries.map((geometry) => (
              <Button
                key={geometry.type}
                size="sm"
                variant="ghost"
                onClick={() => {
                  actions.addObject(geometry.type);
                  onToggleAddMode();
                }}
                className="h-9 text-xs bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
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
