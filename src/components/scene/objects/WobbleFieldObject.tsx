
import { useRef, useMemo } from 'react';
import { MeshWobbleMaterial } from '@react-three/drei';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { useExperience } from '@/hooks/useExperience';

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

  // Heartbeat function - creates a rhythmic pulse like a heartbeat
  const getHeartbeatPulse = (time: number) => {
    const heartbeatSpeed = 1.2; // BPM-like speed
    const t = time * heartbeatSpeed;
    
    // Create double-beat pattern like a real heartbeat (lub-dub)
    const beat1 = Math.exp(-((t % 2) - 0.2) * (t % 2) - 0.2) * 20) * 0.3;
    const beat2 = Math.exp(-((t % 2) - 0.5) * (t % 2) - 0.5) * 25) * 0.2;
    const baseline = Math.sin(t * Math.PI) * 0.1;
    
    return Math.max(0, beat1 + beat2 + baseline) + 0.8; // Ensure positive with baseline
  };

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    // Mouse influence creates gentle field distortion
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.2;
    
    if (groupRef.current) {
      // Gentle rotation for the entire field
      groupRef.current.rotation.y += 0.002;
      
      // Heartbeat pulse affects the entire field
      const heartbeat = getHeartbeatPulse(timeRef.current);
      const fieldPulse = heartbeat * (1 + mouseInfluence * 0.3);
      groupRef.current.scale.setScalar(fieldPulse);
      
      // Subtle breathing motion
      const breathe = Math.sin(timeRef.current * 0.3) * 0.05;
      groupRef.current.rotation.x = breathe;
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.25) * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Wobble Core - main heartbeat */}
      <mesh scale={0.8} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshWobbleMaterial
          color={color}
          speed={1.8} // Faster speed for more alive feeling
          factor={0.6} // Increased factor for more pronounced wobble
          transparent
          opacity={0.8}
          emissive={color}
          emissiveIntensity={theme === 'day' ? 0.15 : 0.3}
        />
      </mesh>
      
      {/* Inner Wobble Field Layer - synchronized heartbeat */}
      <mesh scale={1.2}>
        <sphereGeometry args={[1, 32, 24]} />
        <MeshWobbleMaterial
          color={color}
          speed={1.4} // Slightly different speed for layered effect
          factor={0.3}
          transparent
          opacity={theme === 'day' ? 0.2 : 0.35}
          wireframe
        />
      </mesh>
      
      {/* Outer Wobble Shell - gentle heartbeat resonance */}
      <mesh scale={1.6}>
        <sphereGeometry args={[1, 24, 16]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.8} // Slower, more gentle wobble
          factor={0.15}
          transparent
          opacity={theme === 'day' ? 0.1 : 0.18}
          wireframe
        />
      </mesh>
      
      {/* Outer Energy Field - very subtle heartbeat echo */}
      <mesh scale={2.2}>
        <sphereGeometry args={[1, 16, 12]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.4} // Very slow, like distant heartbeat
          factor={0.08}
          transparent
          opacity={theme === 'day' ? 0.05 : 0.1}
          wireframe
        />
      </mesh>
    </group>
  );
};

export default WobbleFieldObject;
