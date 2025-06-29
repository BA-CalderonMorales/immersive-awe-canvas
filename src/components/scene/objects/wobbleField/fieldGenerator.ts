
import { ConeGeometry, CylinderGeometry, RingGeometry, IcosahedronGeometry, TetrahedronGeometry, OctahedronGeometry, DodecahedronGeometry, SphereGeometry, BoxGeometry } from 'three';

export const CONTEMPLATIVE_FIELD_COUNT = 60; // Reduced for better performance
export const HARMONY_MULTIPLIER = 1.2; // Balanced for gentle wobble effects

export const generateChaoticField = () => {
  const positions = [];
  const scales = [];
  const rotations = [];
  const types = [];
  const colors = [];
  const meanings = []; // Add philosophical meaning to each element
  
  for (let i = 0; i < CONTEMPLATIVE_FIELD_COUNT; i++) {
    // Create more organized field distribution patterns
    const distributionType = Math.random();
    let x, y, z;
    
    if (distributionType < 0.5) {
      // Concentric rings around the center
      const ringIndex = Math.floor(i / 10);
      const angleStep = (Math.PI * 2) / 10;
      const angle = (i % 10) * angleStep;
      const radius = 2.5 + ringIndex * 1.2;
      
      x = Math.cos(angle) * radius + (Math.random() - 0.5) * 0.5;
      y = (Math.random() - 0.5) * 3 + Math.sin(ringIndex * 0.5) * 0.8;
      z = Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5;
    } else if (distributionType < 0.8) {
      // Spiral pattern
      const t = i / CONTEMPLATIVE_FIELD_COUNT;
      const spiralTurns = 3;
      const angle = t * Math.PI * 2 * spiralTurns;
      const radius = 2 + t * 4;
      
      x = Math.cos(angle) * radius;
      y = (t - 0.5) * 6 + Math.sin(angle * 2) * 0.5;
      z = Math.sin(angle) * radius;
    } else {
      // Random spherical distribution
      const sphericalRadius = 2.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      x = sphericalRadius * Math.sin(phi) * Math.cos(theta);
      y = sphericalRadius * Math.cos(phi);
      z = sphericalRadius * Math.sin(phi) * Math.sin(theta);
    }
    
    positions.push([x, y, z]);
    
    // More consistent scaling
    const baseScale = 0.2 + Math.random() * 0.3;
    scales.push([baseScale, baseScale * (0.8 + Math.random() * 0.4), baseScale]);
    
    rotations.push([
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    ]);
    
    // Balanced type distribution
    types.push(Math.floor(Math.random() * 6));
    
    // More harmonious color palette
    const hueBase = (i * 15 + Math.random() * 20) % 360;
    const saturation = 50 + Math.random() * 30;
    const brightness = 60 + Math.random() * 25;
    colors.push(`hsl(${hueBase}, ${saturation}%, ${brightness}%)`);
    
    // Assign philosophical meaning
    const meaningTypes = ['memory', 'question', 'insight', 'doubt', 'wonder', 'truth'];
    meanings.push(meaningTypes[i % meaningTypes.length]);
  }
  
  return { positions, scales, rotations, types, colors, meanings };
};

// Enhanced Geometry Factory
export const createRickGeometry = (type: number, scale: [number, number, number]) => {
  const [sx, sy, sz] = scale;
  const baseSize = Math.max(sx, sy, sz);
  
  switch (type) {
    case 0: // Energy spheres
      return new SphereGeometry(baseSize * 0.8, 12, 8);
    case 1: // Thought crystals
      return new IcosahedronGeometry(baseSize * 0.7, 1);
    case 2: // Memory fragments
      return new TetrahedronGeometry(baseSize * 0.9);
    case 3: // Wisdom cubes
      return new BoxGeometry(baseSize * 1.2, baseSize * 0.8, baseSize * 1.0);  
    case 4: // Insight rings
      return new RingGeometry(baseSize * 0.3, baseSize * 0.8, 12, 2);
    case 5: // Contemplation cylinders
      return new CylinderGeometry(baseSize * 0.4, baseSize * 0.4, baseSize * 1.5, 12);
    default:
      return new OctahedronGeometry(baseSize * 0.8);
  }
};
