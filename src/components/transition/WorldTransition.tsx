
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
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div 
            className="flex flex-col items-center space-y-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Loading spinner */}
            <motion.div
              className="w-8 h-8 border-2 rounded-full"
              style={{ 
                borderColor: `${textColor}30`,
                borderTopColor: textColor
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Loading message */}
            <motion.p
              style={{ color: textColor }}
              className="text-sm font-medium tracking-wide"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
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
