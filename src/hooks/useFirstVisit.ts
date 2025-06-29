
import { useState, useEffect } from 'react';

export const useFirstVisit = () => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showOnboardingHints, setShowOnboardingHints] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const hasVisited = localStorage.getItem('has-visited-immersive-canvas');
        const firstVisit = !hasVisited;
        
        setIsFirstVisit(firstVisit);
        setShowOnboardingHints(firstVisit);
        setIsInitialized(true);

        // Mark as visited after a delay to allow onboarding to show
        if (firstVisit) {
          const timer = setTimeout(() => {
            localStorage.setItem('has-visited-immersive-canvas', 'true');
          }, 5000);
          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.warn('Could not access localStorage for first visit tracking:', error);
        setIsInitialized(true);
      }
    }
  }, []);

  const handleFirstInteraction = () => {
    setShowOnboardingHints(false);
    setIsFirstVisit(false);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('has-visited-immersive-canvas', 'true');
      } catch (error) {
        console.warn('Could not save first visit state:', error);
      }
    }
  };

  return {
    isFirstVisit,
    showOnboardingHints,
    isInitialized,
    handleFirstInteraction
  };
};
