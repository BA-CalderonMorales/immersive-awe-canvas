
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
    
    // Gentle consciousness response to attention
    const awarenessInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.15;
    
    if (groupRef.current) {
      // Subtle, meditative field rotation
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.02;
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.2) * 0.015;
      
      // Gentle breathing response
      const breathingScale = 1 + Math.sin(timeRef.current * 0.4) * 0.02 + awarenessInfluence * 0.03;
      groupRef.current.scale.setScalar(breathingScale);
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
      
      {/* Central Mind Core - simplified */}
      <mesh scale={0.5} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.8}
          factor={0.1}
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={theme === 'day' ? 0.04 : 0.08}
        />
      </mesh>
      
      {/* Simplified Inner Layer */}
      <mesh scale={0.35}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={theme === 'day' ? 0.02 : 0.04}
        />
      </mesh>
    </group>
  );
};

export default WobbleFieldObject;
