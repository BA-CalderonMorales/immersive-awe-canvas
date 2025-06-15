
import React from "react";

interface WorldTransitionProps {
  show: boolean;
  theme: "day" | "night";
  onDone?: () => void;
}
/**
 * Subtle, non-blocking world transition overlay for changing scenes.
 * (Distinct from the initial app splash)
 */
const WorldTransition = ({ show, theme, onDone }: WorldTransitionProps) => {
  if (!show) return null;
  return (
    <div
      className={`
        fixed inset-0 z-[9988] flex items-center justify-center 
        pointer-events-none
        animate-world-fadein
      `}
      style={{
        background:
          theme === "day"
            ? "linear-gradient(135deg, #e9f3f7 0%, #f7f6ed 100%)"
            : "linear-gradient(135deg, #212949 0%, #23355c 100%)",
        opacity: 0.92,
        transition: "opacity 0.4s cubic-bezier(0.47,0,0.75,0.72)",
      }}
      onAnimationEnd={onDone}
    >
      <span
        className={`block rounded-full ${
          theme === "day"
            ? "bg-yellow-300/40"
            : "bg-blue-800/50"
        } w-8 h-8 md:w-12 md:h-12 animate-bounce-slow`}
      ></span>
    </div>
  );
};

export default WorldTransition;
