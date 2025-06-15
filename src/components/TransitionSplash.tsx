
import React from "react";

interface TransitionSplashProps {
  show: boolean;
  theme: "day" | "night";
  onAnimationEnd?: () => void;
}

const professionalDayBg = "linear-gradient(135deg, #f4e7d7 0%, #d3ecfd 100%)";
const professionalNightBg = "linear-gradient(135deg, #18203a 0%, #2b3a64 100%)";

export default function TransitionSplash({
  show,
  theme,
  onAnimationEnd,
}: TransitionSplashProps) {
  if (!show) return null;
  return (
    <div
      className={`fixed z-[9999] inset-0 flex items-center justify-center transition-all duration-700 ${
        show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      style={{
        background: theme === "day" ? professionalDayBg : professionalNightBg,
      }}
      onAnimationEnd={onAnimationEnd}
    >
      <div className="flex flex-col items-center">
        <div
          className="mb-8"
          aria-label="Loading"
        >
          <div className="relative w-16 h-16 md:w-24 md:h-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`block w-16 h-16 md:w-24 md:h-24 rounded-full border-4 ${
                  theme === "day"
                    ? "border-yellow-300 border-t-blue-200"
                    : "border-blue-400 border-t-blue-900"
                } animate-spin`}
              ></span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`block w-10 h-10 md:w-16 md:h-16 rounded-full ${
                  theme === "day" ? "bg-yellow-100" : "bg-blue-900"
                } opacity-80`}
              ></span>
            </div>
          </div>
        </div>
        <h2
          className={`text-center font-semibold text-lg md:text-2xl tracking-tight
            ${theme === "day" ? "text-slate-800" : "text-blue-200"}
            animate-fade-in`}
        >
          Loading your experience...
        </h2>
      </div>
    </div>
  );
}

