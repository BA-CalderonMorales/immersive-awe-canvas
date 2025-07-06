import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DragControls as ThreeDragControls } from 'three-stdlib';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import * as THREE from 'three';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface DragEvent {
  object: THREE.Object3D;
}

interface DragControlsProps {
  enabled: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DragControls = ({ enabled, onDragStart, onDragEnd }: DragControlsProps) => {
  const { camera, gl, scene } = useThree();
  const { objects, actions, setIsDragging } = useSceneObjectsContext();
  const controlsRef = useRef<ThreeDragControls>();
  const initialDepthRef = useRef<Map<THREE.Object3D, number>>(new Map());

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.dispose();
      controlsRef.current = undefined;
    }

    if (!enabled) return;

    const draggableObjects: THREE.Object3D[] = [];
    
    // Find all user-added objects
    objects.forEach(obj => {
      const mesh = scene.getObjectByName(obj.id);
      if (mesh) {
        draggableObjects.push(mesh);
      }
    });

    // Find the main scene object
    const mainObject = scene.getObjectByName(MAIN_OBJECT_NAME);
    if (mainObject && !draggableObjects.some(o => o.uuid === mainObject.uuid)) {
      draggableObjects.push(mainObject);
    }

    if (draggableObjects.length === 0) return;

    // Small delay to ensure all objects are properly added to the scene
    const initializeControls = () => {
      const controls = new ThreeDragControls(draggableObjects, camera, gl.domElement);
      controlsRef.current = controls;

      const handleDragStart = (event: DragEvent) => {
        const object = event.object;
        object.userData.isBeingDragged = true;
        setIsDragging(true);
        
        const initialPosition = new THREE.Vector3();
        object.getWorldPosition(initialPosition);
        const positionInCameraSpace = camera.worldToLocal(initialPosition);
        initialDepthRef.current.set(object, positionInCameraSpace.z);

        if (object.userData?.objectId) {
          actions.selectObject(object.userData.objectId);
        }
        onDragStart?.();
      };

      const handleDrag = (event: DragEvent) => {
        const object = event.object;
        
        // Update object state immediately for real-time feedback
        if (object.userData?.objectId) {
          const position: [number, number, number] = [object.position.x, object.position.y, object.position.z];
          actions.updateObject(object.userData.objectId, { position });
        }
      };

      const handleDragEnd = (event: DragEvent) => {
        const object = event.object;
        if (object.userData) {
          object.userData.isBeingDragged = false;
        }
        setIsDragging(false);
        initialDepthRef.current.delete(object);
        onDragEnd?.();
      };

      controls.addEventListener('dragstart', handleDragStart);
      controls.addEventListener('drag', handleDrag);
      controls.addEventListener('dragend', handleDragEnd);
    };

    // Use a small timeout to ensure objects are properly mounted
    const timeoutId = setTimeout(initializeControls, 50);

    return () => {
      clearTimeout(timeoutId);
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = undefined;
      }
    };
  }, [enabled, objects.length, camera, gl, scene, actions, setIsDragging, onDragStart, onDragEnd]);

  return null;
};

export default DragControls;