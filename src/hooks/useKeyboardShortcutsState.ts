
import { useState } from 'react';

export const useKeyboardShortcutsState = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const toggleVisible = () => {
    setIsVisible(prev => !prev);
  };

  return {
    isExpanded,
    isVisible,
    toggleExpanded,
    toggleVisible,
  };
};
