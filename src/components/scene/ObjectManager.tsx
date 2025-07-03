
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicSceneObject from './objects/DynamicSceneObject';

interface ObjectManagerProps {
  isDragEnabled?: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

const ObjectManager = ({ isDragEnabled = false, onDragStateChange }: ObjectManagerProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();

  return (
    <>
      {objects.map((object) => (
        <DynamicSceneObject
          key={object.id}
          object={object}
          isSelected={object.id === selectedObjectId}
          onSelect={() => actions.selectObject(object.id)}
        />
      ))}
    </>
  );
};

export default ObjectManager;
