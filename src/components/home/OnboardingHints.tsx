
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
    ? 'bg-white/85 text-gray-800 border border-gray-200/40' 
    : 'bg-gray-900/85 text-gray-100 border border-gray-700/40';

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      {/* Arrow pointing to show UI button */}
      <div className={`absolute ${isMobile ? 'top-6 right-6' : 'top-2 right-16 sm:top-6 sm:right-20'}`}>
        <div className="flex items-center gap-1.5 animate-fade-in">
          <div className={`
            px-2.5 py-1.5 rounded-md shadow-md backdrop-blur-sm
            text-xs font-medium
            ${hintBaseClasses}
          `}>
            {isMobile ? 'Tap to show' : 'Show interface'}
          </div>
          <div className="flex flex-col items-center">
            <div className={`
              w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px]
              border-l-transparent border-r-transparent animate-pulse
              ${theme === 'day' ? 'border-b-blue-500' : 'border-b-blue-400'}
            `} />
            <div className={`
              w-0.5 h-3 mt-0.5 animate-pulse
              ${theme === 'day' ? 'bg-blue-500' : 'bg-blue-400'}
            `} />
          </div>
        </div>
      </div>

      {/* Central exploration hint */}
      <div className={`absolute ${isMobile ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}>
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_1.2s_forwards]">
          <div className={`
            text-center px-3 py-2.5 rounded-md shadow-md backdrop-blur-sm
            ${isMobile ? 'max-w-[260px]' : 'max-w-xs'} mx-auto
            ${hintBaseClasses}
          `}>
            <div className={`
              ${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-1.5
              ${theme === 'day' ? 'text-emerald-700' : 'text-emerald-300'}
            `}>
              Discover New Worlds
            </div>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-85`}>
              {isMobile 
                ? 'Drag to look around, pinch to zoom' 
                : 'Drag to explore, scroll to zoom'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Bottom navigation and theme hint */}
      <div className={`absolute ${isMobile ? 'bottom-20 left-1/2 -translate-x-1/2 px-6' : 'bottom-16 left-1/2 -translate-x-1/2'}`}>
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_2s_forwards]">
          <div className={`
            text-center px-3 py-2.5 rounded-md shadow-md backdrop-blur-sm
            ${isMobile ? 'max-w-[260px]' : 'max-w-xs'} mx-auto
            ${hintBaseClasses}
          `}>
            <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium space-y-0.5`}>
              <div className={`
                ${theme === 'day' ? 'text-purple-700' : 'text-purple-300'}
              `}>
                {isMobile 
                  ? 'Use arrows to travel' 
                  : 'Press N/P or arrows to travel'
                }
              </div>
              <div className={`
                ${theme === 'day' ? 'text-orange-700' : 'text-orange-300'}
              `}>
                {isMobile 
                  ? 'Tap theme or press Space' 
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
