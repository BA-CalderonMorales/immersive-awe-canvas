
import { TooltipProvider } from "@/components/ui/tooltip";
import { SceneConfig } from "@/types/scene";
import { logEvent } from "@/lib/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import HiddenUiView from "./HiddenUiView";
import TopBar from "./TopBar";
import NavigationControls from "./NavigationControls";
import BottomBar from "./BottomBar";

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
}: ExperienceUIProps) => {
  const isMobile = useIsMobile();

  console.log('ExperienceUI rendering - theme:', theme, 'uiColor:', uiColor, 'isUiHidden:', isUiHidden);

  // Ensure proper contrast colors - fallback to safe defaults if DB colors aren't working
  const safeUiColor = uiColor || (theme === 'day' ? '#000000' : '#FFFFFF');

  // Event handlers with logging
  const handleToggleTheme = () => {
    onToggleTheme();
    logEvent({ 
      eventType: 'button_click', 
      eventSource: 'toggle_theme', 
      metadata: { to_theme: theme === 'day' ? 'night' : 'day' } 
    });
  };

  const handleGoHome = () => {
    onGoHome();
    logEvent({ eventType: 'button_click', eventSource: 'go_home' });
  };

  const handleChangeWorld = (direction: 'next' | 'prev') => {
    onChangeWorld(direction);
    logEvent({ 
      eventType: 'button_click', 
      eventSource: 'change_world', 
      metadata: { direction } 
    });
  };
  
  const handleShowSearch = () => {
    onShowSearch();
    logEvent({ eventType: 'button_click', eventSource: 'show_search' });
  };
  
  const handleShowHelp = () => {
    onShowHelp();
    logEvent({ eventType: 'button_click', eventSource: 'show_help' });
  };

  const handleToggleUiHidden = () => {
    console.log('ExperienceUI - handleToggleUiHidden called');
    onToggleUiHidden();
  };

  const handleShowObjectControls = () => {
    console.log('Object controls button clicked');
    // For now, just log the action - actual implementation would open a panel
  };

  return (
    <TooltipProvider>
      {/* Always render HiddenUiView - it manages its own visibility */}
      <HiddenUiView 
        onToggleUiHidden={handleToggleUiHidden}
        showUiHint={showUiHint}
        uiColor={safeUiColor}
        theme={theme}
      />
      
      {/* Full UI - only show when UI is not hidden */}
      {!isUiHidden && (
        <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 100 }}>
          {/* Top navigation bar */}
          <TopBar 
            worldName={worldName}
            uiColor={safeUiColor}
            onToggleUiHidden={handleToggleUiHidden}
            onToggleTheme={handleToggleTheme}
            theme={theme}
            onGoHome={handleGoHome}
            onShowHelp={handleShowHelp}
            isTransitioning={false}
            isMobile={isMobile}
          />
          
          {/* World navigation controls */}
          <NavigationControls 
            uiColor={safeUiColor}
            onChangeWorld={handleChangeWorld}
            isTransitioning={false}
            theme={theme}
          />

          {/* Bottom action bar - ensure it's always visible */}
          <BottomBar 
            uiColor={safeUiColor}
            onCopyCode={onCopyCode}
            onShowSearch={handleShowSearch}
            isMobile={isMobile}
            isSettingsOpen={isSettingsOpen}
            onToggleSettings={onToggleSettings}
            editableSceneConfig={editableSceneConfig}
            onUpdateSceneConfig={onUpdateSceneConfig}
            onShowHelp={handleShowHelp}
            theme={theme}
            onShowObjectControls={handleShowObjectControls}
          />

          {/* Keyboard hint for desktop */}
          {!isMobile && (
            <div 
              style={{ 
                color: safeUiColor,
                zIndex: 50
              }} 
              className="fixed bottom-16 left-1/2 -translate-x-1/2 text-xs animate-fade-in [animation-delay:0.5s] transition-opacity duration-300 pointer-events-none"
            >
              Press SPACE to change time of day
            </div>
          )}
        </div>
      )}
    </TooltipProvider>
  );
};

export default ExperienceUI;
