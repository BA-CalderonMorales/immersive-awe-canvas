
import { useExperienceHotkeys } from "@/hooks/useExperienceHotkeys";
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
}: ExperienceHotkeysProps) => {
  
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
