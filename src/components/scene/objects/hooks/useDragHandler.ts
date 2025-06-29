
import { useRef, useCallback } from 'react';
import { Vector3, Vector2, Camera } from 'three';

interface DragHandlerProps {
  camera: Camera;
  onDragStart: () => void;
  onDragEnd: () => void;
  onPositionUpdate: (position: [number, number, number]) => void;
  movementMode: 'none' | 'x-axis' | 'y-axis' | 'z-axis' | 'freehand';
}

export const useDragHandler = ({
  camera,
  onDragStart,
  onDragEnd,
  onPositionUpdate,
  movementMode
}: DragHandlerProps) => {
  const isDragging = useRef(false);
  const dragStartPosition = useRef(new Vector3());
  const dragStartMouse = useRef(new Vector2());
  const currentPosition = useRef(new Vector3());

  const startDrag = useCallback((event: any, objectPosition: Vector3) => {
    if (movementMode === 'none') return;

    isDragging.current = true;
    dragStartPosition.current.copy(objectPosition);
    currentPosition.current.copy(objectPosition);
    
    // Store initial mouse position
    const rect = event.target.getBoundingClientRect();
    dragStartMouse.current.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    onDragStart();
    console.log('Drag started in mode:', movementMode);
  }, [movementMode, onDragStart]);

  const updateDrag = useCallback((event: any) => {
    if (!isDragging.current || movementMode === 'none') return;

    // Get current mouse position in NDC
    const rect = event.target.getBoundingClientRect();
    const currentMouse = new Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    // Calculate mouse delta
    const mouseDelta = currentMouse.clone().sub(dragStartMouse.current);

    // Convert to world space movement
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    
    const cameraUp = camera.up.clone();
    const cameraRight = new Vector3().crossVectors(cameraDirection, cameraUp).normalize();

    // Calculate movement based on camera orientation and mode
    const moveDistance = 3; // Base movement sensitivity
    let newPosition = dragStartPosition.current.clone();

    switch (movementMode) {
      case 'x-axis':
        // Move along world X-axis
        newPosition.x += mouseDelta.x * moveDistance;
        break;
      case 'y-axis':
        // Move along world Y-axis
        newPosition.y -= mouseDelta.y * moveDistance;
        break;
      case 'z-axis':
        // Move along world Z-axis (using horizontal mouse movement)
        newPosition.z += mouseDelta.x * moveDistance;
        break;
      case 'freehand':
        // Free movement in camera space
        const rightMovement = cameraRight.clone().multiplyScalar(mouseDelta.x * moveDistance);
        const upMovement = cameraUp.clone().multiplyScalar(mouseDelta.y * moveDistance);
        newPosition.add(rightMovement).add(upMovement);
        break;
    }

    // Boundary checks
    const maxDistance = 20;
    newPosition.x = Math.max(-maxDistance, Math.min(maxDistance, newPosition.x));
    newPosition.y = Math.max(-maxDistance, Math.min(maxDistance, newPosition.y));
    newPosition.z = Math.max(-maxDistance, Math.min(maxDistance, newPosition.z));

    currentPosition.current.copy(newPosition);
    onPositionUpdate([newPosition.x, newPosition.y, newPosition.z]);
  }, [camera, movementMode, onPositionUpdate]);

  const endDrag = useCallback(() => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    onDragEnd();
    console.log('Drag ended');
  }, [onDragEnd]);

  return {
    isDragging: isDragging.current,
    startDrag,
    updateDrag,
    endDrag
  };
};
