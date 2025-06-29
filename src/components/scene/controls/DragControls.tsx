
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DragControls as ThreeDragControls } from 'three-stdlib';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import * as THREE from 'three';

interface DragControlsProps {
  enabled: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DragControls = ({ enabled, onDragStart, onDragEnd }: DragControlsProps) => {
  const { camera, gl, scene } = useThree();
  const { objects, actions } = useSceneObjectsContext();
  const controlsRef = useRef<ThreeDragControls>();
  const isDraggingRef = useRef(false);
  const ctrlKeyPressed = useRef(false);

  // Handle keyboard events for Ctrl key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        ctrlKeyPressed.current = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        ctrlKeyPressed.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!enabled && !ctrlKeyPressed.current) {
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = undefined;
      }
      return;
    }

    // Get all draggable meshes from the scene
    const draggableObjects: THREE.Object3D[] = [];
    
    objects.forEach(obj => {
      const mesh = scene.getObjectByName(obj.id);
      if (mesh) {
        draggableObjects.push(mesh);
      }
    });

    if (draggableObjects.length === 0) return;

    // Create new drag controls
    const controls = new ThreeDragControls(draggableObjects, camera, gl.domElement);
    controlsRef.current = controls;

    // Handle drag start
    const handleDragStart = (event: any) => {
      isDraggingRef.current = true;
      const object = event.object;
      
      if (object.userData?.objectId) {
        actions.selectObject(object.userData.objectId);
      }
      
      onDragStart?.();
    };

    // Handle drag movement
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

    // Handle drag end
    const handleDragEnd = () => {
      isDraggingRef.current = false;
      onDragEnd?.();
    };

    controls.addEventListener('dragstart', handleDragStart);
    controls.addEventListener('drag', handleDrag);
    controls.addEventListener('dragend', handleDragEnd);

    // Enable/disable based on enabled prop or Ctrl key
    controls.enabled = enabled || ctrlKeyPressed.current;

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
