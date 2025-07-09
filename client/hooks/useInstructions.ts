
import { useMemo } from 'react';

interface InstructionSet {
  primary: string;
  secondary: string;
  tertiary: string;
  welcome?: string;
}

export const useInstructions = (isFirstVisit: boolean, isMobile: boolean): InstructionSet => {
  return useMemo((): InstructionSet => {
    const baseInstructions = {
      primary: isMobile 
        ? "Drag to look around, pinch to zoom"
        : "Click and drag to explore, scroll to zoom",
      secondary: isMobile
        ? "Use navigation arrows to discover new worlds"
        : "Press N/P or use arrows to travel between worlds",
      tertiary: isMobile
        ? "Tap the theme button to switch day/night"
        : "Press Space or theme button to toggle day/night"
    };

    if (isFirstVisit) {
      return {
        ...baseInstructions,
        welcome: "Welcome to your journey through immersive worlds!"
      };
    }

    return baseInstructions;
  }, [isFirstVisit, isMobile]);
};
