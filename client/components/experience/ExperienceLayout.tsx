import { SceneObjectsProvider } from "@/context/SceneObjectsContext";
import { useExperience } from "@/hooks/useExperience";
import type { SceneConfig } from "@/types/scene";
import DynamicScene from "../scene/DynamicScene";
import ThemedSettingsPanel from "./ThemedSettingsPanel";

interface ExperienceLayoutProps {
    editableSceneConfig: SceneConfig;
    isTransitioning: boolean;
    currentWorldIndex: number;
    isObjectLocked: boolean;
    onToggleObjectLock: () => void;
    isSettingsOpen: boolean;
    isMobile: boolean;
    onUpdateSceneConfig: (config: SceneConfig) => void;
    isDragEnabled: boolean;
    isMotionFrozen?: boolean;
    onToggleMotion?: () => void;
    currentBackground?: { type: string; [key: string]: unknown };
    currentGeometry?: { type: string; [key: string]: unknown };
    uiColor?: string;
    onCloseSettings?: () => void;
}

const ExperienceLayout = ({
    editableSceneConfig,
    isTransitioning: _isTransitioning,
    currentWorldIndex: _currentWorldIndex,
    isObjectLocked: _isObjectLocked,
    onToggleObjectLock: _onToggleObjectLock,
    isSettingsOpen,
    isMobile,
    onUpdateSceneConfig,
    isDragEnabled,
    isMotionFrozen,
    onToggleMotion,
    currentBackground,
    currentGeometry,
    uiColor = "#ffffff",
    onCloseSettings,
}: ExperienceLayoutProps) => {
    const { theme } = useExperience();
    const themeConfig = editableSceneConfig[theme];
    const mainObjectColor = themeConfig?.mainObjectColor || "#ffffff";

    if (isMobile) {
        return (
            <SceneObjectsProvider
                mainObjectColor={mainObjectColor}
                isDragEnabled={isDragEnabled}
            >
                <div
                    className="w-full h-full"
                    style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                    }}
                >
                    <DynamicScene
                        currentBackground={currentBackground}
                        currentGeometry={currentGeometry}
                        editableSceneConfig={editableSceneConfig}
                        theme={theme}
                        isLocked={_isObjectLocked}
                    />
                </div>
            </SceneObjectsProvider>
        );
    }

    return (
        <SceneObjectsProvider
            mainObjectColor={mainObjectColor}
            isDragEnabled={isDragEnabled}
        >
            <div
                className="w-full h-full flex"
                style={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                }}
            >
                {/* Main Scene */}
                <div className="flex-1 relative overflow-hidden">
                    <DynamicScene
                        currentBackground={currentBackground}
                        currentGeometry={currentGeometry}
                        editableSceneConfig={editableSceneConfig}
                        theme={theme}
                        isLocked={_isObjectLocked}
                        isDragEnabled={isDragEnabled}
                        isMotionFrozen={isMotionFrozen}
                    />
                </div>

                {/* Settings Panel - High z-index to appear above UI buttons */}
                {isSettingsOpen && (
                    <div className="relative z-50">
                        <ThemedSettingsPanel
                            sceneConfig={editableSceneConfig}
                            onUpdate={onUpdateSceneConfig}
                            onClose={onCloseSettings}
                            uiColor={uiColor}
                        />
                    </div>
                )}
            </div>
        </SceneObjectsProvider>
    );
};

export default ExperienceLayout;
