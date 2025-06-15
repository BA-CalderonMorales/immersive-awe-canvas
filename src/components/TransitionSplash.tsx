
import React from "react";

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

/**
 * Professional transition splash: 
 * - "app-entry": Long fade/slide.
 * - "world-switch": Short fade, subtle scale.
 */
export default function TransitionSplash({
  show,
  theme,
  type = "app-entry",
  onAnimationEnd,
}: TransitionSplashProps) {
  if (!show) return null;
  // Animation variants: customize per type
  const containerClass = `
    fixed inset-0 z-[9999] flex items-center justify-center 
    ${type === "app-entry"
      ? "animate-professional-fadein"
      : "animate-world-fadein"}
    transition-none
  `;

  return (
    <div
      className={containerClass}
      style={{
        background: backgrounds[theme],
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col items-center">
        {/* Slick logo badge for entry; minimalist dot for world-switch */}
        {type === "app-entry" ? (
          <div className="mb-8 animate-scale-in">
            <span
              className={`block w-20 h-20 md:w-32 md:h-32 rounded-full shadow-2xl ${
                theme === "day"
                  ? "bg-yellow-200/70 border-2 border-blue-200"
                  : "bg-blue-900/70 border-2 border-blue-400"
              }`}
            ></span>
          </div>
        ) : (
          <div className="mb-2 animate-bounce-slow">
            <span
              className={`block w-8 h-8 md:w-12 md:h-12 rounded-full opacity-70 ${
                theme === "day" ? "bg-yellow-200" : "bg-blue-800"
              }`}
            ></span>
          </div>
        )}
        <h2
          className={`
            text-center font-semibold text-lg md:text-xl tracking-tight
            ${theme === "day" ? "text-slate-800" : "text-blue-200"}
            animate-fade-in
          `}
        >
          {type === "app-entry"
            ? "Preparing your journey..."
            : "Transporting to a new world..."}
        </h2>
      </div>
    </div>
  );
}
