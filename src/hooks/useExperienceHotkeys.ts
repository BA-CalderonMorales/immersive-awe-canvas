
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
  toggleShortcuts?: () => void;
}

interface useExperienceHotkeysProps {
  callbacks: HotkeyCallbacks;
  enabled: boolean;
}

export const useExperienceHotkeys = ({ callbacks, enabled }: useExperienceHotkeysProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return;

      // Check if user is typing in an input field
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.getAttribute('contenteditable') === 'true'
      );

      switch (event.code) {
        case 'Space':
          // Always prevent default for spacebar and allow theme toggle
          event.preventDefault();
          callbacks.toggleTheme();
          logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_theme' });
          break;
        case 'KeyN':
          if (!isTyping) {
            event.preventDefault();
            callbacks.changeWorld('next');
          }
          break;
        case 'KeyP':
          if (!isTyping) {
            event.preventDefault();
            callbacks.changeWorld('prev');
          }
          break;
        case 'KeyK':
          if ((event.ctrlKey || event.metaKey) && !isTyping) {
            event.preventDefault();
            callbacks.openSearch();
          }
          break;
        case 'KeyG':
          if (!isTyping) {
            event.preventDefault();
            callbacks.goHome();
          }
          break;
        case 'KeyS':
          if (!isTyping) {
            event.preventDefault();
            callbacks.openSearch();
          }
          break;
        case 'KeyH':
          if (!isTyping) {
            event.preventDefault();
            callbacks.openHelp();
            logEvent({ eventType: 'keyboard_shortcut', eventSource: 'open_help' });
          }
          break;
        case 'KeyE':
          if (!isTyping) {
            event.preventDefault();
            callbacks.toggleSettings();
            logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_settings' });
          }
          break;
        case 'KeyC':
          if (!isTyping) {
            event.preventDefault();
            callbacks.copyCode();
          }
          break;
        case 'KeyV':
          if (!isTyping) {
            event.preventDefault();
            callbacks.toggleUi();
          }
          break;
        case 'Period':
          if (!isTyping) {
            event.preventDefault();
            callbacks.toggleLock();
            logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_lock' });
          }
          break;
        case 'Backquote':
          if (!isTyping && callbacks.toggleShortcuts) {
            event.preventDefault();
            callbacks.toggleShortcuts();
            logEvent({ eventType: 'keyboard_shortcut', eventSource: 'toggle_shortcuts' });
          }
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callbacks, enabled]);
};
