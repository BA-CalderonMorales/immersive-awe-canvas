import { useState, useEffect, useCallback } from "react";

export const useBlurTransition = () => {
    const [isBlurring, setIsBlurring] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const startBlurTransition = useCallback(() => {
        setIsBlurring(true);
        setIsReady(false);
    }, []);

    const completeBlurTransition = useCallback(() => {
        setIsBlurring(false);
        setIsReady(true);
    }, []);

    // Auto-start blur on mount
    useEffect(() => {
        startBlurTransition();

        // Simulate loading time
        const timer = setTimeout(() => {
            completeBlurTransition();
        }, 800);

        return () => clearTimeout(timer);
    }, [startBlurTransition, completeBlurTransition]);

    return {
        isBlurring,
        isReady,
        startBlurTransition,
        completeBlurTransition,
    };
};
