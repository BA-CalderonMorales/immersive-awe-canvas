import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SceneObjectsProvider } from "@/context/SceneObjectsContext";
import { useDeviceType } from "@/hooks/use-mobile";
import { logEvent } from "@/lib/logger";
import type { SceneConfig } from "@/types/scene";
import BottomBar from "./ui/BottomBar";
import HiddenUiView from "./ui/HiddenUiView";
import NavigationControls from "./ui/NavigationControls";
import TopBar from "./ui/TopBar";

interface ExperienceUIProps {
    worldName: string;
    theme: "day" | "night";
    isTransitioning: boolean;
    editableSceneConfig: SceneConfig;
    uiColor: string;
    onToggleTheme: () => void;
    onChangeBackground: (direction: "next" | "prev") => void;
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
    isDragEnabled?: boolean;
    onToggleDrag?: () => void;
}

const ExperienceUI = ({
    worldName,
    theme,
    isTransitioning,
    editableSceneConfig,
    uiColor,
    onToggleTheme,
    onChangeBackground,
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
    isDragEnabled: propIsDragEnabled = false,
    onToggleDrag: propOnToggleDrag,
}: ExperienceUIProps) => {
    const { isMobile } = useDeviceType();
    const [localIsDragEnabled, setLocalIsDragEnabled] = useState(false);

    // Use prop value if provided, otherwise use local state
    const isDragEnabled = propIsDragEnabled || localIsDragEnabled;

    // Event handlers with logging
    const handleToggleTheme = () => {
        onToggleTheme();
        logEvent({
            eventType: "button_click",
            eventSource: "toggle_theme",
            metadata: { to_theme: theme === "day" ? "night" : "day" },
        });
    };

    const handleGoHome = () => {
        onGoHome();
        logEvent({ eventType: "button_click", eventSource: "go_home" });
    };

    const _handleChangeBackground = (direction: "next" | "prev") => {
        onChangeBackground(direction);
        logEvent({
            eventType: "button_click",
            eventSource: "change_background",
            metadata: { direction },
        });
    };

    const handleShowSearch = () => {
        onShowSearch();
        logEvent({ eventType: "button_click", eventSource: "show_search" });
    };

    const handleShowHelp = () => {
        onShowHelp();
        logEvent({ eventType: "button_click", eventSource: "show_help" });
    };

    const handleToggleUiHidden = () => {
        onToggleUiHidden();
    };

    const handleToggleDrag = () => {
        if (propOnToggleDrag) {
            propOnToggleDrag();
            return;
        }
        setLocalIsDragEnabled(!localIsDragEnabled);
        logEvent({ eventType: "button_click", eventSource: "toggle_drag" });
    };

    return (
        <TooltipProvider>
            <SceneObjectsProvider
                mainObjectColor={uiColor}
                isDragEnabled={isDragEnabled}
            >
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

                        {/* Background navigation controls */}
                        <NavigationControls
                            uiColor={uiColor}
                            onChangeBackground={onChangeBackground}
                            isTransitioning={isTransitioning}
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
                            isDragEnabled={isDragEnabled}
                            onToggleDrag={handleToggleDrag}
                        />

                        {/* Keyboard hint for desktop */}
                        {!isMobile && (
                            <div
                                style={{
                                    color:
                                        theme === "day" ? "#000000" : uiColor,
                                }}
                                className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs animate-fade-in [animation-delay:0.5s] transition-opacity duration-300 pointer-events-none ${
                                    isSettingsOpen ? "z-10" : "z-50"
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
