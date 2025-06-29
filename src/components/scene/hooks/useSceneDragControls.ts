
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DragControls } from 'three-stdlib';
import { Mesh } from 'three';
import { useMovementMode } from '@/context/MovementModeContext';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';

export const useSceneDragControls = () => {
  const { camera, gl } = useThree();
  const { movementMode } = useMovementMode();
  const { objects, actions } = useSceneObjectsContext();
  const dragControlsRef = useRef<DragControls | null>(null);
  const objectRefs = useRef<Map<string, Mesh>>(new Map());

  // Register object mesh references
  const registerObject = (id: string, mesh: Mesh) => {
    objectRefs.current.set(id, mesh);
    updateDragControls();
  };

  // Unregister object mesh references
  const unregisterObject = (id: string) => {
    objectRefs.current.delete(id);
    updateDragControls();
  };

  // Update DragControls with current objects
  const updateDragControls = () => {
    if (dragControlsRef.current) {
      dragControlsRef.current.dispose();
    }

    const meshes = Array.from(objectRefs.current.values());
    if (meshes.length === 0) return;

    const controls = new DragControls(meshes, camera, gl.domElement);
    
    // Configure drag behavior
    controls.addEventListener('dragstart', (event) => {
      if (movementMode === 'none') return;
      
      // Find which object is being dragged
      const draggedMesh = event.object as Mesh;
      const objectEntry = Array.from(objectRefs.current.entries()).find(
        ([, mesh]) => mesh === draggedMesh
      );
      
      if (objectEntry) {
        const [objectId] = objectEntry;
        actions.selectObject(objectId);
        
        // Disable orbit controls during drag
        window.dispatchEvent(new CustomEvent('object-drag-start'));
      }
    });

    controls.addEventListener('drag', (event) => {
      if (movementMode === 'none') return;

      const object = event.object;
      const currentPos = object.position;

      // Apply movement constraints based on mode
      switch (movementMode) {
        case 'x-axis':
          // Store original Y and Z, only allow X movement
          if (!object.userData.initialPos) {
            object.userData.initialPos = { y: currentPos.y, z: currentPos.z };
          }
          object.position.y = object.userData.initialPos.y;
          object.position.z = object.userData.initialPos.z;
          break;
        case 'y-axis':
          // Store original X and Z, only allow Y movement
          if (!object.userData.initialPos) {
            object.userData.initialPos = { x: currentPos.x, z: currentPos.z };
          }
          object.position.x = object.userData.initialPos.x;
          object.position.z = object.userData.initialPos.z;
          break;
        case 'z-axis':
          // Store original X and Y, only allow Z movement
          if (!object.userData.initialPos) {
            object.userData.initialPos = { x: currentPos.x, y: currentPos.y };
          }
          object.position.x = object.userData.initialPos.x;
          object.position.y = object.userData.initialPos.y;
          break;
        case 'freehand':
          // Apply boundaries for freehand movement
          const maxDistance = 20;
          object.position.x = Math.max(-maxDistance, Math.min(maxDistance, currentPos.x));
          object.position.y = Math.max(-maxDistance, Math.min(maxDistance, currentPos.y));
          object.position.z = Math.max(-maxDistance, Math.min(maxDistance, currentPos.z));
          break;
      }
    });

    controls.addEventListener('dragend', (event) => {
      if (movementMode === 'none') return;
      
      // Clear stored initial position
      event.object.userData.initialPos = null;
      
      // Update object position in state
      const draggedMesh = event.object as Mesh;
      const objectEntry = Array.from(objectRefs.current.entries()).find(
        ([, mesh]) => mesh === draggedMesh
      );
      
      if (objectEntry) {
        const [objectId] = objectEntry;
        const finalPosition: [number, number, number] = [
          draggedMesh.position.x,
          draggedMesh.position.y,
          draggedMesh.position.z
        ];
        
        actions.updateObject(objectId, { position: finalPosition });
      }

      // Re-enable orbit controls after drag
      window.dispatchEvent(new CustomEvent('object-drag-end'));
    });

    // Enable/disable controls based on movement mode
    controls.enabled = movementMode !== 'none';
    
    dragControlsRef.current = controls;
  };

  // Update controls when movement mode changes
  useEffect(() => {
    if (dragControlsRef.current) {
      dragControlsRef.current.enabled = movementMode !== 'none';
    }
  }, [movementMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (dragControlsRef.current) {
        dragControlsRef.current.dispose();
      }
    };
  }, []);

  return {
    registerObject,
    unregisterObject,
    dragControls: dragControlsRef.current
  };
};
