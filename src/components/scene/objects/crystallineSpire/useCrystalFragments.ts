
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
  cluster: number; // For grouping crystals like in a geode
}

export const useCrystalFragments = () => {
  return useMemo(() => {
    const fragments: CrystalFragment[] = [];
    
    // Create geode-like crystal formations - multiple clusters
    const clusters = [
      { center: [0, 0, 0], radius: 4, count: 8 },
      { center: [6, 2, -3], radius: 2.5, count: 6 },
      { center: [-4, -1, 5], radius: 3, count: 7 },
      { center: [2, 4, 3], radius: 2, count: 5 },
    ];

    clusters.forEach((cluster, clusterIndex) => {
      for (let i = 0; i < cluster.count; i++) {
        // Create natural crystal distribution within each cluster
        const angle = (i / cluster.count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
        const height = (Math.random() - 0.5) * cluster.radius * 0.8;
        const distance = cluster.radius * (0.3 + Math.random() * 0.7);
        
        fragments.push({
          position: [
            cluster.center[0] + Math.cos(angle) * distance + (Math.random() - 0.5) * 0.5,
            cluster.center[1] + height + Math.sin(i * 0.7) * 0.3,
            cluster.center[2] + Math.sin(angle) * distance + (Math.random() - 0.5) * 0.5
          ] as [number, number, number],
          scale: 0.2 + Math.random() * 0.6, // Varied crystal sizes
          geometry: Math.floor(Math.random() * 6), // More variety in crystal shapes
          rotationSpeed: [
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.015,
            (Math.random() - 0.5) * 0.01
          ] as [number, number, number],
          orbitRadius: distance,
          orbitSpeed: 0.01 + Math.random() * 0.02,
          phaseOffset: i * Math.PI / 4 + Math.random() * Math.PI,
          floatOffset: i * Math.PI / 8 + Math.random() * Math.PI,
          cluster: clusterIndex
        });
      }
    });
    
    return fragments;
  }, []);
};
