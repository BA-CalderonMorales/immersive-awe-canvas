
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
    ? 'bg-white/90 text-gray-800 border border-gray-200/50' 
    : 'bg-gray-900/90 text-gray-100 border border-gray-700/50';

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Arrow pointing to show UI button */}
      <div className={`absolute ${isMobile ? 'top-4 right-16' : 'top-2 right-16 sm:top-6 sm:right-20'}`}>
        <div className="flex items-center gap-2 animate-fade-in">
          <div className={`
            px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm
            text-xs font-medium
            ${hintBaseClasses}
          `}>
            {isMobile ? 'Tap to show controls' : 'Click to show interface'}
          </div>
          <div className="flex flex-col items-center">
            <div className={`
              w-0 h-0 border-l-[8px] border-r-[8px] border-b-[10px]
              border-l-transparent border-r-transparent animate-pulse
              ${theme === 'day' ? 'border-b-blue-600' : 'border-b-blue-400'}
            `} />
            <div className={`
              w-0.5 h-4 mt-1 animate-pulse
              ${theme === 'day' ? 'bg-blue-600' : 'bg-blue-400'}
            `} />
          </div>
        </div>
      </div>

      {/* Central exploration hint */}
      <div className={`absolute ${isMobile ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}>
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_1.2s_forwards]">
          <div className={`
            text-center px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm
            ${isMobile ? 'max-w-[280px]' : 'max-w-sm'} mx-auto
            ${hintBaseClasses}
          `}>
            <div className={`
              ${isMobile ? 'text-lg' : 'text-xl'} font-bold mb-2
              ${theme === 'day' ? 'text-emerald-700' : 'text-emerald-300'}
            `}>
              Discover New Worlds
            </div>
            <div className={`${isMobile ? 'text-sm' : 'text-base'} opacity-90`}>
              {isMobile 
                ? 'Drag to look around, pinch to zoom' 
                : 'Drag to explore, scroll to zoom'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation and theme hint */}
      <div className={`absolute ${isMobile ? 'bottom-24 left-1/2 -translate-x-1/2 px-4' : 'bottom-20 left-1/2 -translate-x-1/2'}`}>
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_2s_forwards]">
          <div className={`
            text-center px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm
            ${isMobile ? 'max-w-[280px]' : 'max-w-sm'} mx-auto
            ${hintBaseClasses}
          `}>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium space-y-1`}>
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
                  ? 'Tap theme button or press Space' 
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
