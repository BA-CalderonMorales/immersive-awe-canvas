import { useRef, useState } from 'react';
import { Vector3 } from 'three';
import { ThreeEvent, useThree } from '@react-three/fiber';

interface UseDragControlsProps {
  enabled: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrag?: (position: Vector3) => void;
}

export const useDragControls = ({
  enabled,
  onDragStart,
  onDragEnd,
  onDrag
}: UseDragControlsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { gl } = useThree();
  
  const dragOffset = useRef<Vector3>(new Vector3());

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!enabled) return;
    
    e.stopPropagation();
    setIsDragging(true);
    onDragStart?.();
    
    // Calculate drag offset
    const intersectionPoint = e.point;
    const meshPosition = e.object.position;
    dragOffset.current.copy(intersectionPoint).sub(meshPosition);
    
    gl.domElement.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !enabled) return;
    
    e.stopPropagation();
    
    // Convert screen coordinates to world position
    const newPosition = e.point.clone().sub(dragOffset.current);
    e.object.position.copy(newPosition);
    
    onDrag?.(newPosition);
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    
    e.stopPropagation();
    setIsDragging(false);
    onDragEnd?.();
    
    gl.domElement.releasePointerCapture(e.pointerId);
  };

  const handlePointerEnter = () => {
    if (enabled) {
      document.body.style.cursor = isDragging ? 'grabbing' : 'grab';
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      document.body.style.cursor = 'auto';
    }
  };

  return {
    isDragging,
    dragHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave,
    }
  };
};