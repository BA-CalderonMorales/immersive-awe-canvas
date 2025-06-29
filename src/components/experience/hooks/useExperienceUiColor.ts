
import { useMemo, useEffect } from 'react';

interface UseExperienceUiColorProps {
  worldData: any;
  theme: 'day' | 'night';
}

export const useExperienceUiColor = ({ worldData, theme }: UseExperienceUiColorProps) => {
  const uiColor = useMemo(() => {
    if (!worldData) {
      console.log('useExperienceUiColor - No worldData, using white');
      return 'white';
    }
    
    const dayColor = worldData.ui_day_color;
    const nightColor = worldData.ui_night_color;
    const selectedColor = theme === 'day' ? dayColor : nightColor;
    const finalColor = selectedColor || 'white';
    
    console.log('useExperienceUiColor - calculation:', {
      worldSlug: worldData.slug,
      theme,
      dayColor,
      nightColor,
      selectedColor,
      finalColor
    });
    
    return finalColor;
  }, [worldData, theme, worldData?.ui_day_color, worldData?.ui_night_color]);

  useEffect(() => {
    console.log('useExperienceUiColor - color changed to:', uiColor, 'for theme:', theme);
  }, [uiColor, theme]);

  return uiColor;
};
