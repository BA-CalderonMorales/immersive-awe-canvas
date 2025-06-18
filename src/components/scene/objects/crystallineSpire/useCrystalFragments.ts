
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
    
    // Create a beautiful crystalline pattern with 8 fragments in sacred geometry
    for (let i = 0; i < 8; i++) {
      // Golden ratio for aesthetic positioning
      const goldenAngle = i * Math.PI * 1.618;
      const radius = 4 + Math.cos(i * 0.5) * 2;
      
      // Fibonacci-inspired spiral positioning
      const spiralFactor = i * 0.7;
      
      fragments.push({
        position: [
          Math.cos(goldenAngle) * radius,
          Math.sin(spiralFactor) * 3 + Math.cos(i * 0.3) * 1.5,
          Math.sin(goldenAngle) * radius
        ] as [number, number, number],
        scale: 0.6 + Math.sin(i * 0.8) * 0.3, // Varied but substantial sizes
        geometry: i % 4, // Use all 4 geometry types for variety
        rotationSpeed: [
          0.008 + i * 0.002,
          0.012 + i * 0.001,
          0.006 + i * 0.003
        ] as [number, number, number],
        orbitRadius: radius,
        orbitSpeed: 0.02 + i * 0.003,
        phaseOffset: i * Math.PI / 4, // Perfect 8-fold symmetry
        floatOffset: i * Math.PI / 8
      });
    }
    
    return fragments;
  }, []);
};
