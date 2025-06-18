
import { createContext, useContext, ReactNode } from 'react';
import { useKeyboardShortcutsState } from '@/hooks/useKeyboardShortcutsState';

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
  const shortcuts = useKeyboardShortcutsState();

  return (
    <KeyboardShortcutsContext.Provider value={shortcuts}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
};
