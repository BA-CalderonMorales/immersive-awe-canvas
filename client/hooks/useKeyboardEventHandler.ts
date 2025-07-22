import { useCallback } from "react";
import { isUserTyping } from "@/lib/keyboardUtils";

interface KeyboardEventHandlerProps {
    onToggleTheme: () => void;
    onChangeWorld: (direction: "next" | "prev") => void;
    onChangeGeometry: (direction: "next" | "prev") => void;
    onOpenSearch: () => void;
    onGoHome: () => void;
    onOpenHelp: () => void;
    onToggleSettings: () => void;
    onCopyCode: () => void;
    onToggleUi: () => void;
    onToggleLock: () => void;
    onToggleShortcuts: () => void;
    enabled: boolean;
}

export const useKeyboardEventHandler = ({
    onToggleTheme,
    onChangeWorld,
    onChangeGeometry,
    onOpenSearch,
    onGoHome,
    onOpenHelp,
    onToggleSettings,
    onCopyCode,
    onToggleUi,
    onToggleLock,
    onToggleShortcuts,
    enabled,
}: KeyboardEventHandlerProps) => {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            console.log(
                "KeyboardEventHandler - Key pressed:",
                event.code,
                "enabled:",
                enabled
            );

            if (!enabled) {
                console.log("KeyboardEventHandler - Handler disabled");
                return;
            }

            const typing = isUserTyping();
            console.log("KeyboardEventHandler - User typing:", typing);

            // Skip M key - it's handled separately in ExperienceHotkeys
            if (event.code === "KeyM") {
                console.log(
                    "KeyboardEventHandler - M key skipped (handled separately)"
                );
                return;
            }

            switch (event.code) {
                case "Space":
                    event.preventDefault();
                    onToggleTheme();
                    break;

                case "KeyN":
                    if (!typing) {
                        event.preventDefault();
                        onChangeWorld("next");
                    }
                    break;

                case "KeyP":
                    if (!typing) {
                        event.preventDefault();
                        onChangeWorld("prev");
                    }
                    break;

                case "KeyK":
                    if ((event.ctrlKey || event.metaKey) && !typing) {
                        event.preventDefault();
                        onOpenSearch();
                    }
                    break;

                case "KeyG":
                    if (!typing) {
                        event.preventDefault();
                        onGoHome();
                    }
                    break;

                case "KeyO":
                    if (!typing) {
                        event.preventDefault();
                        if (event.shiftKey) {
                            onChangeGeometry("prev");
                        } else {
                            onChangeGeometry("next");
                        }
                    }
                    break;

                case "KeyS":
                    if (!typing) {
                        event.preventDefault();
                        onOpenSearch();
                    }
                    break;

                case "KeyH":
                    if (!typing) {
                        event.preventDefault();
                        onOpenHelp();
                    }
                    break;

                case "Escape":
                    if (!typing) {
                        event.preventDefault();
                        onToggleSettings();
                    }
                    break;

                case "KeyC":
                    if (!typing) {
                        event.preventDefault();
                        onCopyCode();
                    }
                    break;

                case "KeyV":
                    if (!typing) {
                        event.preventDefault();
                        onToggleUi();
                    }
                    break;

                case "Period":
                    if (!typing) {
                        event.preventDefault();
                        onToggleLock();
                    }
                    break;
            }
        },
        [
            enabled,
            onToggleTheme,
            onChangeWorld,
            onChangeGeometry,
            onOpenSearch,
            onGoHome,
            onOpenHelp,
            onToggleSettings,
            onCopyCode,
            onToggleUi,
            onToggleLock,
            onToggleShortcuts,
        ]
    );

    return { handleKeyDown };
};
