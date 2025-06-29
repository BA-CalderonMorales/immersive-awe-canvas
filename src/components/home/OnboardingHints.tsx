
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
    const timer = setTimeout(() => setMounted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible || !mounted) return null;

  const hintBaseClasses = theme === 'day' 
    ? 'bg-white/95 text-gray-800 border border-gray-200/80' 
    : 'bg-gray-900/95 text-gray-100 border border-gray-700/80';

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Arrow pointing to show UI button */}
      <div className="absolute top-2 right-16 sm:top-6 sm:right-20">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className={`
            px-4 py-3 rounded-xl shadow-xl backdrop-blur-md
            font-medium text-sm tracking-wide
            ${hintBaseClasses}
          `}>
            {isMobile ? 'Tap to show controls' : 'Click to show interface'}
          </div>
          <div className={`
            flex items-center justify-center w-8 h-8 rounded-full
            animate-pulse shadow-lg backdrop-blur-sm
            ${theme === 'day' ? 'bg-blue-500/20 text-blue-600' : 'bg-blue-400/20 text-blue-400'}
          `}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7" />
              <path d="M17 7H7" />
              <path d="M17 7V17" />
            </svg>
          </div>
        </div>
      </div>

      {/* Central exploration hint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_1.2s_forwards]">
          <div className={`
            text-center px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md
            border-2 ${theme === 'day' ? 'border-emerald-200/50' : 'border-emerald-400/30'}
            ${hintBaseClasses}
          `}>
            <div className={`
              text-lg font-semibold mb-2
              ${theme === 'day' ? 'text-emerald-700' : 'text-emerald-300'}
            `}>
              {isMobile ? '✨ Touch to Explore' : '✨ Discover New Worlds'}
            </div>
            <div className="text-sm opacity-90 leading-relaxed">
              {isMobile 
                ? 'Drag to look around • Pinch to zoom' 
                : 'Drag to explore • Scroll to zoom'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation hint */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_2s_forwards]">
          <div className={`
            text-center px-5 py-3 rounded-xl shadow-xl backdrop-blur-md
            ${hintBaseClasses}
          `}>
            <div className={`
              flex items-center justify-center gap-2 text-sm font-medium
              ${theme === 'day' ? 'text-purple-700' : 'text-purple-300'}
            `}>
              <span className="text-lg">🚀</span>
              {isMobile 
                ? 'Use arrows to discover worlds' 
                : 'Press N/P or arrows to travel'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingHints;
