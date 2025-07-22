import { motion, AnimatePresence } from "framer-motion";
import { isSceneConfig } from "@/lib/typeguards";
import type { SceneConfig, BackgroundConfig } from "@/types";
import ExperienceTransitions from "./ExperienceTransitions";
import ExperienceLayout from "./ExperienceLayout";
import ExperienceUI from "./ExperienceUI";
import ExperienceHotkeys from "./ExperienceHotkeys";
import LoadingOverlay from "./LoadingOverlay";

interface ExperienceContainerContentProps {
    worldData: { slug: string; [key: string]: unknown } | null;
    editableSceneConfig: SceneConfig;
    isTransitioning: boolean;
    currentWorldIndex: number;
    isObjectLocked: boolean;
    theme: "day" | "night";
    worlds: { id: number; slug: string; [key: string]: unknown }[];
    // UI state
    isSettingsOpen: boolean;
    isUiHidden: boolean;
    showUiHint: boolean;
    isHelpOpen: boolean;
    isSearchOpen: boolean;
    // Transition state
    showEntryTransition: boolean;
    showWorldTransition: boolean;
    // Callbacks
    toggleObjectLock: () => void;
    toggleTheme: () => void;
    setEditableSceneConfig: (config: SceneConfig) => void;
    setIsHelpOpen: (open: boolean) => void;
    setIsSearchOpen: (open: boolean) => void;
    setIsSettingsOpen: (open: boolean) => void;
    setIsUiHidden: (hidden: boolean | ((prev: boolean) => boolean)) => void;
    handleChangeBackground: (direction: "next" | "prev") => void;
    handleChangeGeometry: (direction: "next" | "prev") => void;
    handleJumpToWorld: (index: number) => void;
    handleCopyCode: () => void;
    handleGoHome: () => void;
    handleToggleShortcuts: () => void;
    handleEntryTransitionEndWithHint: () => void;
    handleWorldTransitionEnd: () => void;
    isMobile: boolean;
    isDragEnabled: boolean;
    onToggleDrag: () => void;
    isMotionFrozen?: boolean;
    onToggleMotion?: () => void;
    currentBackground?: BackgroundConfig;
    currentGeometry?: { type: string; [key: string]: unknown };
}

const ExperienceContainerContent = ({
    worldData,
    editableSceneConfig,
    isTransitioning,
    currentWorldIndex,
    isObjectLocked,
    theme,
    worlds,
    isSettingsOpen,
    isUiHidden,
    showUiHint,
    isHelpOpen,
    isSearchOpen,
    showEntryTransition,
    showWorldTransition,
    toggleObjectLock,
    toggleTheme,
    setEditableSceneConfig,
    setIsHelpOpen,
    setIsSearchOpen,
    setIsSettingsOpen,
    setIsUiHidden,
    handleChangeBackground,
    handleChangeGeometry,
    handleJumpToWorld,
    handleCopyCode,
    handleGoHome,
    handleToggleShortcuts,
    handleEntryTransitionEndWithHint,
    handleWorldTransitionEnd,
    isMobile,
    isDragEnabled,
    onToggleDrag,
    isMotionFrozen,
    onToggleMotion,
    currentBackground,
    currentGeometry,
}: ExperienceContainerContentProps) => {
    // Direct UI color calculation
    const uiColor = worldData
        ? theme === "day"
            ? (worldData.ui_day_color as string) || "white"
            : (worldData.ui_night_color as string) || "white"
        : "white";

    if (!worldData) {
        return <LoadingOverlay message="Discovering worlds..." theme={theme} />;
    }

    if (!editableSceneConfig) {
        return (
            <LoadingOverlay
                message="Initializing experience..."
                theme={theme}
            />
        );
    }

    // Remove scene config validation since we're using dynamic backgrounds now

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={worldData.slug}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{
                    duration: 0.8,
                    ease: [0.25, 0.8, 0.25, 1],
                }}
                className="absolute inset-0 w-full h-full"
            >
                <ExperienceTransitions
                    showEntryTransition={showEntryTransition}
                    showWorldTransition={showWorldTransition}
                    showBlurTransition={isTransitioning && !showEntryTransition}
                    theme={theme}
                    onEntryTransitionEnd={handleEntryTransitionEndWithHint}
                    onWorldTransitionEnd={handleWorldTransitionEnd}
                    onBlurTransitionEnd={() => {}}
                />

                <ExperienceLayout
                    editableSceneConfig={editableSceneConfig}
                    isTransitioning={isTransitioning}
                    currentWorldIndex={currentWorldIndex}
                    isObjectLocked={isObjectLocked}
                    onToggleObjectLock={toggleObjectLock}
                    isSettingsOpen={isSettingsOpen}
                    isMobile={isMobile}
                    onUpdateSceneConfig={setEditableSceneConfig}
                    isDragEnabled={isDragEnabled}
                    isMotionFrozen={isMotionFrozen}
                    onToggleMotion={onToggleMotion}
                    currentBackground={currentBackground}
                    currentGeometry={currentGeometry}
                />

                <ExperienceUI
                    worldName={worldData.name as string}
                    theme={theme}
                    isTransitioning={isTransitioning}
                    editableSceneConfig={editableSceneConfig}
                    onToggleTheme={toggleTheme}
                    onChangeBackground={handleChangeBackground}
                    onCopyCode={handleCopyCode}
                    onUpdateSceneConfig={setEditableSceneConfig}
                    onShowHelp={() => setIsHelpOpen(true)}
                    onGoHome={handleGoHome}
                    onShowSearch={() => setIsSearchOpen(true)}
                    uiColor={uiColor}
                    isSettingsOpen={isSettingsOpen}
                    onToggleSettings={setIsSettingsOpen}
                    isUiHidden={isUiHidden}
                    onToggleUiHidden={() => setIsUiHidden(h => !h)}
                    showUiHint={showUiHint}
                    isDragEnabled={isDragEnabled}
                    onToggleDrag={onToggleDrag}
                />

                <ExperienceHotkeys
                    toggleTheme={toggleTheme}
                    changeBackground={handleChangeBackground}
                    changeGeometry={handleChangeGeometry}
                    handleGoHome={handleGoHome}
                    handleCopyCode={handleCopyCode}
                    toggleObjectLock={toggleObjectLock}
                    handleToggleShortcuts={handleToggleShortcuts}
                    setIsSearchOpen={setIsSearchOpen}
                    setIsHelpOpen={setIsHelpOpen}
                    setIsSettingsOpen={setIsSettingsOpen}
                    setIsUiHidden={setIsUiHidden}
                    isHelpOpen={isHelpOpen}
                    isSearchOpen={isSearchOpen}
                    isSettingsOpen={isSettingsOpen}
                    worlds={worlds}
                    jumpToWorld={handleJumpToWorld}
                    onToggleDrag={onToggleDrag}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default ExperienceContainerContent;
