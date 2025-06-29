
import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SceneConfig } from "@/types/scene";
import { logEvent } from "@/lib/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import { SceneObjectsProvider } from "@/context/SceneObjectsContext";
import { toast } from "sonner";
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
  const [isObjectMoveMode, setIsObjectMoveMode] = useState(false);

  console.log('ExperienceUI rendering - isUiHidden:', isUiHidden, 'showUiHint:', showUiHint);

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

  const handleToggleObjectMoveMode = () => {
    const newState = !isObjectMoveMode;
    setIsObjectMoveMode(newState);
    
    if (newState) {
      toast.info('🎯 Object Move Mode Activated', {
        description: 'Long press or Ctrl+drag objects to move them',
        duration: 3000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          backdropFilter: 'blur(8px)',
        },
      });
    } else {
      toast.success('✅ Move Mode Deactivated', {
        description: 'Normal camera controls restored',
        duration: 2000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          backdropFilter: 'blur(8px)',
        },
      });
    }
    
    logEvent({ 
      eventType: 'button_click', 
      eventSource: 'toggle_object_move_mode', 
      metadata: { active: newState } 
    });
  };

  return (
    <TooltipProvider>
      <SceneObjectsProvider mainObjectColor={uiColor}>
        {isUiHidden ? (
          <HiddenUiView 
            onToggleUiHidden={handleToggleUiHidden}
            showUiHint={showUiHint}
            uiColor={uiColor}
            theme={theme}
          />
        ) : (
          <>
            {/* Top navigation bar */}
            <TopBar 
              worldName={worldName}
              uiColor={uiColor}
              onToggleUiHidden={handleToggleUiHidden}
              onToggleTheme={handleToggleTheme}
              theme={theme}
              onGoHome={handleGoHome}
              onShowHelp={handleShowHelp}
              isTransitioning={false}
              isMobile={isMobile}
              isSettingsOpen={isSettingsOpen}
            />
            
            {/* World navigation controls */}
            <NavigationControls 
              uiColor={uiColor}
              onChangeWorld={handleChangeWorld}
              isTransitioning={false}
              theme={theme}
            />

            {/* Bottom action bar */}
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
              theme={theme}
              onToggleObjectMoveMode={handleToggleObjectMoveMode}
              isObjectMoveMode={isObjectMoveMode}
            />

            {/* Keyboard hint for desktop */}
            {!isMobile && (
              <div 
                style={{ color: theme === 'day' ? '#000000' : uiColor }} 
                className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs animate-fade-in [animation-delay:0.5s] transition-opacity duration-300 pointer-events-none ${
                  isSettingsOpen ? 'z-10' : 'z-50'
                }`}
              >
                Press SPACE to change time of day
              </div>
            )}
          </>
        )}
      </SceneObjectsProvider>
    </TooltipProvider>
  );
};

export default ExperienceUI;
