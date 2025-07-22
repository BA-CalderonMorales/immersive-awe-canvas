import { AnimatePresence, motion } from "framer-motion";
import type React from "react";

interface BlurTransitionProps {
    show: boolean;
    theme: "day" | "night";
    onComplete?: () => void;
    children?: React.ReactNode;
}

const BlurTransition = ({
    show,
    theme,
    onComplete,
    children,
}: BlurTransitionProps) => {
    const backgroundColor =
        theme === "day"
            ? "linear-gradient(135deg, #f4e7d7 0%, #d3ecfd 100%)"
            : "linear-gradient(135deg, #18203a 0%, #2b3a64 100%)";

    // Don't render anything if show is false
    if (!show) return null;

    return (
        <AnimatePresence onExitComplete={onComplete}>
            <motion.div
                className="fixed inset-0 z-[9990] flex items-center justify-center backdrop-blur-md"
                style={{ background: backgroundColor }}
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{
                    opacity: 1,
                    backdropFilter: "blur(20px)",
                    transition: { duration: 0.3, ease: [0.25, 0.8, 0.25, 1] },
                }}
                exit={{
                    opacity: 0,
                    backdropFilter: "blur(0px)",
                    transition: { duration: 0.4, ease: [0.4, 0, 0.6, 1] },
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default BlurTransition;
