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
        // Check if user is typing - early return pattern
        const activeEl = document.activeElement;
        const isTyping = activeEl && (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true'
        );
        
        if (isTyping) return;
        
        event.preventDefault();
        handleToggleShortcuts();
      }
    };

    window.addEventListener('keydown', handleMKey);
    return () => window.removeEventListener('keydown', handleMKey);
  }, [handleToggleShortcuts]);

  // Handle Z key for drag toggle
  useEffect(() => {
    const handleZKey = (event: KeyboardEvent) => {
      if (event.code === 'KeyZ' && onToggleDrag) {
        // Check if user is typing - early return pattern
        const activeEl = document.activeElement;
        const isTyping = activeEl && (
          activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true'
        );
        
        if (isTyping || isHelpOpen || isSearchOpen || isSettingsOpen) return;
        
        event.preventDefault();
        onToggleDrag();
      }
    };

    window.addEventListener('keydown', handleZKey);
    return () => window.removeEventListener('keydown', handleZKey);
  }, [onToggleDrag, isHelpOpen, isSearchOpen, isSettingsOpen]);
  
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