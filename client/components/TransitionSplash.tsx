import { AnimatePresence, motion } from "framer-motion";
import type React from "react";

interface TransitionSplashProps {
    show: boolean;
    theme: "day" | "night";
    type?: "app-entry" | "world-switch" | "loading";
    onAnimationEnd?: () => void;
    children?: React.ReactNode;
}

const backgrounds = {
    day: "rgba(255, 255, 255, 0.98)",
    night: "rgba(0, 0, 0, 0.98)",
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.8, 0.25, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.4,
            ease: [0.4, 0, 0.6, 1] as const,
        },
    },
};

const iconVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 300,
            damping: 30,
            delay: 0.1,
        },
    },
    exit: {
        scale: 0.9,
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.2,
            ease: [0.4, 0, 1, 1] as const,
        },
    },
};

const textVariants = {
    hidden: { scale: 0.9, opacity: 0, y: 15 },
    visible: {
        scale: 1,
        opacity: 1,
        y: 0,
        transition: {
            type: "spring" as const,
            stiffness: 200,
            damping: 25,
            delay: 0.2,
        },
    },
    exit: {
        scale: 0.95,
        opacity: 0,
        y: -5,
        transition: {
            duration: 0.15,
            ease: [0.4, 0, 1, 1] as const,
        },
    },
};

const backgroundVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.8, 0.25, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: [0.4, 0, 0.6, 1] as const,
        },
    },
};

export default function TransitionSplash({
    show,
    theme,
    type = "app-entry",
    onAnimationEnd,
    children,
}: TransitionSplashProps) {
    if (!show) return null;

    const getDefaultContent = () => {
        if (children) return children;

        return (
            <motion.div
                className="flex flex-col items-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.div variants={iconVariants} className="mb-8">
                    <div
                        className={`relative w-16 h-16 md:w-20 md:h-20 ${
                            theme === "day"
                                ? ""
                                : ""
                        }`}
                    >
                        {/* Minimal spinner */}
                        <svg
                            className="w-full h-full animate-spin"
                            style={{ animationDuration: "2s" }}
                            viewBox="0 0 50 50"
                            fill="none"
                        >
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                stroke={theme === "day" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}
                                strokeWidth="1.5"
                            />
                            <circle
                                cx="25"
                                cy="25"
                                r="20"
                                stroke={theme === "day" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.8)"}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeDasharray="80 200"
                            />
                        </svg>
                    </div>
                </motion.div>

                <motion.h2
                    variants={textVariants}
                    className={`text-center font-medium text-sm md:text-base tracking-tight ${
                        theme === "day" ? "text-black/[0.7]" : "text-white/[0.7]"
                    }`}
                >
                    {type === "app-entry"
                        ? "Preparing your journey..."
                        : type === "world-switch"
                          ? "Traveling to new world..."
                          : "Loading..."}
                </motion.h2>
            </motion.div>
        );
    };

    return (
        <AnimatePresence onExitComplete={onAnimationEnd}>
            {show && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    style={{ background: backgrounds[theme] }}
                    variants={backgroundVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {getDefaultContent()}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
