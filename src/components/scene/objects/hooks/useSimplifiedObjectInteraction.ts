
import { useState, useRef, useCallback } from 'react';

export const useSimplifiedObjectInteraction = (
  onSelect: () => void,
  onDragStart?: (event: any) => void,
  onDrag?: (event: any) => void,
  onDragEnd?: () => void,
  movementMode: 'none' | 'x-axis' | 'y-axis' | 'z-axis' | 'freehand' = 'freehand'
) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLongPressEffect, setShowLongPressEffect] = useState(false);
  const isDraggingRef = useRef(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const dragStartTime = useRef(0);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handlePointerDown = useCallback((e: any) => {
    e.stopPropagation();
    
    if (movementMode === 'none') {
      onSelect();
      return;
    }

    dragStartTime.current = Date.now();

    // Immediate drag for desktop with Ctrl or mobile
    const isCtrlPressed = e.ctrlKey || e.metaKey;
    const isMobile = 'touches' in e || e.pointerType === 'touch';
    
    if (isCtrlPressed || isMobile) {
      isDraggingRef.current = true;
      setShowLongPressEffect(true);
      onDragStart?.(e);
      return;
    }

    // Long press for desktop without Ctrl
    setShowLongPressEffect(true);
    longPressTimer.current = setTimeout(() => {
      isDraggingRef.current = true;
      onDragStart?.(e);
    }, 300);
  }, [movementMode, onSelect, onDragStart]);

  const handlePointerMove = useCallback((e: any) => {
    if (isDraggingRef.current && onDrag) {
      e.stopPropagation();
      onDrag(e);
    }
  }, [onDrag]);

  const handlePointerUp = useCallback((e: any) => {
    e.stopPropagation();
    
    clearLongPressTimer();
    
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      onDragEnd?.();
    } else {
      // Quick tap/click - select object
      const tapDuration = Date.now() - dragStartTime.current;
      if (tapDuration < 200) {
        onSelect();
      }
    }
    
    setTimeout(() => setShowLongPressEffect(false), 200);
  }, [clearLongPressTimer, onDragEnd, onSelect]);

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
    if (!isDraggingRef.current) {
      onSelect();
    }
  }, [onSelect]);

  return {
    isHovered,
    showLongPressEffect,
    isDragging: isDraggingRef.current,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
    handleClick,
  };
};
