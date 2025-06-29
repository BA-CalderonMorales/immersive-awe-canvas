
import { useMemo, useEffect } from 'react';
import { WorldData } from '@/types/scene';

export const useExperienceUIColor = (worldData: WorldData | null, theme: 'day' | 'night') => {
  const uiColor = useMemo(() => {
    if (!worldData) {
      console.log('useExperienceUIColor - No worldData, using white');
      return 'white';
    }
    
    const dayColor = worldData.ui_day_color;
    const nightColor = worldData.ui_night_color;
    const selectedColor = theme === 'day' ? dayColor : nightColor;
    const finalColor = selectedColor || 'white';
    
    console.log('useExperienceUIColor - uiColor calculation:', {
      worldSlug: worldData.slug,
      theme,
      dayColor,
      nightColor,
      selectedColor,
      finalColor
    });
    
    return finalColor;
  }, [worldData, theme, worldData?.ui_day_color, worldData?.ui_night_color]);

  // Add effect to log when uiColor changes
  useEffect(() => {
    console.log('useExperienceUIColor - uiColor changed to:', uiColor, 'for theme:', theme);
  }, [uiColor, theme]);

  return uiColor;
};
