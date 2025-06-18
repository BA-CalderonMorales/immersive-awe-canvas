
import { useRef } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { useSpireFormations } from './crystallineSpire/useSpireFormations';
import { useCrystalFragments } from './crystallineSpire/useCrystalFragments';
import SpireStructure from './crystallineSpire/SpireStructure';
import CrystalFragmentComponent from './crystallineSpire/CrystalFragmentComponent';
import EnergyWeb from './crystallineSpire/EnergyWeb';

interface CrystallineSpireObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const CrystallineSpireObject = ({ color, materialConfig, isLocked }: CrystallineSpireObjectProps) => {
  const mainGroupRef = useRef<Group>(null!);
  const spireRefs = useRef<Group[]>([]);
  const orbitalRefs = useRef<Group[]>([]);
  const { mouse } = useThree();
  const timeRef = useRef(0);

  const spireFormations = useSpireFormations();
  const crystalFragments = useCrystalFragments();

  // Enhanced energy pulse function with recursive patterns
  const getRecursivePulse = (time: number, depth: number = 0) => {
    const baseFreq = 0.8;
    const pulse = Math.sin(time * baseFreq) * 0.5 + 0.5;
    
    if (depth > 0) {
      const subPulse = getRecursivePulse(time * 1.618, depth - 1) * 0.3;
      return pulse + subPulse;
    }
    
    return pulse;
  };

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.2;
    
    if (mainGroupRef.current) {
      // Slow mystical rotation
      mainGroupRef.current.rotation.y += 0.002;
      
      // Recursive pulse effect
      const mainPulse = getRecursivePulse(timeRef.current, 2);
      const scaleFactor = 0.8 + mainPulse * 0.3 + mouseInfluence * 0.2;
      mainGroupRef.current.scale.setScalar(scaleFactor);
      
      // Subtle breathing motion
      mainGroupRef.current.position.y = Math.sin(timeRef.current * 0.3) * 0.1;
    }

    // Animate spire formations
    spireRefs.current.forEach((spireRef, index) => {
      if (!spireRef) return;
      
      const formation = spireFormations[index];
      if (!formation) return;
      
      if (formation.type === 'satellite') {
        // Orbital motion for satellite spires
        const orbitAngle = timeRef.current * formation.orbitSpeed! + formation.phaseOffset!;
        const baseRadius = Math.sqrt(formation.position[0] ** 2 + formation.position[2] ** 2);
        
        spireRef.position.x = Math.cos(orbitAngle) * baseRadius;
        spireRef.position.z = Math.sin(orbitAngle) * baseRadius;
        spireRef.position.y = formation.position[1] + Math.sin(timeRef.current * 0.4 + formation.phaseOffset!) * 0.3;
      }
      
      // Individual spire pulse
      const spireP = getRecursivePulse(timeRef.current + index * 0.2, 1);
      const spireScale = formation.scale * (0.7 + spireP * 0.4);
      spireRef.scale.setScalar(spireScale);
      
      // Rotation animation
      spireRef.rotation.x = formation.rotation + timeRef.current * 0.1;
      spireRef.rotation.z = Math.sin(timeRef.current * 0.15 + index) * 0.1;
    });

    // Animate crystal fragments
    orbitalRefs.current.forEach((orbitalRef, index) => {
      if (!orbitalRef) return;
      
      const fragment = crystalFragments[index];
      if (!fragment) return;
      
      // Orbital motion
      const orbitAngle = timeRef.current * fragment.orbitSpeed + fragment.phaseOffset;
      orbitalRef.position.x = Math.cos(orbitAngle) * fragment.orbitRadius;
      orbitalRef.position.z = Math.sin(orbitAngle) * fragment.orbitRadius;
      
      // Floating motion
      orbitalRef.position.y = fragment.position[1] + 
        Math.sin(timeRef.current * 0.5 + fragment.floatOffset) * 1.2;
      
      // Individual rotation
      orbitalRef.rotation.x += fragment.rotationSpeed[0];
      orbitalRef.rotation.y += fragment.rotationSpeed[1];
      orbitalRef.rotation.z += fragment.rotationSpeed[2];
      
      // Pulse scaling
      const fragmentPulse = getRecursivePulse(timeRef.current + fragment.phaseOffset, 0);
      orbitalRef.scale.setScalar(fragment.scale * (0.8 + fragmentPulse * 0.3));
    });
  });

  return (
    <>
      {/* Main Crystalline Spire Formation */}
      <group ref={mainGroupRef}>
        
        {/* Recursive Spire Structures */}
        {spireFormations.map((formation, index) => (
          <SpireStructure
            key={`spire-${index}`}
            formation={formation}
            color={color}
            materialConfig={materialConfig}
            onRef={(ref) => {
              if (ref) spireRefs.current[index] = ref;
            }}
          />
        ))}
        
        {/* Energy Field Web - connecting all spires */}
        <EnergyWeb color={color} materialConfig={materialConfig} />
      </group>

      {/* Floating Crystal Fragments */}
      {crystalFragments.map((fragment, index) => (
        <CrystalFragmentComponent
          key={`fragment-${index}`}
          fragment={fragment}
          color={color}
          materialConfig={materialConfig}
          onRef={(ref) => {
            if (ref) orbitalRefs.current[index] = ref;
          }}
        />
      ))}
    </>
  );
};

export default CrystallineSpireObject;
