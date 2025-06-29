
import { useMemo } from 'react';

interface UseExperienceUiColorProps {
  worldData: any;
  theme: 'day' | 'night';
}

export const useExperienceUiColor = ({ worldData, theme }: UseExperienceUiColorProps) => {
  const uiColor = useMemo(() => {
    if (!worldData) return 'white';
    
    const dayColor = worldData.ui_day_color;
    const nightColor = worldData.ui_night_color;
    const selectedColor = theme === 'day' ? dayColor : nightColor;
    
    return selectedColor || 'white';
  }, [worldData, theme, worldData?.ui_day_color, worldData?.ui_night_color]);

  return uiColor;
};
