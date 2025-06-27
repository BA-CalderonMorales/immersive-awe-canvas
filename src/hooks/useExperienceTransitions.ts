
import { useState, useEffect, useRef } from 'react';

export const useExperienceTransitions = (isTransitioning: boolean) => {
  const [showEntryTransition, setShowEntryTransition] = useState(true);
  const [showWorldTransition, setShowWorldTransition] = useState(false);
  const [showBlurTransition, setShowBlurTransition] = useState(true);
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

  const handleBlurTransitionEnd = () => {
    setShowBlurTransition(false);
  };

  // Handle world switching transitions
  useEffect(() => {
    if (isTransitioning) {
      setShowBlurTransition(true);
      setShowWorldTransition(false);
      
      // Smooth transition sequence
      const blurTimer = setTimeout(() => {
        setShowBlurTransition(false);
        setShowWorldTransition(true);
      }, 300);
      
      return () => clearTimeout(blurTimer);
    } else {
      // Smooth transition out
      const timer = setTimeout(() => {
        setShowWorldTransition(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Handle initial blur transition
  useEffect(() => {
    if (showBlurTransition) {
      const timer = setTimeout(() => {
        setShowBlurTransition(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showBlurTransition]);

  return {
    showEntryTransition,
    showWorldTransition,
    showBlurTransition,
    handleEntryTransitionEnd,
    handleWorldTransitionEnd,
    handleBlurTransitionEnd,
  };
};
