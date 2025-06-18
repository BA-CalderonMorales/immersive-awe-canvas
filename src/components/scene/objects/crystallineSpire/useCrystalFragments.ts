
import { useMemo } from 'react';

export interface CrystalFragment {
  position: [number, number, number];
  scale: number;
  geometry: number;
  rotationSpeed: [number, number, number];
  orbitRadius: number;
  orbitSpeed: number;
  phaseOffset: number;
  floatOffset: number;
}

export const useCrystalFragments = () => {
  return useMemo(() => {
    const fragments: CrystalFragment[] = [];
    
    for (let i = 0; i < 24; i++) {
      const radius = 8 + Math.random() * 6;
      const angle = (i / 24) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 8;
      
      fragments.push({
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
          height,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 2
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.4,
        geometry: Math.floor(Math.random() * 4),
        rotationSpeed: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ] as [number, number, number],
        orbitRadius: radius,
        orbitSpeed: 0.05 + Math.random() * 0.1,
        phaseOffset: Math.random() * Math.PI * 2,
        floatOffset: Math.random() * Math.PI * 2
      });
    }
    
    return fragments;
  }, []);
};
