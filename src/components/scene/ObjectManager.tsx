import { useRef, useEffect } from 'react';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicSceneObject from './objects/DynamicSceneObject';
import DragControls from './controls/DragControls';
import * as THREE from 'three';

interface ObjectManagerProps {
  isDragEnabled?: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

const ObjectManager = ({ isDragEnabled = false, onDragStateChange }: ObjectManagerProps) => {
  const { objects, selectedObjectId, actions } = useSceneObjectsContext();
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Keep refs array in sync with objects array
  useEffect(() => {
    meshRefs.current = meshRefs.current.slice(0, objects.length);
  }, [objects]);

  const handleDragStart = () => {
    onDragStateChange?.(true);
  };

  const handleDragEnd = () => {
    onDragStateChange?.(false);
  };

  return (
    <>
      {objects.map((object, i) => (
        <DynamicSceneObject
          key={object.id}
          ref={el => (meshRefs.current[i] = el)}
          object={object}
          isSelected={object.id === selectedObjectId}
          onSelect={() => actions.selectObject(object.id)}
        />
      ))}
      <DragControls 
        enabled={isDragEnabled} 
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        objectRefs={meshRefs.current.filter((ref): ref is THREE.Mesh => ref !== null)}
      />
    </>
  );
};

export default ObjectManager;