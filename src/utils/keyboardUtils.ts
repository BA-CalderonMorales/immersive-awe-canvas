
export const isUserTyping = (): boolean => {
  const activeEl = document.activeElement;
  
  return activeEl && (
    activeEl.tagName === 'INPUT' ||
    activeEl.tagName === 'TEXTAREA' ||
    activeEl.getAttribute('contenteditable') === 'true'
  );
};

export const formatKeyCombo = (keys: string[]): string => {
  return keys.map(key => key.charAt(0).toUpperCase() + key.slice(1)).join('+');
};

export const isValidKeyCombo = (keys: string[]): boolean => {
  if (keys.length === 0) return false;
  const validKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'Enter', 'Space', 'Tab', 'F1', 'F2', 'F3', 'F4', 'ctrl', 'alt', 'shift', 'meta', 'cmd'];
  return keys.every(key => validKeys.includes(key.toLowerCase()));
};

export const parseKeyCombo = (combo: string): string[] => {
  if (!combo.trim()) return [];
  return combo.toLowerCase().split(/[+\-_ ]+/).filter(Boolean);
};
