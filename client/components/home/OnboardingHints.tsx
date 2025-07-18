
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
      {/* Show UI button hint */}
      <div className={`absolute ${isMobile ? 'top-6 right-20' : 'top-2 right-20 sm:top-6 sm:right-24'}`}>
        <div className="animate-fade-in">
          <div className={`
            px-2 py-1 rounded-md backdrop-blur-sm
            text-xs font-medium
            ${hintBaseClasses}
          `}>
            {isMobile ? 'Tap to show' : 'Show interface'}
          </div>
        </div>
      </div>

      {/* Central exploration hint */}
      <div className={`absolute ${isMobile ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}>
        <div className="opacity-0 animate-[fade-in_0.6s_ease-out_1.2s_forwards]">
          <div className={`
            text-center px-3 py-2 rounded-md backdrop-blur-sm
            ${isMobile ? 'max-w-[240px]' : 'max-w-xs'} mx-auto
            ${hintBaseClasses}
          `}>
            <div className={`
              ${isMobile ? 'text-sm' : 'text-base'} font-semibold mb-1
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
            text-center px-3 py-2 rounded-md backdrop-blur-sm
            ${isMobile ? 'max-w-[240px]' : 'max-w-xs'} mx-auto
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
