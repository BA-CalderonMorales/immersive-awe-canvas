
import { TooltipProvider } from "@/components/ui/tooltip";
import { SceneConfig } from "@/types/scene";
import { logEvent } from "@/lib/logger";
import { useIsMobile } from "@/hooks/use-mobile";
import HiddenUiView from "./ui/HiddenUiView";
import TopBar from "./ui/TopBar";
import NavigationControls from "./ui/NavigationControls";
import BottomBar from "./ui/BottomBar";
import { useEffect, useState, useRef, useMemo } from "react";

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
  const [isComponentsMounted, setIsComponentsMounted] = useState(false);
  const [forceRenderKey, setForceRenderKey] = useState(0);
  const mountedRef = useRef(true);

  // UI Persistence System Block
  useEffect(() => {
    // Ensure components are properly mounted and persistent
    const mountTimer = setTimeout(() => {
      if (mountedRef.current) {
        setIsComponentsMounted(true);
        setForceRenderKey(prev => prev + 1);
      }
    }, 100);

    // Secondary render cycle for extra reliability
    const persistenceTimer = setTimeout(() => {
      if (mountedRef.current) {
        setForceRenderKey(prev => prev + 1);
      }
    }, 300);
    
    return () => {
      clearTimeout(mountTimer);
      clearTimeout(persistenceTimer);
    };
  }, [worldName, theme, editableSceneConfig]);

  // Component Cleanup Block
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Event Handler Block - Centralized event management
  const eventHandlers = useMemo(() => ({
    handleToggleTheme: () => {
      onToggleTheme();
      logEvent({ 
        eventType: 'button_click', 
        eventSource: 'toggle_theme', 
        metadata: { to_theme: theme === 'day' ? 'night' : 'day' } 
      });
    },

    handleGoHome: () => {
      onGoHome();
      logEvent({ eventType: 'button_click', eventSource: 'go_home' });
    },

    handleChangeWorld: (direction: 'next' | 'prev') => {
      onChangeWorld(direction);
      logEvent({ 
        eventType: 'button_click', 
        eventSource: 'change_world', 
        metadata: { direction } 
      });
    },
    
    handleShowSearch: () => {
      onShowSearch();
      logEvent({ eventType: 'button_click', eventSource: 'show_search' });
    },
    
    handleShowHelp: () => {
      onShowHelp();
      logEvent({ eventType: 'button_click', eventSource: 'show_help' });
    }
  }), [onToggleTheme, onGoHome, onChangeWorld, onShowSearch, onShowHelp, theme]);

  // Hidden UI State Rendering Block
  if (isUiHidden) {
    return (
      <TooltipProvider>
        <HiddenUiView 
          onToggleUiHidden={onToggleUiHidden}
          showUiHint={showUiHint}
          uiColor={uiColor}
          theme={theme}
        />
      </TooltipProvider>
    );
  }

  // Main UI Rendering Block
  return (
    <TooltipProvider>
      {/* Top Navigation Bar - Always Persistent */}
      <div key={`top-bar-${forceRenderKey}`}>
        <TopBar 
          worldName={worldName}
          uiColor={uiColor}
          onToggleUiHidden={onToggleUiHidden}
          onToggleTheme={eventHandlers.handleToggleTheme}
          theme={theme}
          onGoHome={eventHandlers.handleGoHome}
          onShowHelp={eventHandlers.handleShowHelp}
          isTransitioning={isTransitioning}
          isMobile={isMobile}
        />
      </div>
      
      {/* World Navigation System - Always Persistent */}
      <div key={`navigation-${forceRenderKey}`}>
        <NavigationControls 
          uiColor={uiColor}
          onChangeWorld={eventHandlers.handleChangeWorld}
          isTransitioning={isTransitioning}
          theme={theme}
        />
      </div>

      {/* Bottom Action Bar - Enhanced Persistence System */}
      <div key={`bottom-bar-${forceRenderKey}-${isComponentsMounted}`}>
        <BottomBar 
          uiColor={uiColor}
          onCopyCode={onCopyCode}
          onShowSearch={eventHandlers.handleShowSearch}
          isMobile={isMobile}
          isSettingsOpen={isSettingsOpen}
          onToggleSettings={onToggleSettings}
          editableSceneConfig={editableSceneConfig}
          onUpdateSceneConfig={onUpdateSceneConfig}
          onShowHelp={eventHandlers.handleShowHelp}
          theme={theme}
        />
      </div>

      {/* Desktop Interaction Hint Block */}
      {!isMobile && (
        <div 
          style={{ color: theme === 'day' ? '#000000' : uiColor }} 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs animate-fade-in [animation-delay:0.5s] transition-opacity duration-300 pointer-events-none"
        >
          Press SPACE to change time of day
        </div>
      )}
    </TooltipProvider>
  );
};

export default ExperienceUI;
