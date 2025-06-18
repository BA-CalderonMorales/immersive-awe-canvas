
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

  // Generate the philosophical field data
  const fieldData = useMemo(() => generateChaoticField(), []);

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    // Consciousness responds to attention (mouse as focus of awareness)
    const awarenessInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.2;
    
    if (groupRef.current) {
      // Deep, meditative field rotation - like the slow turn of contemplation
      groupRef.current.rotation.y += 0.0008; // Even slower for deeper thought
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.08) * 0.03; // Minimal tilt
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.06) * 0.02; // Subtle sway
      
      // Breathing response to consciousness
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
      
      {/* Central Mind Core - the seat of consciousness */}
      <mesh scale={0.5} position={[0, 0, 0]}> {/* Smaller, more humble presence */}
        <icosahedronGeometry args={[1, 2]} /> {/* Higher complexity for deeper thought */}
        <MeshWobbleMaterial
          color={color}
          speed={1.5} // Slower wobble for deep contemplation
          factor={0.2} // Very gentle wobble
          transparent
          opacity={0.6} // More transparent to suggest the ethereal nature of mind
          emissive={color}
          emissiveIntensity={0.08} // Subtle inner light
        />
      </mesh>
      
      {/* Subtle Inner Glow - representing inner awareness */}
      <mesh scale={0.45}>
        <sphereGeometry args={[1, 16, 12]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.05}
        />
      </mesh>
      
      <EnergyStreams materialConfig={materialConfig} />
      
      <PortalEffects materialConfig={materialConfig} />
    </group>
  );
};

export default WobbleFieldObject;
