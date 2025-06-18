
import { useState, useEffect, useRef } from 'react';

export const useExperienceTransitions = (isTransitioning: boolean) => {
  const [showEntryTransition, setShowEntryTransition] = useState(true);
  const [showWorldTransition, setShowWorldTransition] = useState(false);
  const hintShownRef = useRef(false);

  const handleEntryTransitionEnd = () => {
    setShowEntryTransition(false);
    if (!hintShownRef.current) {
      hintShownRef.current = true;
      // This will be handled by the parent component
    }
  };

  const handleWorldTransitionEnd = () => {
    setShowWorldTransition(false);
  };

  useEffect(() => {
    if (isTransitioning) {
      setShowWorldTransition(true);
    }
  }, [isTransitioning]);

  return {
    showEntryTransition,
    showWorldTransition,
    handleEntryTransitionEnd,
    handleWorldTransitionEnd,
  };
};
