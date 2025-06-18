
import { useEffect, useState } from 'react';

export const useKeyboardDebug = (enabled: boolean = false) => {
  const [lastKey, setLastKey] = useState<string | null>(null);
  const [keyHistory, setKeyHistory] = useState<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('Key pressed:', {
        code: event.code,
        key: event.key,
        ctrlKey: event.ctrlKey,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        target: event.target instanceof Element ? event.target.tagName : 'Unknown',
        activeElement: document.activeElement?.tagName || 'Unknown'
      });
      
      setLastKey(event.code);
      setKeyHistory(prev => [...prev.slice(-9), event.code]);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  return { lastKey, keyHistory };
};
