
import { ConeGeometry, CylinderGeometry, RingGeometry, BufferGeometry, Float32BufferAttribute, IcosahedronGeometry, TetrahedronGeometry } from 'three';

export const CONTEMPLATIVE_FIELD_COUNT = 80; // Reduced from 200 for more focused experience
export const HARMONY_MULTIPLIER = 2; // Reduced from 5 for gentler movement

export const generateChaoticField = () => {
  const positions = [];
  const scales = [];
  const rotations = [];
  const types = [];
  const colors = [];
  
  for (let i = 0; i < CONTEMPLATIVE_FIELD_COUNT; i++) {
    // More structured, meditative positioning
    const distributionType = Math.random();
    let x, y, z;
    
    if (distributionType < 0.5) {
      // Sacred geometry - fibonacci spiral arrangement
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // Golden angle
      const angle = i * goldenAngle;
      const radius = Math.sqrt(i / CONTEMPLATIVE_FIELD_COUNT) * 6;
      x = Math.cos(angle) * radius;
      y = (i / CONTEMPLATIVE_FIELD_COUNT - 0.5) * 8; // Vertical spread
      z = Math.sin(angle) * radius;
    } else {
      // Contemplative clusters - like thoughts forming
      const clusterCenter = Math.floor(i / 15) * 4 - 8;
      x = clusterCenter + (Math.random() - 0.5) * 3;
      y = (Math.random() - 0.5) * 6;
      z = (Math.random() - 0.5) * 3;
    }
    
    positions.push([x, y, z]);
    
    // More uniform, contemplative scaling
    const baseScale = 0.3 + Math.random() * 0.4;
    scales.push([baseScale, baseScale, baseScale]);
    
    rotations.push([
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    ]);
    
    // Fewer geometry types for visual coherence
    types.push(Math.floor(Math.random() * 5)); // Reduced from 8
    
    // More harmonious color palette
    const hue = (i * 15 + Math.random() * 30) % 360; // More structured color progression
    const saturation = 50 + Math.random() * 30; // Lower saturation for calmness
    const lightness = 45 + Math.random() * 25; // Consistent lightness range
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  
  return { positions, scales, rotations, types, colors };
};

// Contemplative Geometry Factory - each form has meaning
export const createRickGeometry = (type: number, scale: [number, number, number]) => {
  const [sx, sy, sz] = scale;
  const baseSize = Math.max(sx, sy, sz);
  
  switch (type) {
    case 0: // Meditation Crystals - for focus
      return new ConeGeometry(baseSize * 0.4, baseSize * 1.8, 6);
    case 1: // Thought Columns - representing ideas
      return new CylinderGeometry(
        baseSize * 0.2, 
        baseSize * 0.3, 
        baseSize * 1.2, 
        8
      );
    case 2: // Consciousness Rings - cycles of awareness
      return new RingGeometry(
        baseSize * 0.4, 
        baseSize * 0.7, 
        12,
        1
      );
    case 3: // Wisdom Polyhedra - sacred geometry
      return new IcosahedronGeometry(baseSize * 0.6, 1);
    case 4: // Insight Tetrahedra - moments of clarity
      return new TetrahedronGeometry(baseSize * 0.8);
    default: // Default contemplative form
      return new CylinderGeometry(
        baseSize * 0.3,
        baseSize * 0.3,
        baseSize * 1.0,
        6
      );
  }
};
