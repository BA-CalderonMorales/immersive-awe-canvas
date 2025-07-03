
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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Objects ({objects.length})</h4>
      </div>
      <div className="max-h-48 overflow-y-auto space-y-2">
        {objects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">No objects added yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Click "Add New Object" to get started</p>
          </div>
        ) : (
          objects.map((object) => (
            <button
              key={object.id}
              onClick={() => onSelectObject(object.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg text-sm border transition-all ${
                selectedObjectId === object.id 
                  ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100' 
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                  style={{ backgroundColor: object.color }}
                />
                <span className="font-medium">{object.type}</span>
              </div>
              {selectedObjectId === object.id && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                  Selected
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default SceneObjectsList;
