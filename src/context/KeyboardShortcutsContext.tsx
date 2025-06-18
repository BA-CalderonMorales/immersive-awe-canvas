
import { createContext, useContext, useState, ReactNode } from 'react';

interface KeyboardShortcutsContextType {
  isExpanded: boolean;
  toggleExpanded: () => void;
  isVisible: boolean;
  toggleVisible: () => void;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export const useKeyboardShortcuts = () => {
  const context = useContext(KeyboardShortcutsContext);
  if (context === undefined) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
};

export const KeyboardShortcutsProvider = ({ children }: { children: ReactNode }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const toggleVisible = () => {
    setIsVisible(prev => !prev);
  };

  return (
    <KeyboardShortcutsContext.Provider value={{
      isExpanded,
      toggleExpanded,
      isVisible,
      toggleVisible
    }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
};
