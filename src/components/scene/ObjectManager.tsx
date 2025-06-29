
import { useState } from 'react';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicSceneObject from './objects/DynamicSceneObject';
import DragControls from './controls/DragControls';

interface ObjectManagerProps {
  isDragEnabled?: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

const ObjectManager = ({ isDragEnabled = false, onDragStateChange }: ObjectManagerProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();

  const handleDragStart = () => {
    onDragStateChange?.(true);
  };

  const handleDragEnd = () => {
    onDragStateChange?.(false);
  };

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
      <DragControls 
        enabled={isDragEnabled} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
    </>
  );
};

export default ObjectManager;
