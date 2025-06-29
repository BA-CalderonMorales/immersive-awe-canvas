
import { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface OnboardingHintsProps {
  isVisible: boolean;
  theme: 'day' | 'night';
}

const OnboardingHints = ({ isVisible, theme }: OnboardingHintsProps) => {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || !mounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Arrow pointing to show UI button */}
      <div className="absolute top-2 right-16 sm:top-6 sm:right-20">
        <div className={`flex items-center gap-2 animate-fade-in ${
          theme === 'day' ? 'text-gray-600' : 'text-gray-300'
        }`}>
          <span className={`text-sm font-medium px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm ${
            theme === 'day' 
              ? 'bg-white/90 border border-gray-200' 
              : 'bg-black/80 border border-gray-700'
          }`}>
            {isMobile ? 'Tap to show controls' : 'Click to show interface'}
          </span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
          >
            <path d="M7 17L17 7" />
            <path d="M17 7H7" />
            <path d="M17 7V17" />
          </svg>
        </div>
      </div>

      {/* Central exploration hint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className={`text-center animate-fade-in [animation-delay:1.5s] opacity-0 animate-[fade-in_0.5s_ease-out_1.5s_forwards] ${
          theme === 'day' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p className={`text-lg font-medium mb-2 px-4 py-2 rounded-lg shadow-lg backdrop-blur-sm ${
            theme === 'day' 
              ? 'bg-white/80 border border-gray-200' 
              : 'bg-black/70 border border-gray-700'
          }`}>
            {isMobile ? 'Drag to explore • Pinch to zoom' : 'Drag to look around • Scroll to zoom'}
          </p>
        </div>
      </div>

      {/* Bottom navigation hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <div className={`text-center animate-fade-in [animation-delay:2.5s] opacity-0 animate-[fade-in_0.5s_ease-out_2.5s_forwards] ${
          theme === 'day' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p className={`text-sm px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm ${
            theme === 'day' 
              ? 'bg-white/80 border border-gray-200' 
              : 'bg-black/70 border border-gray-700'
          }`}>
            {isMobile ? 'Use arrows to discover worlds' : 'Press N/P or use arrows to travel between worlds'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingHints;
