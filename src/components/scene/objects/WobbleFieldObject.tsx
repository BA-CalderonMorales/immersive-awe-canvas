
import { useRef, useMemo } from 'react';
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { generateChaoticField } from './wobbleField/fieldGenerator';
import InstancedFieldElements from './wobbleField/InstancedFieldElements';
import EnergyStreams from './wobbleField/EnergyStreams';
import PortalEffects from './wobbleField/PortalEffects';

interface WobbleFieldObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const WobbleFieldObject = ({ color, materialConfig, isLocked }: WobbleFieldObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const { mouse } = useThree();
  const timeRef = useRef(0);

  // Generate the contemplative field data
  const fieldData = useMemo(() => generateChaoticField(), []);

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    // Gentle mouse influence for contemplation
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.3;
    
    if (groupRef.current) {
      // Gentle, meditative field rotation
      groupRef.current.rotation.y += 0.001; // Much slower
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.1) * 0.05; // Gentler
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.08) * 0.03; // Subtler
      
      // Gentle scaling response to mouse
      groupRef.current.scale.setScalar(1 + mouseInfluence * 0.05);
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
      
      {/* Central Contemplative Core */}
      <mesh scale={0.6}> {/* Smaller, less dominant */}
        <icosahedronGeometry args={[1, 1]} /> {/* Less complex */}
        <MeshWobbleMaterial
          color={color}
          speed={2} // Much slower wobble
          factor={0.3} // Gentler wobble
          transparent
          opacity={0.7} // More transparent
          emissive={color}
          emissiveIntensity={0.1} // Subtle glow
        />
      </mesh>
      
      <EnergyStreams materialConfig={materialConfig} />
      
      <PortalEffects materialConfig={materialConfig} />
    </group>
  );
};

export default WobbleFieldObject;
