import { useRef, useState } from 'react';
import { Vector3 } from 'three';
import { ThreeEvent, useThree, useFrame } from '@react-three/fiber';

interface UseDragControlsProps {
  enabled: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDrag?: (position: Vector3) => void;
  smoothing?: number;
}

export const useDragControls = ({
  enabled,
  onDragStart,
  onDragEnd,
  onDrag,
  smoothing = 0.1
}: UseDragControlsProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { gl } = useThree();
  
  const dragOffset = useRef<Vector3>(new Vector3());
  const targetPosition = useRef<Vector3>(new Vector3());
  const currentPosition = useRef<Vector3>(new Vector3());
  const meshRef = useRef<any>(null);

  // Smooth interpolation frame loop
  useFrame(() => {
    if (isDragging && meshRef.current && smoothing > 0) {
      currentPosition.current.lerp(targetPosition.current, smoothing);
      meshRef.current.position.copy(currentPosition.current);
      onDrag?.(currentPosition.current);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!enabled) return;
    
    e.stopPropagation();
    setIsDragging(true);
    meshRef.current = e.object;
    onDragStart?.();
    
    // Calculate drag offset
    const intersectionPoint = e.point;
    const meshPosition = e.object.position;
    dragOffset.current.copy(intersectionPoint).sub(meshPosition);
    currentPosition.current.copy(meshPosition);
    targetPosition.current.copy(meshPosition);
    
    gl.domElement.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !enabled) return;
    
    e.stopPropagation();
    
    // Update target position for smooth interpolation
    const newPosition = e.point.clone().sub(dragOffset.current);
    targetPosition.current.copy(newPosition);
    
    // If no smoothing, update immediately
    if (smoothing === 0) {
      e.object.position.copy(newPosition);
      onDrag?.(newPosition);
    }
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    
    e.stopPropagation();
    setIsDragging(false);
    meshRef.current = null;
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