
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from '@/context/KeyboardShortcutsContext';
import { logEvent } from '@/lib/logger';

export const useExperienceCallbacks = () => {
  const navigate = useNavigate();
  const { toggleVisible: toggleKeyboardShortcuts } = useKeyboardShortcuts();

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleToggleShortcuts = useCallback(() => {
    console.log('useExperienceCallbacks - handleToggleShortcuts called');
    toggleKeyboardShortcuts();
    logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_shortcuts' });
  }, [toggleKeyboardShortcuts]);

  return {
    handleGoHome,
    handleToggleShortcuts,
  };
};
