import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect, useMemo, useRef } from "react";

interface InfoButtonProps {
    theme: "day" | "night";
    uiColor: string;
    blendedButtonClasses: string;
    isFirstVisit?: boolean;
    onFirstInteraction?: () => void;
}

interface InstructionSet {
    primary: string;
    secondary: string;
    tertiary: string;
    welcome?: string;
}

const InfoButton = ({
    theme,
    uiColor,
    blendedButtonClasses,
    isFirstVisit = false,
    onFirstInteraction,
}: InfoButtonProps) => {
    const isMobile = useIsMobile();
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [showOnboardingPulse, setShowOnboardingPulse] = useState(false);
    const [isStable, setIsStable] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();
    const hasInteracted = useRef(false);

    // Stabilize the component after mount to prevent flickering
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsStable(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    // Memoize instructions to prevent unnecessary recalculations
    const instructions = useMemo((): InstructionSet => {
        const baseInstructions = {
            primary: isMobile
                ? "Drag to look around, pinch to zoom"
                : "Click and drag to explore, scroll to zoom",
            secondary: isMobile
                ? "Use navigation arrows to discover new worlds"
                : "Press N/P or use arrows to travel between worlds",
            tertiary: isMobile
                ? "Tap the theme button to switch day/night"
                : "Press Space or theme button to toggle day/night",
        };

        if (isFirstVisit) {
            return {
                ...baseInstructions,
                welcome: "Welcome to your journey through immersive worlds!",
            };
        }

        return baseInstructions;
    }, [isFirstVisit, isMobile]);

    // Show onboarding pulse with stable timing
    useEffect(() => {
        if (isFirstVisit && isStable && !hasInteracted.current) {
            const timer = setTimeout(() => {
                setShowOnboardingPulse(true);

                const hideTimer = setTimeout(() => {
                    setShowOnboardingPulse(false);
                }, 8000); // Show longer for first visit

                timeoutRef.current = hideTimer;
            }, 3500); // Delay to let onboarding hints show first

            return () => {
                clearTimeout(timer);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            };
        }
    }, [isFirstVisit, isStable]);

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();

        // Handle first interaction
        if (isFirstVisit && !hasInteracted.current) {
            hasInteracted.current = true;
            onFirstInteraction?.();
        }

        setShowOnboardingPulse(false);

        if (isMobile) {
            setIsTooltipOpen(!isTooltipOpen);
        }
    };

    if (!isStable) {
        return (
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-20 pointer-events-auto">
                <Button
                    style={{ color: uiColor }}
                    className={`${blendedButtonClasses} ${
                        isMobile ? "w-12 h-12" : "w-10 h-10"
                    }`}
                    size="icon"
                    aria-label="Information and Controls"
                >
                    <Info className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`} />
                </Button>
            </div>
        );
    }

    return (
        <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 z-20 pointer-events-auto">
            <TooltipProvider>
                <Tooltip
                    open={isMobile ? isTooltipOpen : undefined}
                    delayDuration={200}
                >
                    <TooltipTrigger asChild>
                        <Button
                            style={{ color: uiColor }}
                            onClick={handleClick}
                            className={`${blendedButtonClasses} transition-all duration-300 ${
                                showOnboardingPulse
                                    ? "animate-pulse ring-2 ring-blue-400/50"
                                    : ""
                            } ${
                                isMobile
                                    ? "w-12 h-12 active:scale-95"
                                    : "w-10 h-10 hover:scale-105"
                            }`}
                            size="icon"
                            aria-label="Information and Controls"
                        >
                            <Info
                                className={`${isMobile ? "w-5 h-5" : "w-4 h-4"}`}
                            />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side="right"
                        className={`max-w-xs p-4 rounded-lg shadow-xl border ${
                            theme === "day"
                                ? "bg-white text-gray-900 border-gray-200"
                                : "bg-gray-900 text-gray-100 border-gray-700"
                        } z-50`}
                        sideOffset={8}
                        avoidCollisions={true}
                    >
                        <div className="space-y-3">
                            {instructions.welcome && (
                                <div className="flex items-start gap-3 pb-3 border-b border-gray-200/30 dark:border-gray-700/30">
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                            theme === "day"
                                                ? "bg-blue-500"
                                                : "bg-blue-400"
                                        }`}
                                    />
                                    <p className="text-sm font-semibold leading-relaxed">
                                        {instructions.welcome}
                                    </p>
                                </div>
                            )}

                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                        theme === "day"
                                            ? "bg-emerald-500"
                                            : "bg-blue-400"
                                    }`}
                                />
                                <p className="text-sm font-medium leading-relaxed">
                                    {instructions.primary}
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                        theme === "day"
                                            ? "bg-emerald-500"
                                            : "bg-blue-400"
                                    }`}
                                />
                                <p className="text-sm leading-relaxed opacity-90">
                                    {instructions.secondary}
                                </p>
                            </div>

                            <div className="flex items-start gap-3">
                                <div
                                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                        theme === "day"
                                            ? "bg-emerald-500"
                                            : "bg-blue-400"
                                    }`}
                                />
                                <p className="text-sm leading-relaxed opacity-90">
                                    {instructions.tertiary}
                                </p>
                            </div>
                        </div>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default InfoButton;
