
import { useState, useEffect, useRef } from 'react';

export const useExperienceTransitions = (isTransitioning: boolean) => {
  const [showEntryTransition, setShowEntryTransition] = useState(true);
  const [showWorldTransition, setShowWorldTransition] = useState(false);
  const hintShownRef = useRef(false);

  const handleEntryTransitionEnd = () => {
    setShowEntryTransition(false);
    if (!hintShownRef.current) {
      hintShownRef.current = true;
    }
  };

  const handleWorldTransitionEnd = () => {
    setShowWorldTransition(false);
  };

  useEffect(() => {
    if (isTransitioning) {
      setShowWorldTransition(true);
      // Add slight delay to prevent jarring transition
      const timer = setTimeout(() => {
        setShowWorldTransition(true);
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // Smooth transition out
      const timer = setTimeout(() => {
        setShowWorldTransition(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  return {
    showEntryTransition,
    showWorldTransition,
    handleEntryTransitionEnd,
    handleWorldTransitionEnd,
  };
};
