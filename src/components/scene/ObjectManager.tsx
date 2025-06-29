
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicSceneObject from './objects/DynamicSceneObject';

const ObjectManager = () => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();

  console.log('ObjectManager rendering with objects:', objects.length);

  return (
    <group name="ObjectManager">
      {objects.map((object) => (
        <DynamicSceneObject
          key={object.id}
          object={object}
          isSelected={selectedObjectId === object.id}
          onSelect={() => actions.selectObject(object.id)}
          isLocked={false}
        />
      ))}
    </group>
  );
};

export default ObjectManager;
