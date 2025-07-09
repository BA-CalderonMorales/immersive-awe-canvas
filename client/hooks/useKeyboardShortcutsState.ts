
import { useState } from 'react';

export const useKeyboardShortcutsState = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const toggleExpanded = () => {
    console.log('useKeyboardShortcutsState - toggleExpanded called, current:', isExpanded);
    setIsExpanded(prev => !prev);
  };

  const toggleVisible = () => {
    console.log('useKeyboardShortcutsState - toggleVisible called, current:', isVisible);
    setIsVisible(prev => !prev);
  };

  return {
    isExpanded,
    isVisible,
    toggleExpanded,
    toggleVisible,
  };
};
