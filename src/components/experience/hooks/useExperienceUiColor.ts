
import { useMemo } from 'react';

export const useExperienceUiColor = ({ worldData, theme }: { worldData: any; theme: 'day' | 'night' }) => {
  return useMemo(() => {
    if (!worldData) return 'white';
    return theme === 'day' ? (worldData.ui_day_color || 'white') : (worldData.ui_night_color || 'white');
  }, [worldData, theme]);
};
