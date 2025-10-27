import { Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useInstructions } from "@/hooks/useInstructions";
import GlassButton from "./GlassButton";
import InfoTooltip from "./InfoTooltip";
import TopBarActions from "./TopBarActions";

interface TopBarProps {
    worldName: string;
    uiColor: string;
    onToggleUiHidden: () => void;
    onToggleTheme: () => void;
    theme: "day" | "night";
    onGoHome: () => void;
    isTransitioning: boolean;
    isMobile: boolean;
    onShowHelp: () => void;
    isSettingsOpen?: boolean;
}

const TopBar = ({
    worldName,
    uiColor,
    onToggleUiHidden,
    onToggleTheme,
    theme,
    onGoHome,
    isTransitioning,
    isMobile,
    onShowHelp,
    isSettingsOpen = false,
}: TopBarProps) => {
    // Improved button classes with better contrast
    const blendedButtonClasses =
        theme === "day"
            ? "border border-gray-300 bg-white/90 hover:bg-white text-gray-900 backdrop-blur-sm shadow-lg"
            : "border bg-black/70 hover:bg-black/90 text-white backdrop-blur-sm shadow-lg";

    // Use scene-specific UI colors for border only
    const uiStyle = { borderColor: uiColor };

    // For light theme, use dark text; for dark theme, use the ui color
    const textStyle =
        theme === "day" ? { color: "#1f2937" } : { color: uiColor };

    // Simple state management - always show buttons
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
    const [showOnboardingPulse, setShowOnboardingPulse] = useState(false);

    const instructions = useInstructions(isFirstVisit, isMobile);

    // Check for first visit
    useEffect(() => {
        const hasVisited = localStorage.getItem("hasVisitedExperience");
        if (!hasVisited) {
            setIsFirstVisit(true);
            localStorage.setItem("hasVisitedExperience", "true");

            // Show onboarding pulse after a short delay
            setTimeout(() => {
                setShowOnboardingPulse(true);

                // Hide pulse after 5 seconds
                setTimeout(() => {
                    setShowOnboardingPulse(false);
                }, 5000);
            }, 2000);
        }
    }, []);

    const buttonStyle = { ...uiStyle, ...textStyle };

    return (
        <div
            style={textStyle}
            className={`absolute top-0 left-0 w-full p-4 sm:p-5 md:p-6 pointer-events-none flex justify-between items-start transition-opacity duration-300 ${
                isTransitioning ? "opacity-0" : "opacity-100"
            } ${isSettingsOpen ? "z-10" : "z-50"}`}
        >
            {/* Left side: Home and Info buttons grouped together */}
            <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
                <GlassButton
                    icon={Home}
                    label="Go Home"
                    shortcut="G"
                    onClick={onGoHome}
                    theme={theme}
                    uiColor={uiColor}
                />

                <InfoTooltip
                    uiStyle={buttonStyle}
                    blendedButtonClasses={blendedButtonClasses}
                    showOnboardingPulse={showOnboardingPulse}
                    isInfoTooltipOpen={isInfoTooltipOpen}
                    setIsInfoTooltipOpen={setIsInfoTooltipOpen}
                    setShowOnboardingPulse={setShowOnboardingPulse}
                    isMobile={isMobile}
                    instructions={instructions}
                    theme={theme}
                />
            </div>

            {/* Center/Right side: World title - minimal treatment */}
            <div className="flex-1 flex justify-center sm:justify-end items-center min-w-0 mx-4 pointer-events-none">
                <h2
                    className={`text-sm sm:text-base md:text-lg font-semibold tracking-tight h-6 sm:h-8 flex items-center truncate transition-colors duration-200 ${
                        theme === "day" ? "text-black/[0.9]" : "text-white/[0.95]"
                    }`}
                >
                    {worldName}
                </h2>
            </div>

            <TopBarActions
                uiColor={uiColor}
                theme={theme}
                onToggleUiHidden={onToggleUiHidden}
                onToggleTheme={onToggleTheme}
            />
        </div>
    );
};

export default TopBar;
