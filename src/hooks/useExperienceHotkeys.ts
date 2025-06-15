
import { useEffect } from 'react';
import { logEvent } from "@/lib/logger";

interface HotkeyCallbacks {
  toggleTheme: () => void;
  changeWorld: (direction: 'next' | 'prev') => void;
  openSearch: () => void;
  goHome: () => void;
  openHelp: () => void;
  toggleSettings: () => void;
  copyCode: () => void;
  toggleUi: () => void;
  toggleLock: () => void;
}

interface useExperienceHotkeysProps {
  callbacks: HotkeyCallbacks;
  enabled: boolean;
}

export const useExperienceHotkeys = ({ callbacks, enabled }: useExperienceHotkeysProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return;

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          callbacks.toggleTheme();
          logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_theme' });
          break;
        case 'KeyN':
           event.preventDefault();
           callbacks.changeWorld('next');
           break;
        case 'KeyP':
           event.preventDefault();
           callbacks.changeWorld('prev');
           break;
        case 'KeyK':
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            callbacks.openSearch();
          }
          break;
        case 'KeyG':
          event.preventDefault();
          callbacks.goHome();
          break;
        case 'KeyS':
          event.preventDefault();
          callbacks.openSearch();
          break;
        case 'KeyH':
          event.preventDefault();
          callbacks.openHelp();
          logEvent({ eventType: 'keyboard_shortcut', eventSource: 'open_help' });
          break;
        case 'KeyE':
          event.preventDefault();
          callbacks.toggleSettings();
          logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_settings' });
          break;
        case 'KeyC':
          event.preventDefault();
          callbacks.copyCode();
          break;
        case 'KeyV':
          event.preventDefault();
          callbacks.toggleUi();
          break;
        case 'Period':
          event.preventDefault();
          callbacks.toggleLock();
          logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_lock' });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callbacks, enabled]);
};
