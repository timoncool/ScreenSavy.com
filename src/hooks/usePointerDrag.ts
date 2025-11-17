/**
 * usePointerDrag Hook
 * Unified hook for pointer drag interactions
 * Eliminates code duplication for color picker sliders
 */

import { useCallback, useRef, RefObject } from 'react';

interface PointerDragOptions {
  onDrag: (x: number, y: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function usePointerDrag<T extends HTMLElement>(
  elementRef: RefObject<T>,
  options: PointerDragOptions
) {
  const isDraggingRef = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent<T>) => {
    if (!elementRef.current) return;
    
    isDraggingRef.current = true;
    elementRef.current.setPointerCapture(e.pointerId);
    
    options.onDragStart?.();
    
    const rect = elementRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    options.onDrag(
      Math.max(0, Math.min(1, x)),
      Math.max(0, Math.min(1, y))
    );
  }, [elementRef, options]);

  const handlePointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (!isDraggingRef.current || !elementRef.current) return;
    
    const rect = elementRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    options.onDrag(
      Math.max(0, Math.min(1, x)),
      Math.max(0, Math.min(1, y))
    );
  }, [elementRef, options]);

  const handlePointerUp = useCallback((e: React.PointerEvent<T>) => {
    if (!elementRef.current) return;
    
    isDraggingRef.current = false;
    elementRef.current.releasePointerCapture(e.pointerId);
    
    options.onDragEnd?.();
  }, [elementRef, options]);

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    isDragging: isDraggingRef.current,
  };
}
