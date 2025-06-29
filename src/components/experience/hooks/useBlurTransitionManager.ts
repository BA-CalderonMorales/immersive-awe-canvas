
import { useState, useEffect } from 'react';

interface UseBlurTransitionManagerProps {
  isTransitioning: boolean;
  showEntryTransition: boolean;
}

export const useBlurTransitionManager = ({ isTransitioning, showEntryTransition }: UseBlurTransitionManagerProps) => {
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
