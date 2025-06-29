
import { useState, useRef, useCallback } from 'react';
import { Vector3 } from 'three';

export const useObjectInteraction = (
  onSelect: () => void,
  onDragStart?: () => void,
  onDrag?: (delta: Vector3) => void,
  onDragEnd?: () => void,
  movementMode: 'none' | 'x-axis' | 'y-axis' | 'z-axis' | 'freehand' = 'freehand'
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
  const isDraggingRef = useRef(false);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    
    console.log('Object pointer down detected, movement mode:', movementMode);
    
    const clientX = e.clientX || e.point?.x || 0;
    const clientY = e.clientY || e.point?.y || 0;
    
    setPointerStartTime(Date.now());
    setHasMoved(false);
    setStartPosition({ x: clientX, y: clientY });
    setLastDragPosition({ x: clientX, y: clientY });
    
    // Check if Ctrl key is pressed (for desktop dragging)
    const isCtrlPressed = e.ctrlKey || e.metaKey;
    
    if ((isCtrlPressed || e.type === 'pointerdown') && movementMode !== 'none') {
      // Immediate drag mode for desktop with Ctrl or mobile touch
      console.log('Immediate drag mode activated');
      setIsDragging(true);
      isDraggingRef.current = true;
      dragStartRef.current = true;
      setShowLongPressEffect(true);
      onDragStart?.();
    } else if (movementMode !== 'none') {
      // Start holographic effect immediately for visual feedback
      setShowLongPressEffect(true);
      console.log('Long press timer started');
      
      // Set up long press timer (300ms for more responsive feel)
      const timer = setTimeout(() => {
        if (!hasMoved) {
          console.log('Long press detected - activating drag mode');
          setIsDragging(true);
          isDraggingRef.current = true;
          dragStartRef.current = true;
          onDragStart?.();
        }
      }, 300);
      setLongPressTimer(timer);
    }
  }, [movementMode, hasMoved, onDragStart, longPressTimer]);

  const handlePointerMove = useCallback((e: any) => {
    if (!lastDragPosition) return;
    
    const currentX = e.clientX || e.point?.x || 0;
    const currentY = e.clientY || e.point?.y || 0;
    
    const moveDistance = Math.sqrt(
      Math.pow(currentX - startPosition.x, 2) + 
      Math.pow(currentY - startPosition.y, 2)
    );
    
    // If moved more than 5px, consider it movement
    if (moveDistance > 5) {
      setHasMoved(true);
      
      // Cancel long press if not in drag mode yet
      if (longPressTimer && !isDraggingRef.current) {
        console.log('Movement detected, canceling long press timer');
        clearLongPressTimer();
      }
    }
    
    // Handle dragging with proper scaling based on movement mode
    if (isDraggingRef.current && onDrag && movementMode !== 'none') {
      e.stopPropagation();
      
      const sensitivity = 0.01; // Increased sensitivity for better control
      const deltaX = (currentX - lastDragPosition.x) * sensitivity;
      const deltaY = -(currentY - lastDragPosition.y) * sensitivity; // Invert Y for natural movement
      
      let delta = new Vector3(0, 0, 0);
      
      // Apply movement constraints based on mode
      switch (movementMode) {
        case 'x-axis':
          delta.set(deltaX, 0, 0);
          break;
        case 'y-axis':
          delta.set(0, deltaY, 0);
          break;
        case 'z-axis':
          // Use horizontal mouse movement for Z-axis
          delta.set(0, 0, deltaX);
          break;
        case 'freehand':
          delta.set(deltaX, deltaY, 0);
          break;
      }
      
      onDrag(delta);
      
      console.log(`Dragging object in ${movementMode} mode with delta:`, delta);
      setLastDragPosition({ x: currentX, y: currentY });
    }
  }, [lastDragPosition, startPosition, longPressTimer, onDrag, movementMode, clearLongPressTimer]);

  const handlePointerUp = useCallback((e: any) => {
    e.stopPropagation();
    
    const pointerDuration = Date.now() - pointerStartTime;
    console.log('Pointer up, duration:', pointerDuration, 'ms');
    
    clearLongPressTimer();
    
    // End dragging
    if (isDraggingRef.current) {
      setIsDragging(false);
      isDraggingRef.current = false;
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
    setHasMoved(false);
  }, [pointerStartTime, clearLongPressTimer, onDragEnd, hasMoved, onSelect]);

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = isDraggingRef.current ? 'grabbing' : 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setIsHovered(false);
    if (!isDraggingRef.current) {
      setShowLongPressEffect(false);
      document.body.style.cursor = 'auto';
    }
  }, []);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    // Only select on click if we didn't drag and it's a quick interaction
    if (!hasMoved && !dragStartRef.current) {
      console.log('Click detected - selecting object');
      onSelect();
    }
  }, [hasMoved, onSelect]);

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
