
export const isUserTyping = (): boolean => {
  const activeEl = document.activeElement;
  
  return activeEl && (
    activeEl.tagName === 'INPUT' ||
    activeEl.tagName === 'TEXTAREA' ||
    activeEl.getAttribute('contenteditable') === 'true'
  );
};
