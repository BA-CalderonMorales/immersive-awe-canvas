
import React from "react";

interface TransitionSplashProps {
  show: boolean;
  theme: "day" | "night";
  onAnimationEnd?: () => void;
}

const sunGradient =
  "radial-gradient(ellipse at center, #fffdf7 0%, #ffe795 45%, #fecc60 70%, #9a7b39 100%)";
const nightGradient =
  "radial-gradient(circle at 70% 30%, #2b3a64 0%, #0d1725 50%, #080d14 100%)";

export default function TransitionSplash({
  show,
  theme,
  onAnimationEnd,
}: TransitionSplashProps) {
  if (!show) return null;
  return (
    <div
      className={`fixed z-[9999] inset-0 flex items-center justify-center transition-all duration-800 ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: theme === "day" ? sunGradient : nightGradient,
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col items-center">
        <div className="flex mb-6">
          {theme === "day" ? (
            <span className="animate-spin-slow text-yellow-400 text-6xl md:text-8xl">☀️</span>
          ) : (
            <span className="animate-spin-slow text-blue-300 text-6xl md:text-8xl">🌙</span>
          )}
        </div>
        <h2
          className={`text-center font-bold text-lg md:text-2xl
            ${theme === "day" ? "text-yellow-950" : "text-blue-200"}
            animate-fade-in`}
        >
          Teleporting...
        </h2>
      </div>
    </div>
  );
}
