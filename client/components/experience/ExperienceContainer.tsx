import { useIsMobile } from "@/hooks/use-mobile";
import ExperienceContainerContent from "./ExperienceContainerContent";
import { SceneConfig } from "@/types/scene";

interface ExperienceContainerProps {
    worldData: any;
    editableSceneConfig: SceneConfig;
    isTransitioning: boolean;
    currentWorldIndex: number;
    isObjectLocked: boolean;
    theme: "day" | "night";
    worlds: any[];
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
    isDragEnabled: boolean;
    onToggleDrag: () => void;
    isMotionFrozen?: boolean;
    onToggleMotion?: () => void;
    currentBackground?: any;
    currentGeometry?: any;
    onJumpToBackground?: (index: number) => void;
    onJumpToGeometry?: (index: number) => void;
}

const ExperienceContainer = (props: ExperienceContainerProps) => {
    const isMobile = useIsMobile();

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black">
            <ExperienceContainerContent {...props} isMobile={isMobile} />
        </div>
    );
};

export default ExperienceContainer;
