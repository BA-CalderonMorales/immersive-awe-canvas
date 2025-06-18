
import { useRef, useMemo } from 'react';
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { useExperience } from '@/hooks/useExperience';
import { generateChaoticField } from './wobbleField/fieldGenerator';
import InstancedFieldElements from './wobbleField/InstancedFieldElements';

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
    
    // Create wobble field influence from mouse
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.3;
    
    if (groupRef.current) {
      // Main field wobble - slow, wave-like motion
      const wobbleSpeed = 0.4;
      const wobbleIntensity = 0.8 + mouseInfluence;
      
      groupRef.current.rotation.y += 0.003;
      groupRef.current.rotation.x = Math.sin(timeRef.current * wobbleSpeed) * 0.1 * wobbleIntensity;
      groupRef.current.rotation.z = Math.cos(timeRef.current * wobbleSpeed * 0.7) * 0.08 * wobbleIntensity;
      
      // Field breathing - the entire field pulses together
      const fieldPulse = 1 + Math.sin(timeRef.current * 0.6) * 0.15 + mouseInfluence * 0.1;
      groupRef.current.scale.setScalar(fieldPulse);
    }
  });

  return (
    <group ref={groupRef}>
      <InstancedFieldElements
        color={color}
        materialConfig={materialConfig}
        fieldData={fieldData}
        isLocked={isLocked}
      />
      
      {/* Central Wobble Core */}
      <mesh scale={0.8} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshWobbleMaterial
          color={color}
          speed={1.2}
          factor={0.4}
          transparent
          opacity={0.7}
          emissive={color}
          emissiveIntensity={theme === 'day' ? 0.1 : 0.2}
        />
      </mesh>
      
      {/* Wobble Field Layers */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 32, 24]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.8}
          factor={0.2}
          transparent
          opacity={theme === 'day' ? 0.15 : 0.25}
          wireframe
        />
      </mesh>
      
      {/* Outer Wobble Shell */}
      <mesh scale={1.6}>
        <sphereGeometry args={[1, 24, 16]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.5}
          factor={0.1}
          transparent
          opacity={theme === 'day' ? 0.08 : 0.12}
          wireframe
        />
      </mesh>
    </group>
  );
};

export default WobbleFieldObject;
