
import { useState, useRef } from 'react';

export const useObjectInteraction = (onSelect: () => void) => {
  const [isHovered, setIsHovered] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [pointerStartTime, setPointerStartTime] = useState<number>(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    
    setPointerStartTime(Date.now());
    setHasMoved(false);
    setStartPosition({ x: e.clientX || e.point?.x || 0, y: e.clientY || e.point?.y || 0 });
    
    const timer = setTimeout(() => {
      if (!hasMoved) {
        console.log('Long press detected on object');
        onSelect();
      }
    }, 500);
    setLongPressTimer(timer);
  };

  const handlePointerMove = (e: any) => {
    const currentX = e.clientX || e.point?.x || 0;
    const currentY = e.clientY || e.point?.y || 0;
    
    const moveDistance = Math.sqrt(
      Math.pow(currentX - startPosition.x, 2) + 
      Math.pow(currentY - startPosition.y, 2)
    );
    
    // If moved more than 10px, cancel long press
    if (moveDistance > 10) {
      setHasMoved(true);
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    
    const pointerDuration = Date.now() - pointerStartTime;
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // If it was a quick tap (less than 200ms) and didn't move much
    if (pointerDuration < 200 && !hasMoved) {
      console.log('Quick tap on object');
      onSelect();
    }
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect();
  };

  return {
    isHovered,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
    handleClick,
  };
};
