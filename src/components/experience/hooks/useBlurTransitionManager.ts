
import { useState, useEffect } from 'react';

export const useBlurTransitionManager = ({ isTransitioning, showEntryTransition }: { isTransitioning: boolean; showEntryTransition: boolean }) => {
  const [showBlurTransition, setShowBlurTransition] = useState(false);

  useEffect(() => {
    if (isTransitioning && !showEntryTransition) {
      setShowBlurTransition(true);
      const timer = setTimeout(() => setShowBlurTransition(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning, showEntryTransition]);

  return {
    showBlurTransition,
    handleBlurTransitionEnd: () => setShowBlurTransition(false),
  };
};
