
import React from "react";

interface WorldTransitionProps {
  show: boolean;
  theme: "day" | "night";
  onDone?: () => void;
}
/**
 * A fast, cinematic "dip to color" transition for changing scenes.
 */
const WorldTransition = ({ show, theme, onDone }: WorldTransitionProps) => {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-[9988] pointer-events-none animate-dip-to-color"
      style={{
        backgroundColor: theme === "day" ? "#f7f6ed" : "#212949",
      }}
      onAnimationEnd={onDone}
    />
  );
};

export default WorldTransition;
