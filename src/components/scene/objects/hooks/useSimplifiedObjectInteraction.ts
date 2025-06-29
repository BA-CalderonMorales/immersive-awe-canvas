
import { useState, useCallback } from 'react';

export const useSimplifiedObjectInteraction = (
  onSelect: () => void,
  movementMode: 'none' | 'x-axis' | 'y-axis' | 'z-axis' | 'freehand' = 'freehand'
) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = movementMode !== 'none' ? 'grab' : 'pointer';
  }, [movementMode]);

  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    onSelect();
  }, [onSelect]);

  return {
    isHovered,
    showLongPressEffect: false,
    isDragging: false,
    handlePointerDown: () => {},
    handlePointerMove: () => {},
    handlePointerUp: () => {},
    handlePointerOver,
    handlePointerOut,
    handleClick,
  };
};
