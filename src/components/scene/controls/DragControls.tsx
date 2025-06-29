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
  objectRefs: THREE.Object3D[];
}

const DragControls = ({ enabled, onDragStart, onDragEnd, objectRefs }: DragControlsProps) => {
  const { camera, gl, scene } = useThree();
  const { actions } = useSceneObjectsContext();
  const controlsRef = useRef<ThreeDragControls>();
  const initialDepthRef = useRef<Map<THREE.Object3D, number>>(new Map());

  useEffect(() => {
    if (!enabled) {
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = undefined;
      }
      return;
    }

    const draggableObjects: THREE.Object3D[] = [...objectRefs];
    
    // Add the main scene object
    const mainObject = scene.getObjectByName(MAIN_OBJECT_NAME);
    if (mainObject) {
      draggableObjects.push(mainObject);
    }

    if (draggableObjects.length === 0) return;

    const controls = new ThreeDragControls(draggableObjects, camera, gl.domElement);
    controlsRef.current = controls;

    const handleDragStart = (event: any) => {
      const object = event.object as THREE.Object3D;
      object.userData.isBeingDragged = true;
      
      // Store initial depth relative to camera
      const initialPosition = new THREE.Vector3();
      object.getWorldPosition(initialPosition);
      const positionInCameraSpace = camera.worldToLocal(initialPosition);
      initialDepthRef.current.set(object, positionInCameraSpace.z);

      if (object.userData?.objectId) {
        actions.selectObject(object.userData.objectId);
      }
      onDragStart?.();
    };

    const handleDrag = (event: any) => {
      const object = event.object as THREE.Object3D;
      const initialDepth = initialDepthRef.current.get(object);

      if (initialDepth !== undefined) {
        // Constrain movement to the initial depth plane
        const newPositionInCameraSpace = camera.worldToLocal(object.position.clone());
        newPositionInCameraSpace.z = initialDepth;
        
        const parent = object.parent;
        if (parent) {
          // Convert back to world space, then to parent's local space
          const constrainedPositionWorld = camera.localToWorld(newPositionInCameraSpace);
          const constrainedPositionLocal = parent.worldToLocal(constrainedPositionWorld);
          object.position.copy(constrainedPositionLocal);
        }
      }

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
      const object = event.object as THREE.Object3D;
      if (object.userData) {
        object.userData.isBeingDragged = false;
      }
      // Clean up stored depth
      initialDepthRef.current.delete(object);
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
  }, [enabled, objectRefs, camera, gl, scene, actions, onDragStart, onDragEnd]);

  return null;
};

export default DragControls;