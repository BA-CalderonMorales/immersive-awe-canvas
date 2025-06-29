
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import ObjectAddPanel from './components/ObjectAddPanel';
import ObjectsList from './components/ObjectsList';
import QuickObjectControls from './components/QuickObjectControls';

interface ObjectManagerControlsProps {
  isOpen: boolean;
}

const ObjectManagerControls = ({ isOpen }: ObjectManagerControlsProps) => {
  const { selectedObject, isAddingObject, actions } = useSceneObjectsContext();

  if (!isOpen) return null;

  return (
    <div className="space-y-4">
      <ObjectAddPanel 
        isAddingObject={isAddingObject}
        onToggleAddMode={actions.toggleAddMode}
      />
      
      <ObjectsList />

      {selectedObject && (
        <QuickObjectControls
          object={selectedObject}
          onUpdate={(updates) => actions.updateObject(selectedObject.id, updates)}
        />
      )}
    </div>
  );
};

export default ObjectManagerControls;
