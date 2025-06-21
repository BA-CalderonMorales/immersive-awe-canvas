
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionSplashProps {
  show: boolean;
  theme: "day" | "night";
  type?: "app-entry" | "world-switch";
  onAnimationEnd?: () => void;
}

const backgrounds = {
  day: "linear-gradient(135deg, #f4e7d7 0%, #d3ecfd 100%)",
  night: "linear-gradient(135deg, #18203a 0%, #2b3a64 100%)",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0.0, 0.6, 1]
    }
  }
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0, y: 20 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

export default function TransitionSplash({
  show,
  theme,
  type = "app-entry",
  onAnimationEnd,
}: TransitionSplashProps) {
  if (!show) return null;

  return (
    <AnimatePresence onExitComplete={onAnimationEnd}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: backgrounds[theme] }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className="flex flex-col items-center">
            <motion.div variants={logoVariants} className="mb-8">
              {type === "app-entry" ? (
                <div
                  className={`w-20 h-20 md:w-32 md:h-32 rounded-full shadow-2xl backdrop-blur-sm ${
                    theme === "day"
                      ? "bg-gradient-to-br from-yellow-200/70 to-blue-200/70 border-2 border-blue-200/50"
                      : "bg-gradient-to-br from-blue-900/70 to-purple-900/70 border-2 border-blue-400/50"
                  }`}
                />
              ) : (
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 rounded-full ${
                    theme === "day" ? "bg-yellow-200/80" : "bg-blue-800/80"
                  }`}
                />
              )}
            </motion.div>
            
            <motion.h2
              variants={textVariants}
              className={`text-center font-semibold text-lg md:text-xl tracking-tight ${
                theme === "day" ? "text-slate-800" : "text-blue-200"
              }`}
            >
              {type === "app-entry"
                ? "Preparing your journey..."
                : "Transporting to a new world..."}
            </motion.h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
