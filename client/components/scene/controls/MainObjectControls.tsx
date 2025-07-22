import { useEffect, useRef } from "react";
import { SceneConfig } from "@/types/scene";
import { useExperience } from "@/hooks/useExperience";
import { useGuiControlsViewModel } from "./GuiControlsViewModel";

interface MainObjectControlsProps {
    sceneConfig: SceneConfig;
    onUpdate: (config: SceneConfig) => void;
}

const MainObjectControls = ({
    sceneConfig,
    onUpdate,
}: MainObjectControlsProps) => {
    const guiContainerRef = useRef<HTMLDivElement>(null);
    const { theme } = useExperience();
    const { initialize, updateFromExternalChanges, cleanup } =
        useGuiControlsViewModel(guiContainerRef, "Main Object Properties");

    // Initialize GUI when component mounts or dependencies change
    useEffect(() => {
        initialize(sceneConfig, theme, onUpdate);

        return () => {
            cleanup();
        };
    }, [initialize, cleanup, sceneConfig, theme, onUpdate]);

    // Update GUI when external changes occur
    useEffect(() => {
        updateFromExternalChanges(sceneConfig, theme);
    }, [updateFromExternalChanges, sceneConfig, theme]);

    return (
        <div
            ref={guiContainerRef}
            className="w-full min-h-0 [&_.lil-gui]:static [&_.lil-gui]:max-w-none [&_.lil-gui]:w-full [&_.lil-gui]:bg-transparent [&_.lil-gui]:border-0 [&_.lil-gui]:shadow-none [&_.lil-gui_.controller]:min-h-[28px]"
        />
    );
};

export default MainObjectControls;
