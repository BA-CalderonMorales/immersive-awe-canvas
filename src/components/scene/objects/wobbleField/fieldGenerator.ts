
import { ConeGeometry, CylinderGeometry, RingGeometry, BufferGeometry, Float32BufferAttribute } from 'three';

export const RICK_FIELD_COUNT = 200;
export const CHAOS_MULTIPLIER = 5;

export const generateChaoticField = () => {
  const positions = [];
  const scales = [];
  const rotations = [];
  const types = [];
  const colors = [];
  
  for (let i = 0; i < RICK_FIELD_COUNT; i++) {
    // Chaotic position distribution - some clustered, some scattered
    const clusterChance = Math.random();
    let x, y, z;
    
    if (clusterChance < 0.4) {
      // Dense central chaos cluster
      x = (Math.random() - 0.5) * 4;
      y = (Math.random() - 0.5) * 3;
      z = (Math.random() - 0.5) * 4;
    } else if (clusterChance < 0.7) {
      // Orbital ring of madness
      const angle = (i / RICK_FIELD_COUNT) * Math.PI * 6 + Math.random();
      const radius = 5 + Math.random() * 3;
      x = Math.cos(angle) * radius;
      y = (Math.random() - 0.5) * 6;
      z = Math.sin(angle) * radius;
    } else {
      // Scattered interdimensional debris
      x = (Math.random() - 0.5) * 20;
      y = (Math.random() - 0.5) * 15;
      z = (Math.random() - 0.5) * 20;
    }
    
    positions.push([x, y, z]);
    scales.push([
      0.1 + Math.random() * 0.8,
      0.1 + Math.random() * 0.8,
      0.1 + Math.random() * 0.8
    ]);
    rotations.push([
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    ]);
    
    // Different geometry types for maximum chaos
    types.push(Math.floor(Math.random() * 8));
    
    // Chaotic color variations
    const hue = (i * 7 + Math.random() * 60) % 360;
    colors.push(`hsl(${hue}, ${70 + Math.random() * 30}%, ${40 + Math.random() * 40}%)`);
  }
  
  return { positions, scales, rotations, types, colors };
};

// Rick's Procedural Geometry Factory - each one different!
export const createRickGeometry = (type: number, scale: [number, number, number]) => {
  const [sx, sy, sz] = scale;
  const baseSize = Math.max(sx, sy, sz);
  
  switch (type) {
    case 0: // Chaotic Crystal Spikes
      return new ConeGeometry(baseSize * 0.5, baseSize * 2, 6 + Math.floor(Math.random() * 8));
    case 1: // Dimensional Tubes
      return new CylinderGeometry(
        baseSize * 0.3, 
        baseSize * 0.1, 
        baseSize * 1.5, 
        8 + Math.floor(Math.random() * 8)
      );
    case 2: // Portal Rings
      return new RingGeometry(
        baseSize * 0.3, 
        baseSize * 0.8, 
        6 + Math.floor(Math.random() * 10),
        2 + Math.floor(Math.random() * 4)
      );
    case 3: // Chaos Polyhedron
      const vertices = [];
      const vertexCount = 8 + Math.floor(Math.random() * 12);
      for (let i = 0; i < vertexCount; i++) {
        vertices.push(
          (Math.random() - 0.5) * baseSize,
          (Math.random() - 0.5) * baseSize,
          (Math.random() - 0.5) * baseSize
        );
      }
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
      geometry.computeVertexNormals();
      return geometry;
    case 4: // Interdimensional Spikes
      return new ConeGeometry(baseSize * 0.2, baseSize * 3, 3 + Math.floor(Math.random() * 5));
    case 5: // Reality Fragments
      const fragVertices = [];
      for (let i = 0; i < 30; i++) {
        fragVertices.push(
          (Math.random() - 0.5) * baseSize * 2,
          (Math.random() - 0.5) * baseSize * 2,
          (Math.random() - 0.5) * baseSize * 2
        );
      }
      const fragGeometry = new BufferGeometry();
      fragGeometry.setAttribute('position', new Float32BufferAttribute(fragVertices, 3));
      return fragGeometry;
    case 6: // Dimensional Discs
      return new RingGeometry(0, baseSize, 16, 1);
    default: // Chaotic Polyhedra
      return new CylinderGeometry(
        baseSize * (0.1 + Math.random() * 0.4),
        baseSize * (0.1 + Math.random() * 0.4),
        baseSize * (0.5 + Math.random() * 1.5),
        3 + Math.floor(Math.random() * 9)
      );
  }
};
