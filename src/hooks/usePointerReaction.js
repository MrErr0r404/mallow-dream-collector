import { useState, useEffect, useRef } from 'react';


export function usePointerReaction(targetRef) {
  const internalRef = useRef(null);
  const ref = targetRef || internalRef;

  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    isHovering: false
  });

  const rafIdRef = useRef(null);
  const pendingEventRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
    const hasFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (isTouch && !hasFinePointer) {
      return;
    }

    const node = ref.current;
    if (!node) return;

    const handlePointerMove = (e) => {
      pendingEventRef.current = e;

      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          const ev = pendingEventRef.current;
          if (!ev || !ref.current) return;

          const rect = ref.current.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) return;

          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          const rawX = (ev.clientX - centerX) / (rect.width / 2);
          const rawY = (ev.clientY - centerY) / (rect.height / 2);

          const clampedX = Math.max(-1, Math.min(1, rawX));
          const clampedY = Math.max(-1, Math.min(1, rawY));

          setPosition({
            x: clampedX,
            y: clampedY,
            isHovering: true
          });
        });
      }
    };

    const handlePointerEnter = () => {
      setPosition((prev) => ({ ...prev, isHovering: true }));
    };

    const handlePointerLeave = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      pendingEventRef.current = null;
      setPosition({
        x: 0,
        y: 0,
        isHovering: false
      });
    };

    node.addEventListener('pointermove', handlePointerMove);
    node.addEventListener('pointerenter', handlePointerEnter);
    node.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      node.removeEventListener('pointermove', handlePointerMove);
      node.removeEventListener('pointerenter', handlePointerEnter);
      node.removeEventListener('pointerleave', handlePointerLeave);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [ref]);

  return {
    ref,
    x: position.x,
    y: position.y,
    isHovering: position.isHovering
  };
}

export default usePointerReaction;
