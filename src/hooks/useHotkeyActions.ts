
import { useCallback } from 'react';
import { logEvent } from "@/lib/logger";

interface HotkeyActionCallbacks {
  toggleTheme: () => void;
  changeWorld: (direction: 'next' | 'prev') => void;
  changeGeometry: (direction: 'next' | 'prev') => void;
  openSearch: () => void;
  goHome: () => void;
  openHelp: () => void;
  toggleSettings: () => void;
  copyCode: () => void;
  toggleUi: () => void;
  toggleLock: () => void;
  toggleShortcuts: () => void;
}

export const useHotkeyActions = (callbacks: HotkeyActionCallbacks) => {
  const handleToggleTheme = useCallback(() => {
    callbacks.toggleTheme();
    logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_theme' });
  }, [callbacks]);

  const handleToggleShortcuts = useCallback(() => {
    console.log('useHotkeyActions - handleToggleShortcuts called');
    callbacks.toggleShortcuts();
    logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_shortcuts' });
  }, [callbacks]);

  const handleToggleLock = useCallback(() => {
    callbacks.toggleLock();
    logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_lock' });
  }, [callbacks]);

  const handleOpenHelp = useCallback(() => {
    callbacks.openHelp();
    logEvent({ eventType: 'keyboard_shortcut', eventSource: 'open_help' });
  }, [callbacks]);

  const handleToggleSettings = useCallback(() => {
    callbacks.toggleSettings();
    logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_settings' });
  }, [callbacks]);

  return {
    handleToggleTheme,
    handleToggleShortcuts,
    handleToggleLock,
    handleOpenHelp,
    handleToggleSettings,
    changeWorld: callbacks.changeWorld,
    changeGeometry: callbacks.changeGeometry,
    openSearch: callbacks.openSearch,
    goHome: callbacks.goHome,
    copyCode: callbacks.copyCode,
    toggleUi: callbacks.toggleUi,
  };
};
