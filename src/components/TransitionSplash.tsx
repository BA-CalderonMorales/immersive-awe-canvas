
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TransitionSplashProps {
  show: boolean;
  theme: "day" | "night";
  type?: "app-entry" | "world-switch" | "loading";
  onAnimationEnd?: () => void;
  children?: React.ReactNode;
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
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeIn"
    }
  }
};

const contentVariants = {
  hidden: { scale: 0.9, opacity: 0, y: 20 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      delay: 0.1
    }
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
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
      <motion.div className="flex flex-col items-center">
        <motion.div 
          variants={contentVariants}
          className="mb-6"
        >
          {type === "app-entry" ? (
            <div
              className={`w-20 h-20 md:w-24 md:h-24 rounded-full shadow-xl backdrop-blur-sm ${
                theme === "day"
                  ? "bg-gradient-to-br from-yellow-200/80 to-blue-200/80 border border-blue-200/30"
                  : "bg-gradient-to-br from-blue-900/80 to-purple-900/80 border border-blue-400/30"
              }`}
            />
          ) : (
            <div
              className={`w-12 h-12 md:w-16 md:h-16 rounded-full ${
                theme === "day" ? "bg-yellow-200/90" : "bg-blue-800/90"
              }`}
            />
          )}
        </motion.div>
        
        <motion.h2
          variants={contentVariants}
          className={`text-center font-medium text-base md:text-lg tracking-wide ${
            theme === "day" ? "text-slate-800" : "text-blue-200"
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {getDefaultContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
