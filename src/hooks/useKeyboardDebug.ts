
import { useEffect, useState } from 'react';
import { debugLogger } from '@/lib/debugLogs';

export const useKeyboardDebug = (enabled: boolean = false) => {
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const keyInfo = {
        code: event.code,
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        target: event.target instanceof Element ? event.target.tagName : 'Unknown',
        activeElement: document.activeElement?.tagName || 'Unknown'
      };

      console.log('🔍 useKeyboardDebug - Key pressed:', keyInfo);
      
      // Special logging for 'M' key
      if (event.code === 'KeyM') {
        debugLogger.logAttempt(
          "Letter 'M' key debugging",
          "Capturing 'M' key in useKeyboardDebug hook",
          "Key captured successfully in debug hook",
          `Target: ${keyInfo.target}, Active: ${keyInfo.activeElement}, Typing: ${event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement}`
        );
      }
      
      setLastKey(event.code);
      setKeyHistory(prev => [...prev.slice(-9), event.code]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  return { lastKey, keyHistory };
};
