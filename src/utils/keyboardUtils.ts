
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
  const lowerCaseKeys = keys.map(key => key.toLowerCase());
  const uniqueKeys = new Set(lowerCaseKeys);
  if (uniqueKeys.size !== keys.length) return false; // Check for duplicate keys

  const validKeys = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12',
    'enter', 'escape', 'space', 'tab', 'backspace', 'delete', 'insert',
    'home', 'end', 'pageup', 'pagedown',
    'arrowup', 'arrowdown', 'arrowleft', 'arrowright',
    'ctrl', 'alt', 'shift', 'meta', 'cmd',
    '+', '-', '=', '[', ']', '\\', ';', '\'', ',', '.', '/', '`'
  ];
  return lowerCaseKeys.every(key => validKeys.includes(key));
};

export const parseKeyCombo = (combo: string): string[] => {
  if (!combo.trim()) return [];
  
  // Handle special case where the last character is a plus sign
  if (combo.endsWith('+') && combo.length > 1) {
    const beforePlus = combo.slice(0, -1);
    const parts = beforePlus.split(/[+\-_ ]+/).filter(Boolean);
    return [...parts.map(p => p.toLowerCase()), '+'];
  }
  
  // Handle special case where the last character is equals sign after plus
  if (combo.includes('+=')) {
    const parts = combo.split('+=');
    const beforeEquals = parts[0];
    const modifiers = beforeEquals.split(/[+\-_ ]+/).filter(Boolean);
    return [...modifiers.map(m => m.toLowerCase()), '='];
  }
  
  return combo.toLowerCase().split(/[+\-_ ]+/).filter(Boolean);
};
