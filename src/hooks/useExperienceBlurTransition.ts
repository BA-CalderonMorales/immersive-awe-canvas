
import { useState, useEffect } from 'react';

export const useExperienceBlurTransition = (isTransitioning: boolean, showEntryTransition: boolean) => {
  const [showBlurTransition, setShowBlurTransition] = useState(false);

  const handleBlurTransitionEnd = () => {
    setShowBlurTransition(false);
  };

  // Only show blur transition during world changes, not on initial load
  useEffect(() => {
    if (isTransitioning && !showEntryTransition) {
      setShowBlurTransition(true);
      const timer = setTimeout(() => {
        setShowBlurTransition(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, showEntryTransition]);

  return {
    showBlurTransition,
    handleBlurTransitionEnd,
  };
};
