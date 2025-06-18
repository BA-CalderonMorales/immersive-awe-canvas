
import { useRef, useMemo } from 'react';
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { useExperience } from '@/hooks/useExperience';
import { generateChaoticField } from './wobbleField/fieldGenerator';
import InstancedFieldElements from './wobbleField/InstancedFieldElements';
import EnergyStreams from './wobbleField/EnergyStreams';
import PortalEffects from './wobbleField/PortalEffects';
import AtmosphericParticles from '../effects/AtmosphericParticles';
import EnergyField from '../effects/EnergyField';

interface WobbleFieldObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const WobbleFieldObject = ({ color, materialConfig, isLocked }: WobbleFieldObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const { mouse } = useThree();
  const { theme } = useExperience();
  const timeRef = useRef(0);

  // Generate the philosophical field data
  const fieldData = useMemo(() => generateChaoticField(), []);

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    // Enhanced consciousness response to attention (mouse as focus of awareness)
    const awarenessInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.3;
    
    if (groupRef.current) {
      // Deep, meditative field rotation - like the slow turn of contemplation
      groupRef.current.rotation.y += 0.0006; // Even slower for deeper thought
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.06) * 0.04; // Subtle tilt
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.04) * 0.03; // Gentle sway
      
      // Enhanced breathing response to consciousness with atmospheric influence
      const breathingScale = 1 + Math.sin(timeRef.current * 0.3) * 0.03 + awarenessInfluence * 0.05;
      const atmosphericPulse = 1 + Math.sin(timeRef.current * 0.15) * 0.01; // Slower atmospheric rhythm
      groupRef.current.scale.setScalar(breathingScale * atmosphericPulse);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Atmospheric Effects */}
      <AtmosphericParticles theme={theme} count={150} />
      <EnergyField theme={theme} />
      
      <InstancedFieldElements
        color={color}
        materialConfig={materialConfig}
        fieldData={fieldData}
        isLocked={isLocked}
      />
      
      {/* Enhanced Central Mind Core - the seat of consciousness */}
      <mesh scale={0.45} position={[0, 0, 0]}> {/* Slightly smaller for subtlety */}
        <icosahedronGeometry args={[1, 3]} /> {/* Higher complexity for deeper thought */}
        <MeshWobbleMaterial
          color={color}
          speed={1.2} // Slower wobble for deep contemplation
          factor={0.15} // Very gentle wobble
          transparent
          opacity={0.7} // Slightly more visible
          emissive={color}
          emissiveIntensity={theme === 'day' ? 0.06 : 0.12} // Theme-responsive glow
        />
      </mesh>
      
      {/* Enhanced Inner Awareness Layers */}
      <mesh scale={0.4}>
        <sphereGeometry args={[1, 20, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={theme === 'day' ? 0.03 : 0.06}
        />
      </mesh>
      
      {/* Outer Consciousness Field */}
      <mesh scale={0.6}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={theme === 'day' ? 0.02 : 0.04}
          wireframe
        />
      </mesh>
      
      <EnergyStreams materialConfig={materialConfig} />
      
      <PortalEffects materialConfig={materialConfig} />
    </group>
  );
};

export default WobbleFieldObject;
