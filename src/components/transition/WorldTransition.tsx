
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface WorldTransitionProps {
  show: boolean;
  theme: "day" | "night";
  onDone?: () => void;
  loadingMessage?: string;
}

const WorldTransition = ({ 
  show, 
  theme, 
  onDone,
  loadingMessage = "Traveling to new world..."
}: WorldTransitionProps) => {
  if (!show) return null;

  const backgroundColor = theme === "day" ? "#f7f6ed" : "#212949";
  const textColor = theme === "day" ? "#374151" : "#e5e7eb";

  return (
    <AnimatePresence onExitComplete={onDone}>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9988] flex items-center justify-center"
          style={{ backgroundColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div 
            className="flex flex-col items-center space-y-6"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeOut",
              type: "spring",
              stiffness: 200,
              damping: 25
            }}
          >
            {/* Loading spinner */}
            <motion.div
              className="w-10 h-10 border-2 rounded-full"
              style={{ 
                borderColor: `${textColor}20`,
                borderTopColor: textColor
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Loading message */}
            <motion.p
              style={{ color: textColor }}
              className="text-sm font-medium tracking-wide text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {loadingMessage}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WorldTransition;
