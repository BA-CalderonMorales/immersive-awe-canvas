
import { useMemo } from 'react';

export interface SpireFormation {
  position: [number, number, number];
  height: number;
  radius: number;
  segments: number;
  rotation: number;
  scale: number;
  type: 'main' | 'satellite';
  orbitSpeed?: number;
  phaseOffset?: number;
}

export const useSpireFormations = () => {
  return useMemo(() => {
    const formations: SpireFormation[] = [];
    
    // Main central spires with different heights and rotations
    for (let level = 0; level < 5; level++) {
      const height = 8 - level * 1.2;
      const radius = 0.8 + level * 0.3;
      const segments = 8 - level;
      
      formations.push({
        position: [0, level * 1.5, 0] as [number, number, number],
        height,
        radius,
        segments,
        rotation: level * Math.PI / 4,
        scale: 1 - level * 0.15,
        type: 'main'
      });
    }
    
    // Recursive satellite spires
    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = 4 + ring * 2;
      const spireCount = 6 + ring * 2;
      
      for (let i = 0; i < spireCount; i++) {
        const angle = (i / spireCount) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;
        const y = Math.sin(angle * 3) * 0.5;
        
        formations.push({
          position: [x, y, z] as [number, number, number],
          height: 3 - ring * 0.5,
          radius: 0.3 + ring * 0.1,
          segments: 6,
          rotation: angle + ring * 0.5,
          scale: 0.7 - ring * 0.2,
          type: 'satellite',
          orbitSpeed: 0.1 + ring * 0.05,
          phaseOffset: i * 0.3
        });
      }
    }
    
    return formations;
  }, []);
};
