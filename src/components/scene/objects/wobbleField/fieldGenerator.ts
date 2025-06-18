
import { ConeGeometry, CylinderGeometry, RingGeometry, BufferGeometry, Float32BufferAttribute, IcosahedronGeometry, TetrahedronGeometry, OctahedronGeometry, DodecahedronGeometry } from 'three';

export const CONTEMPLATIVE_FIELD_COUNT = 60; // Further reduced for deeper focus
export const HARMONY_MULTIPLIER = 1.5; // Even gentler for profound contemplation

export const generateChaoticField = () => {
  const positions = [];
  const scales = [];
  const rotations = [];
  const types = [];
  const colors = [];
  const meanings = []; // Add philosophical meaning to each element
  
  for (let i = 0; i < CONTEMPLATIVE_FIELD_COUNT; i++) {
    // Philosophical arrangement patterns
    const distributionType = Math.random();
    let x, y, z;
    
    if (distributionType < 0.3) {
      // Mandala pattern - representing wholeness and the cosmos
      const rings = 5;
      const ringIndex = Math.floor(i / (CONTEMPLATIVE_FIELD_COUNT / rings));
      const angle = (i % (CONTEMPLATIVE_FIELD_COUNT / rings)) * (Math.PI * 2) / (CONTEMPLATIVE_FIELD_COUNT / rings);
      const radius = (ringIndex + 1) * 1.8;
      x = Math.cos(angle) * radius;
      y = Math.sin(ringIndex * 0.5) * 2; // Subtle vertical variation
      z = Math.sin(angle) * radius;
    } else if (distributionType < 0.6) {
      // Spiral of consciousness - representing growth and evolution
      const t = i / CONTEMPLATIVE_FIELD_COUNT;
      const spiralTurns = 3;
      const angle = t * Math.PI * 2 * spiralTurns;
      const radius = t * 5;
      x = Math.cos(angle) * radius;
      y = (t - 0.5) * 6; // Ascend through consciousness levels
      z = Math.sin(angle) * radius;
    } else {
      // Meditation clusters - representing states of awareness
      const clusterCount = 8;
      const clusterIndex = Math.floor(i / (CONTEMPLATIVE_FIELD_COUNT / clusterCount));
      const clusterAngle = clusterIndex * (Math.PI * 2) / clusterCount;
      const clusterRadius = 4;
      x = Math.cos(clusterAngle) * clusterRadius + (Math.random() - 0.5) * 1.5;
      y = (Math.random() - 0.5) * 4;
      z = Math.sin(clusterAngle) * clusterRadius + (Math.random() - 0.5) * 1.5;
    }
    
    positions.push([x, y, z]);
    
    // Scales represent the intensity of contemplation
    const contemplationDepth = 0.4 + Math.sin(i * 0.1) * 0.3;
    scales.push([contemplationDepth, contemplationDepth, contemplationDepth]);
    
    rotations.push([
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    ]);
    
    // More diverse philosophical forms
    types.push(Math.floor(Math.random() * 7)); // Expanded to 7 meaningful types
    
    // Color represents the nature of thought
    const thoughtHue = (i * 23 + Math.random() * 20) % 360; // Prime number for natural distribution
    const contemplationSaturation = 35 + Math.random() * 25; // Muted for deep thought
    const wisdomLightness = 40 + Math.random() * 30; // Balanced luminosity
    colors.push(`hsl(${thoughtHue}, ${contemplationSaturation}%, ${wisdomLightness}%)`);
    
    // Assign philosophical meaning
    const meaningTypes = ['memory', 'question', 'insight', 'doubt', 'wonder', 'truth', 'mystery'];
    meanings.push(meaningTypes[i % meaningTypes.length]);
  }
  
  return { positions, scales, rotations, types, colors, meanings };
};

// Philosophical Geometry Factory - each form embodies deeper meaning
export const createRickGeometry = (type: number, scale: [number, number, number]) => {
  const [sx, sy, sz] = scale;
  const baseSize = Math.max(sx, sy, sz);
  
  switch (type) {
    case 0: // Questions - pointed upward, seeking answers
      return new ConeGeometry(baseSize * 0.35, baseSize * 2.2, 8);
    case 1: // Memories - cylindrical columns of experience
      return new CylinderGeometry(
        baseSize * 0.25, 
        baseSize * 0.4, 
        baseSize * 1.5, 
        12
      );
    case 2: // Cycles of Understanding - rings of wisdom
      return new RingGeometry(
        baseSize * 0.3, 
        baseSize * 0.8, 
        16,
        2
      );
    case 3: // Complex Thoughts - icosahedrons for multifaceted ideas
      return new IcosahedronGeometry(baseSize * 0.65, 2);
    case 4: // Moments of Clarity - tetrahedra for sharp insights
      return new TetrahedronGeometry(baseSize * 0.9);
    case 5: // Balanced Perspectives - octahedra for dual nature of truth
      return new OctahedronGeometry(baseSize * 0.7);
    case 6: // Universal Truths - dodecahedra for cosmic understanding
      return new DodecahedronGeometry(baseSize * 0.6);
    default: // Default contemplative form - simple meditation
      return new CylinderGeometry(
        baseSize * 0.3,
        baseSize * 0.3,
        baseSize * 1.2,
        8
      );
  }
};
