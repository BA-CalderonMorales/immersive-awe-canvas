
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
    
    // Reduced to just 6 elegant fragments
    for (let i = 0; i < 6; i++) {
      const radius = 6 + i * 0.5;
      const angle = (i / 6) * Math.PI * 2;
      
      fragments.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle * 2) * 2,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: 0.4 + Math.sin(i) * 0.2,
        geometry: i % 2, // Only octahedron and tetrahedron for simplicity
        rotationSpeed: [
          0.01,
          0.005,
          0.008
        ] as [number, number, number],
        orbitRadius: radius,
        orbitSpeed: 0.03,
        phaseOffset: i * Math.PI / 3,
        floatOffset: i * Math.PI / 6
      });
    }
    
    return fragments;
  }, []);
};
