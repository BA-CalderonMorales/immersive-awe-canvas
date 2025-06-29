
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicSceneObject from './objects/DynamicSceneObject';

const ObjectManager = () => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();

  return (
    <>
      {objects.map((object) => (
        <DynamicSceneObject
          key={object.id}
          object={object}
          isSelected={object.id === selectedObjectId}
          onSelect={() => actions.selectObject(object.id)}
          isLocked={false}
        />
      ))}
    </>
  );
};

export default ObjectManager;
