
import { useState } from 'react';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicSceneObject from './objects/DynamicSceneObject';
import DragControls from './controls/DragControls';

const ObjectManager = () => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const [isDragEnabled, setIsDragEnabled] = useState(false);

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
      <DragControls enabled={isDragEnabled} />
    </>
  );
};

export default ObjectManager;
