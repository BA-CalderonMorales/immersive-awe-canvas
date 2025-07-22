import { useEffect } from "react";
import { useHotkeyActions } from "./useHotkeyActions";
import { useKeyboardEventHandler } from "./useKeyboardEventHandler";

interface HotkeyCallbacks {
    toggleTheme: () => void;
    changeWorld: (direction: "next" | "prev") => void;
    changeGeometry: (direction: "next" | "prev") => void;
    openSearch: () => void;
    goHome: () => void;
    openHelp: () => void;
    toggleSettings: () => void;
    copyCode: () => void;
    toggleUi: () => void;
    toggleLock: () => void;
    toggleShortcuts: () => void;
}

interface useExperienceHotkeysProps {
    callbacks: HotkeyCallbacks;
    enabled: boolean;
}

export const useExperienceHotkeys = ({
    callbacks,
    enabled,
}: useExperienceHotkeysProps) => {
    const actions = useHotkeyActions(callbacks);
    const { handleKeyDown } = useKeyboardEventHandler({
        onToggleTheme: actions.handleToggleTheme,
        onChangeWorld: actions.changeWorld,
        onChangeGeometry: actions.changeGeometry,
        onOpenSearch: actions.openSearch,
        onGoHome: actions.goHome,
        onOpenHelp: actions.handleOpenHelp,
        onToggleSettings: actions.handleToggleSettings,
        onCopyCode: actions.copyCode,
        onToggleUi: actions.toggleUi,
        onToggleLock: actions.handleToggleLock,
        onToggleShortcuts: actions.handleToggleShortcuts,
        enabled,
    });

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleKeyDown]);
};
