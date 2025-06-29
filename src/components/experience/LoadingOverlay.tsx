
import React from "react";
import { motion } from "framer-motion";

interface LoadingOverlayProps {
  message: string;
  theme: "day" | "night";
}

const LoadingOverlay = ({ message, theme }: LoadingOverlayProps) => {
  const background = theme === "day" 
    ? "linear-gradient(135deg, #f4e7d7 0%, #d3ecfd 100%)"
    : "linear-gradient(135deg, #18203a 0%, #2b3a64 100%)";

  const textColor = theme === "day" ? "#334155" : "#e2e8f0";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background }}
    >
      <motion.div
        className="flex flex-col items-center space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-opacity-30 rounded-full"
          style={{ 
            borderColor: textColor,
            borderTopColor: 'transparent'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.p
          className="text-lg font-medium text-center"
          style={{ color: textColor }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingOverlay;
