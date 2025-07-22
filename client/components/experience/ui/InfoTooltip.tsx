import { Info } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface InstructionSet {
    primary: string;
    secondary: string;
    tertiary: string;
    welcome?: string;
}

interface InfoTooltipProps {
    uiStyle: { color: string; borderColor: string };
    blendedButtonClasses: string;
    showOnboardingPulse: boolean;
    isInfoTooltipOpen: boolean;
    setIsInfoTooltipOpen: (open: boolean) => void;
    setShowOnboardingPulse: (show: boolean) => void;
    isMobile: boolean;
    instructions: InstructionSet;
    theme: "day" | "night";
}

const InfoTooltip = ({
    uiStyle,
    blendedButtonClasses,
    showOnboardingPulse,
    isInfoTooltipOpen,
    setIsInfoTooltipOpen,
    setShowOnboardingPulse,
    isMobile,
    instructions,
    theme,
}: InfoTooltipProps) => {
    const [isStable, setIsStable] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    const getTooltipClasses = () => {
        const baseClasses = "max-w-xs p-4 rounded-lg shadow-xl border z-50";
        const themeClasses =
            theme === "day"
                ? "bg-white text-gray-900 border-gray-200"
                : "bg-gray-900 text-gray-100 border-gray-700";
        return `${baseClasses} ${themeClasses}`;
    };

    const getIndicatorColor = () =>
        theme === "day" ? "bg-blue-500" : "bg-blue-400";

    // Stabilize the component after mount to prevent flickering
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsStable(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const handleInfoClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();

            if (setShowOnboardingPulse) {
                setShowOnboardingPulse(false);
            }

            if (isMobile && setIsInfoTooltipOpen) {
                setIsInfoTooltipOpen(!isInfoTooltipOpen);
            }
        },
        [
            isMobile,
            isInfoTooltipOpen,
            setIsInfoTooltipOpen,
            setShowOnboardingPulse,
        ]
    );

    // Clear any pending timeouts on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    if (!isStable) {
        return (
            <Button
                style={uiStyle}
                className={`${blendedButtonClasses} flex-shrink-0`}
                size="icon"
                aria-label="Information and Controls"
            >
                <Info className="w-4 h-4" />
            </Button>
        );
    }

    return (
        <Tooltip
            open={isMobile ? isInfoTooltipOpen : undefined}
            delayDuration={200}
        >
            <TooltipTrigger asChild>
                <Button
                    style={uiStyle}
                    onClick={handleInfoClick}
                    className={`${blendedButtonClasses} transition-all duration-300 ${
                        showOnboardingPulse
                            ? "animate-pulse ring-2 ring-blue-400/50"
                            : ""
                    } flex-shrink-0`}
                    size="icon"
                    aria-label="Information and Controls"
                >
                    <Info className="w-4 h-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent
                side="bottom"
                className={getTooltipClasses()}
                sideOffset={8}
                avoidCollisions={true}
            >
                <div className="space-y-3">
                    {instructions.welcome && (
                        <div className="flex items-start gap-3 pb-3 border-b border-gray-200/30 dark:border-gray-700/30">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getIndicatorColor()}`}
                            />
                            <p className="text-sm font-semibold leading-relaxed">
                                {instructions.welcome}
                            </p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <div className="flex items-start gap-3">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getIndicatorColor()}`}
                            />
                            <p className="text-sm leading-relaxed">
                                {instructions.primary}
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getIndicatorColor()}`}
                            />
                            <p className="text-sm leading-relaxed">
                                {instructions.secondary}
                            </p>
                        </div>

                        <div className="flex items-start gap-3">
                            <div
                                className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getIndicatorColor()}`}
                            />
                            <p className="text-sm leading-relaxed">
                                {instructions.tertiary}
                            </p>
                        </div>
                    </div>
                </div>
            </TooltipContent>
        </Tooltip>
    );
};

export default InfoTooltip;
