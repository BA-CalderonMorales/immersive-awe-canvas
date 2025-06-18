
import { useCallback } from 'react';
import { isUserTyping } from '@/utils/keyboardUtils';

interface KeyboardEventHandlerProps {
  onToggleTheme: () => void;
  onChangeWorld: (direction: 'next' | 'prev') => void;
  onOpenSearch: () => void;
  onGoHome: () => void;
  onOpenHelp: () => void;
  onToggleSettings: () => void;
  onCopyCode: () => void;
  onToggleUi: () => void;
  onToggleLock: () => void;
  onToggleShortcuts: () => void;
  enabled: boolean;
}

export const useKeyboardEventHandler = ({
  onToggleTheme,
  onChangeWorld,
  onOpenSearch,
  onGoHome,
  onOpenHelp,
  onToggleSettings,
  onCopyCode,
  onToggleUi,
  onToggleLock,
  onToggleShortcuts,
  enabled,
}: KeyboardEventHandlerProps) => {
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    const typing = isUserTyping();

    switch (event.code) {
      case 'Space':
        event.preventDefault();
        onToggleTheme();
        break;
      
      case 'KeyN':
        if (!typing) {
          event.preventDefault();
          onChangeWorld('next');
        }
        break;
      
      case 'KeyP':
        if (!typing) {
          event.preventDefault();
          onChangeWorld('prev');
        }
        break;
      
      case 'KeyK':
        if ((event.ctrlKey || event.metaKey) && !typing) {
          event.preventDefault();
          onOpenSearch();
        }
        break;
      
      case 'KeyG':
        if (!typing) {
          event.preventDefault();
          onGoHome();
        }
        break;
      
      case 'KeyS':
        if (!typing) {
          event.preventDefault();
          onOpenSearch();
        }
        break;
      
      case 'KeyH':
        if (!typing) {
          event.preventDefault();
          onOpenHelp();
        }
        break;
      
      case 'KeyE':
        if (!typing) {
          event.preventDefault();
          onToggleSettings();
        }
        break;
      
      case 'KeyC':
        if (!typing) {
          event.preventDefault();
          onCopyCode();
        }
        break;
      
      case 'KeyV':
        if (!typing) {
          event.preventDefault();
          onToggleUi();
        }
        break;
      
      case 'Period':
        if (!typing) {
          event.preventDefault();
          onToggleLock();
        }
        break;
      
      case 'KeyM':
        if (!typing) {
          event.preventDefault();
          onToggleShortcuts();
        }
        break;
    }
  }, [
    enabled,
    onToggleTheme,
    onChangeWorld,
    onOpenSearch,
    onGoHome,
    onOpenHelp,
    onToggleSettings,
    onCopyCode,
    onToggleUi,
    onToggleLock,
    onToggleShortcuts,
  ]);

  return { handleKeyDown };
};
