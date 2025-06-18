
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

  // Generate the chaotic field data
  const fieldData = useMemo(() => generateChaoticField(), []);

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    // Calculate mouse influence here where it's used
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
    
    if (groupRef.current) {
      // Master field rotation with chaotic wobbles
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.3) * 0.2;
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.2) * 0.1;
      
      // Mouse creates dimensional distortions
      groupRef.current.scale.setScalar(1 + mouseInfluence * 0.1);
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
      
      {/* Central Interdimensional Core */}
      <mesh scale={0.8}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshWobbleMaterial
          color={color}
          speed={8}
          factor={1.2}
          transparent
          opacity={0.9}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
      
      <EnergyStreams materialConfig={materialConfig} />
      
      <PortalEffects materialConfig={materialConfig} />
    </group>
  );
};

export default WobbleFieldObject;
