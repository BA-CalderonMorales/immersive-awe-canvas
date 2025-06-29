
import { useRef, useCallback, useEffect } from 'react';
import { Vector3, Camera, Mesh } from 'three';
import { DragControls } from 'three-stdlib';
import { useThree } from '@react-three/fiber';

interface DragHandlerProps {
  camera: Camera;
  onDragStart: () => void;
  onDragEnd: () => void;
  onPositionUpdate: (position: [number, number, number]) => void;
  movementMode: 'none' | 'x-axis' | 'y-axis' | 'z-axis' | 'freehand';
  meshRef: React.MutableRefObject<Mesh>;
}

export const useDragHandler = ({
  camera,
  onDragStart,
  onDragEnd,
  onPositionUpdate,
  movementMode,
  meshRef
}: DragHandlerProps) => {
  const { gl } = useThree();
  const dragControlsRef = useRef<DragControls | null>(null);
  const isDragging = useRef(false);
  const initialPosition = useRef(new Vector3());

  // Initialize DragControls
  useEffect(() => {
    if (!meshRef.current) return;

    const objects = [meshRef.current];
    const controls = new DragControls(objects, camera, gl.domElement);

    // Configure drag behavior based on movement mode
    controls.addEventListener('dragstart', (event) => {
      if (movementMode === 'none') return;
      
      isDragging.current = true;
      initialPosition.current.copy(event.object.position);
      onDragStart();

      // Disable orbit controls during drag
      window.dispatchEvent(new CustomEvent('object-drag-start'));
    });

    controls.addEventListener('drag', (event) => {
      if (movementMode === 'none' || !isDragging.current) return;

      const object = event.object;
      const currentPos = object.position;
      const initialPos = initialPosition.current;

      // Apply movement constraints based on mode
      switch (movementMode) {
        case 'x-axis':
          object.position.set(currentPos.x, initialPos.y, initialPos.z);
          break;
        case 'y-axis':
          object.position.set(initialPos.x, currentPos.y, initialPos.z);
          break;
        case 'z-axis':
          object.position.set(initialPos.x, initialPos.y, currentPos.z);
          break;
        case 'freehand':
          // Allow free movement but apply boundaries
          const maxDistance = 20;
          object.position.x = Math.max(-maxDistance, Math.min(maxDistance, currentPos.x));
          object.position.y = Math.max(-maxDistance, Math.min(maxDistance, currentPos.y));
          object.position.z = Math.max(-maxDistance, Math.min(maxDistance, currentPos.z));
          break;
      }

      onPositionUpdate([
        object.position.x,
        object.position.y,
        object.position.z
      ]);
    });

    controls.addEventListener('dragend', () => {
      if (movementMode === 'none') return;
      
      isDragging.current = false;
      onDragEnd();

      // Re-enable orbit controls after drag
      window.dispatchEvent(new CustomEvent('object-drag-end'));
    });

    dragControlsRef.current = controls;

    return () => {
      controls.dispose();
    };
  }, [camera, gl.domElement, movementMode, onDragStart, onDragEnd, onPositionUpdate, meshRef]);

  // Enable/disable controls based on movement mode
  useEffect(() => {
    if (dragControlsRef.current) {
      dragControlsRef.current.enabled = movementMode !== 'none';
    }
  }, [movementMode]);

  const activate = useCallback(() => {
    if (dragControlsRef.current) {
      dragControlsRef.current.activate();
    }
  }, []);

  const deactivate = useCallback(() => {
    if (dragControlsRef.current) {
      dragControlsRef.current.deactivate();
    }
  }, []);

  return {
    isDragging: isDragging.current,
    activate,
    deactivate,
    dragControls: dragControlsRef.current
  };
};
