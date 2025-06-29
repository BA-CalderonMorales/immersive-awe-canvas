
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
    ? 'bg-white/95 text-gray-800 border border-gray-200/60' 
    : 'bg-gray-900/95 text-gray-100 border border-gray-700/60';

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Arrow pointing to show UI button */}
      <div className={`absolute ${isMobile ? 'top-3 right-20' : 'top-2 right-16 sm:top-6 sm:right-20'}`}>
        <div className="flex items-center gap-3 animate-fade-in">
          <div className={`
            px-4 py-3 rounded-xl shadow-xl backdrop-blur-md
            font-medium text-sm max-w-[200px]
            ${hintBaseClasses}
          `}>
            {isMobile ? 'Tap to show controls' : 'Click to show interface'}
          </div>
          <div className="flex flex-col items-center">
            <div className={`
              w-0 h-0 border-l-[10px] border-r-[10px] border-b-[14px]
              border-l-transparent border-r-transparent animate-pulse
              ${theme === 'day' ? 'border-b-blue-600' : 'border-b-blue-400'}
            `} />
            <div className={`
              w-0.5 h-5 mt-1 animate-pulse
              ${theme === 'day' ? 'bg-blue-600' : 'bg-blue-400'}
            `} />
          </div>
        </div>
      </div>

      {/* Central exploration hint */}
      <div className={`absolute ${isMobile ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}>
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_1.2s_forwards]">
          <div className={`
            text-center px-6 py-5 rounded-2xl shadow-xl backdrop-blur-md
            max-w-sm mx-auto
            ${hintBaseClasses}
          `}>
            <div className={`
              text-xl font-bold mb-3
              ${theme === 'day' ? 'text-emerald-700' : 'text-emerald-300'}
            `}>
              Discover New Worlds
            </div>
            <div className="text-base opacity-90 leading-relaxed">
              {isMobile 
                ? 'Drag to look around, pinch to zoom' 
                : 'Drag to explore, scroll to zoom'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation and theme hint */}
      <div className={`absolute ${isMobile ? 'bottom-32 left-1/2 -translate-x-1/2' : 'bottom-20 left-1/2 -translate-x-1/2'}`}>
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_2s_forwards]">
          <div className={`
            text-center px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md
            max-w-sm mx-auto
            ${hintBaseClasses}
          `}>
            <div className="text-base font-semibold space-y-2">
              <div className={`
                ${theme === 'day' ? 'text-purple-700' : 'text-purple-300'}
              `}>
                {isMobile 
                  ? 'Use arrows to discover worlds' 
                  : 'Press N/P or arrows to travel'
                }
              </div>
              <div className={`
                ${theme === 'day' ? 'text-orange-700' : 'text-orange-300'}
              `}>
                {isMobile 
                  ? 'Tap theme button or press Space to switch day/night' 
                  : 'Press Space to toggle day/night'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingHints;
