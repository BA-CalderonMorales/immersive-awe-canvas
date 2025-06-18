
import { TooltipProvider } from "@/components/ui/tooltip";
import { SceneConfig } from "@/types/scene";
import { logEvent } from "@/lib/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import HiddenUiView from "./ui/HiddenUiView";
import TopBar from "./ui/TopBar";
import NavigationControls from "./ui/NavigationControls";
import BottomBar from "./ui/BottomBar";
import KeyboardShortcutsOverlay from "@/components/KeyboardShortcutsOverlay";

interface ExperienceUIProps {
  worldName: string;
  theme: 'day' | 'night';
  isTransitioning: boolean;
  editableSceneConfig: SceneConfig;
  uiColor: string;
  onToggleTheme: () => void;
  onChangeWorld: (direction: 'next' | 'prev') => void;
  onCopyCode: () => void;
  onUpdateSceneConfig: (newConfig: SceneConfig) => void;
  onShowHelp: () => void;
  onGoHome: () => void;
  onShowSearch: () => void;
  isSettingsOpen: boolean;
  onToggleSettings: (isOpen: boolean) => void;
  isUiHidden: boolean;
  onToggleUiHidden: () => void;
  showUiHint?: boolean;
  onToggleShortcuts?: () => void;
}

const ExperienceUI = ({
  worldName,
  theme,
  isTransitioning,
  editableSceneConfig,
  uiColor,
  onToggleTheme,
  onChangeWorld,
  onCopyCode,
  onUpdateSceneConfig,
  onShowHelp,
  onGoHome,
  onShowSearch,
  isSettingsOpen,
  onToggleSettings,
  isUiHidden,
  onToggleUiHidden,
  showUiHint = false,
  onToggleShortcuts,
}: ExperienceUIProps) => {
  const isMobile = useIsMobile();
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleToggleTheme = () => {
    onToggleTheme();
    logEvent({ eventType: 'button_click', eventSource: 'toggle_theme', metadata: { to_theme: theme === 'day' ? 'night' : 'day' } });
  };

  const handleGoHome = () => {
    onGoHome();
    logEvent({ eventType: 'button_click', eventSource: 'go_home' });
  };

  const handleChangeWorld = (direction: 'next' | 'prev') => {
    onChangeWorld(direction);
    logEvent({ eventType: 'button_click', eventSource: 'change_world', metadata: { direction } });
  };
  
  const handleShowSearch = () => {
    onShowSearch();
    logEvent({ eventType: 'button_click', eventSource: 'show_search' });
  };
  
  const handleShowHelp = () => {
    onShowHelp();
    logEvent({ eventType: 'button_click', eventSource: 'show_help' });
  };

  const handleToggleShortcuts = () => {
    setShowShortcuts(!showShortcuts);
  };

  if (isUiHidden) {
    return (
      <TooltipProvider>
        <HiddenUiView 
          onToggleUiHidden={onToggleUiHidden}
          showUiHint={showUiHint}
          uiColor={uiColor}
          theme={theme}
          onToggleShortcuts={onToggleShortcuts}
        />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <TopBar 
        worldName={worldName}
        uiColor={uiColor}
        onToggleUiHidden={onToggleUiHidden}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        onGoHome={handleGoHome}
        isTransitioning={isTransitioning}
      />
      
      <NavigationControls 
        uiColor={uiColor}
        onChangeWorld={handleChangeWorld}
        isTransitioning={isTransitioning}
      />

      <BottomBar 
        uiColor={uiColor}
        onCopyCode={onCopyCode}
        onShowSearch={handleShowSearch}
        isMobile={isMobile}
        isSettingsOpen={isSettingsOpen}
        onToggleSettings={onToggleSettings}
        editableSceneConfig={editableSceneConfig}
        onUpdateSceneConfig={onUpdateSceneConfig}
        onShowHelp={handleShowHelp}
      />

      {/* Keyboard Shortcuts Overlay - only on desktop/tablet */}
      <KeyboardShortcutsOverlay 
        theme={theme}
        isVisible={showShortcuts}
        onToggle={handleToggleShortcuts}
      />

      {!isMobile && (
        <div style={{ color: uiColor }} className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs animate-fade-in [animation-delay:0.5s] transition-opacity duration-300 pointer-events-none">
          Press SPACE to change time of day
        </div>
      )}
    </TooltipProvider>
  );
};

export default ExperienceUI;
