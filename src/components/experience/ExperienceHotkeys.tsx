
import { useExperienceHotkeys } from "@/hooks/useExperienceHotkeys";
import { useEffect } from "react";
import HelpDialog from "@/components/dialogs/HelpDialog";
import WorldSearchDialog from "@/components/dialogs/WorldSearchDialog";

interface ExperienceHotkeysProps {
  toggleTheme: () => void;
  changeWorld: (direction: 'next' | 'prev') => void;
  handleGoHome: () => void;
  handleCopyCode: () => void;
  toggleObjectLock: () => void;
  handleToggleShortcuts: () => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsHelpOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setIsUiHidden: (hidden: boolean | ((prev: boolean) => boolean)) => void;
  isHelpOpen: boolean;
  isSearchOpen: boolean;
  isSettingsOpen: boolean;
  worlds: any[];
  jumpToWorld: (worldId: number) => void;
  onToggleDrag?: () => void;
}

const ExperienceHotkeys = ({
  toggleTheme,
  changeWorld,
  handleGoHome,
  handleCopyCode,
  toggleObjectLock,
  handleToggleShortcuts,
  setIsSearchOpen,
  setIsHelpOpen,
  setIsSettingsOpen,
  setIsUiHidden,
  isHelpOpen,
  isSearchOpen,
  isSettingsOpen,
  worlds,
  jumpToWorld,
  onToggleDrag,
}: ExperienceHotkeysProps) => {
  
  // Handle M key separately - should always work
  useEffect(() => {
    const handleMKey = (event: KeyboardEvent) => {
      if (event.code === 'KeyM') {
        // Check if user is typing
        const activeEl = document.activeElement;
        const isTyping = activeEl && (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true'
        );
        
        if (!isTyping) {
          console.log('ExperienceHotkeys - M key pressed, calling handleToggleShortcuts');
          event.preventDefault();
          handleToggleShortcuts();
        }
      }
    };

    window.addEventListener('keydown', handleMKey);
    return () => window.removeEventListener('keydown', handleMKey);
  }, [handleToggleShortcuts]);

  // Handle D key for drag toggle
  useEffect(() => {
    const handleDKey = (event: KeyboardEvent) => {
      if (event.code === 'KeyD' && onToggleDrag) {
        // Check if user is typing
        const activeEl = document.activeElement;
        const isTyping = activeEl && (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true'
        );
        
        if (!isTyping) {
          event.preventDefault();
          onToggleDrag();
        }
      }
    };

    window.addEventListener('keydown', handleDKey);
    return () => window.removeEventListener('keydown', handleDKey);
  }, [onToggleDrag]);
  
  // Handle all other hotkeys - only when dialogs are closed
  useExperienceHotkeys({
    callbacks: {
      toggleTheme,
      changeWorld,
      openSearch: () => setIsSearchOpen(true),
      goHome: handleGoHome,
      openHelp: () => setIsHelpOpen(true),
      toggleSettings: () => setIsSettingsOpen(o => !o),
      copyCode: handleCopyCode,
      toggleUi: () => setIsUiHidden(o => !o),
      toggleLock: toggleObjectLock,
      toggleShortcuts: handleToggleShortcuts
    },
    enabled: !isHelpOpen && !isSearchOpen && !isSettingsOpen,
  });

  return (
    <>
      <HelpDialog isOpen={isHelpOpen} onOpenChange={setIsHelpOpen} />
      <WorldSearchDialog
        isOpen={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        worlds={worlds}
        onSelectWorld={jumpToWorld}
      />
    </>
  );
};

export default ExperienceHotkeys;
