import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DragControls as ThreeDragControls } from 'three-stdlib';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import * as THREE from 'three';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface DragControlsProps {
  enabled: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DragControls = ({ enabled, onDragStart, onDragEnd }: DragControlsProps) => {
  const { camera, gl, scene } = useThree();
  const { objects, actions } = useSceneObjectsContext();
  const controlsRef = useRef<ThreeDragControls>();

  useEffect(() => {
    if (!enabled) {
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = undefined;
      }
      return;
    }

    const draggableObjects: THREE.Object3D[] = [];
    
    // Add context objects from the object manager
    objects.forEach(obj => {
      const mesh = scene.getObjectByName(obj.id);
      if (mesh) {
        draggableObjects.push(mesh);
      }
    });

    // Add the main scene object
    const mainObject = scene.getObjectByName(MAIN_OBJECT_NAME);
    if (mainObject) {
      draggableObjects.push(mainObject);
    }

    if (draggableObjects.length === 0) return;

    const controls = new ThreeDragControls(draggableObjects, camera, gl.domElement);
    controlsRef.current = controls;

    const handleDragStart = (event: any) => {
      event.object.userData.isBeingDragged = true;
      if (event.object.userData?.objectId) {
        actions.selectObject(event.object.userData.objectId);
      }
      onDragStart?.();
    };

    const handleDrag = (event: any) => {
      const object = event.object;
      if (object.userData?.objectId) {
        const position: [number, number, number] = [
          object.position.x,
          object.position.y,
          object.position.z
        ];
        actions.updateObject(object.userData.objectId, { position });
      }
    };

    const handleDragEnd = (event: any) => {
      if (event.object.userData) {
        event.object.userData.isBeingDragged = false;
      }
      onDragEnd?.();
    };

    controls.addEventListener('dragstart', handleDragStart);
    controls.addEventListener('drag', handleDrag);
    controls.addEventListener('dragend', handleDragEnd);

    return () => {
      controls.removeEventListener('dragstart', handleDragStart);
      controls.removeEventListener('drag', handleDrag);
      controls.removeEventListener('dragend', handleDragEnd);
      controls.dispose();
    };
  }, [enabled, objects, camera, gl, scene, actions, onDragStart, onDragEnd]);

  return null;
};

export default DragControls;