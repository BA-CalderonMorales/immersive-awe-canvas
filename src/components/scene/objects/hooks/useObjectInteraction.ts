
import { useState, useRef, useCallback } from 'react';
import { Vector3 } from 'three';

export const useObjectInteraction = (
  onSelect: () => void,
  onDragStart?: () => void,
  onDrag?: (delta: Vector3) => void,
  onDragEnd?: () => void
) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLongPressEffect, setShowLongPressEffect] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [pointerStartTime, setPointerStartTime] = useState<number>(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [lastDragPosition, setLastDragPosition] = useState<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef(false);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    
    console.log('Object pointer down detected');
    
    const clientX = e.clientX || e.point?.x || 0;
    const clientY = e.clientY || e.point?.y || 0;
    
    setPointerStartTime(Date.now());
    setHasMoved(false);
    setStartPosition({ x: clientX, y: clientY });
    setLastDragPosition({ x: clientX, y: clientY });
    
    // Check if Ctrl key is pressed (for desktop dragging)
    const isCtrlPressed = e.ctrlKey || e.metaKey;
    
    if (isCtrlPressed) {
      // Immediate drag mode for desktop with Ctrl
      console.log('Ctrl+drag mode activated immediately');
      setIsDragging(true);
      dragStartRef.current = true;
      setShowLongPressEffect(true);
      onDragStart?.();
    } else {
      // Start holographic effect immediately for visual feedback
      setShowLongPressEffect(true);
      console.log('Long press timer started for mobile');
      
      // Set up long press timer for mobile (500ms)
      const timer = setTimeout(() => {
        if (!hasMoved) {
          console.log('Long press detected - activating drag mode');
          setIsDragging(true);
          dragStartRef.current = true;
          onDragStart?.();
        }
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handlePointerMove = (e: any) => {
    if (!lastDragPosition) return;
    
    const currentX = e.clientX || e.point?.x || 0;
    const currentY = e.clientY || e.point?.y || 0;
    
    const moveDistance = Math.sqrt(
      Math.pow(currentX - startPosition.x, 2) + 
      Math.pow(currentY - startPosition.y, 2)
    );
    
    // If moved more than 10px, consider it movement
    if (moveDistance > 10) {
      setHasMoved(true);
      
      // Cancel long press if not in drag mode yet
      if (longPressTimer && !isDragging) {
        console.log('Movement detected, canceling long press timer');
        clearLongPressTimer();
      }
    }
    
    // Handle dragging with proper scaling
    if (isDragging && onDrag) {
      e.stopPropagation();
      
      const deltaX = (currentX - lastDragPosition.x) * 0.005; // Reduced sensitivity
      const deltaY = -(currentY - lastDragPosition.y) * 0.005; // Invert Y for 3D space
      
      const delta = new Vector3(deltaX, deltaY, 0);
      onDrag(delta);
      
      console.log('Dragging object with delta:', { deltaX, deltaY });
      setLastDragPosition({ x: currentX, y: currentY });
    }
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    
    const pointerDuration = Date.now() - pointerStartTime;
    console.log('Pointer up, duration:', pointerDuration, 'ms');
    
    clearLongPressTimer();
    
    // End dragging
    if (isDragging) {
      setIsDragging(false);
      dragStartRef.current = false;
      onDragEnd?.();
      console.log('Drag ended');
    }
    
    // Fade out the holographic effect after a short delay
    setTimeout(() => {
      setShowLongPressEffect(false);
    }, 200);
    
    // If it was a quick tap (less than 200ms) and didn't move much and wasn't dragging
    if (pointerDuration < 200 && !hasMoved && !dragStartRef.current) {
      console.log('Quick tap detected - selecting object');
      onSelect();
    }
    
    setLastDragPosition(null);
  };

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = isDragging ? 'grabbing' : 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    if (!isDragging) {
      setShowLongPressEffect(false);
      document.body.style.cursor = 'auto';
    }
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    // Only select on click if we didn't drag
    if (!hasMoved && !dragStartRef.current) {
      console.log('Click detected - selecting object');
      onSelect();
    }
  };

  return {
    isHovered,
    showLongPressEffect,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
    handleClick,
  };
};
