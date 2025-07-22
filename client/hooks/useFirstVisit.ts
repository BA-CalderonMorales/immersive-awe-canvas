import { useEffect, useState } from "react";

export const useFirstVisit = () => {
    const [isFirstVisit, setIsFirstVisit] = useState(false);
    const [showOnboardingHints, setShowOnboardingHints] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const handleFirstInteraction = () => {
        setShowOnboardingHints(false);
        setIsFirstVisit(false);

        if (typeof window !== "undefined") {
            try {
                localStorage.setItem("has-visited-immersive-canvas", "true");
            } catch (error) {
                console.warn("Could not save first visit state:", error);
            }
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const hasVisited = localStorage.getItem(
                    "has-visited-immersive-canvas"
                );
                const firstVisit = !hasVisited;

                setIsFirstVisit(firstVisit);
                setShowOnboardingHints(firstVisit);
                setIsInitialized(true);

                // Mark as visited after a delay to allow onboarding to show
                if (firstVisit) {
                    const timer = setTimeout(() => {
                        localStorage.setItem(
                            "has-visited-immersive-canvas",
                            "true"
                        );
                    }, 5000);
                    return () => clearTimeout(timer);
                }
            } catch (error) {
                console.warn(
                    "Could not access localStorage for first visit tracking:",
                    error
                );
                setIsInitialized(true);
            }
        }
    }, []);

    useEffect(() => {
        if (!showOnboardingHints) return;

        // Listen for any drag/pointer events on the canvas to hide onboarding
        const handleCanvasInteraction = (e: PointerEvent) => {
            const target = e.target as HTMLElement;
            // Check if the interaction is on the canvas or within the canvas container
            if (target.tagName === "CANVAS" || target.closest("canvas")) {
                handleFirstInteraction();
            }
        };

        // Add event listeners for pointer events
        document.addEventListener("pointermove", handleCanvasInteraction);
        document.addEventListener("pointerdown", handleCanvasInteraction);

        return () => {
            document.removeEventListener(
                "pointermove",
                handleCanvasInteraction
            );
            document.removeEventListener(
                "pointerdown",
                handleCanvasInteraction
            );
        };
    }, [showOnboardingHints, handleFirstInteraction]);

    return {
        isFirstVisit,
        showOnboardingHints,
        isInitialized,
        handleFirstInteraction,
    };
};
