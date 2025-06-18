
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

  // Smooth, eerie heartbeat function - creates a rhythmic pulse like a living organism
  const getHeartbeatPulse = (time: number) => {
    const heartbeatSpeed = 0.8; // Slower, more eerie speed
    const t = time * heartbeatSpeed;
    
    // Create smooth double-beat pattern with organic feel
    const beat1 = Math.exp(-Math.pow((t % 3) - 0.3, 2) * 8) * 0.4; // Primary beat
    const beat2 = Math.exp(-Math.pow((t % 3) - 0.8, 2) * 12) * 0.25; // Secondary beat
    const organicFlow = Math.sin(t * Math.PI * 0.5) * 0.15; // Smooth baseline flow
    const breathing = Math.sin(t * Math.PI * 0.3) * 0.08; // Gentle breathing
    
    return Math.max(0.7, beat1 + beat2 + organicFlow + breathing + 0.85); // Smooth positive range
  };

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    // Mouse influence creates gentle field distortion
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.15;
    
    if (groupRef.current) {
      // Very gentle rotation for the entire field
      groupRef.current.rotation.y += 0.001;
      
      // Smooth heartbeat pulse affects the entire field
      const heartbeat = getHeartbeatPulse(timeRef.current);
      const fieldPulse = heartbeat * (1 + mouseInfluence * 0.2);
      groupRef.current.scale.setScalar(fieldPulse);
      
      // Subtle organic breathing motion
      const breathe = Math.sin(timeRef.current * 0.25) * 0.03;
      groupRef.current.rotation.x = breathe;
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.18) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core - the heart of the organism */}
      <mesh scale={1.0} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1.2, 4]} />
        <MeshWobbleMaterial
          color={color}
          speed={1.2} 
          factor={0.4} 
          transparent
          opacity={0.9}
          emissive={color}
          emissiveIntensity={theme === 'day' ? 0.2 : 0.4}
        />
      </mesh>
      
      {/* Inner Energy Layer */}
      <mesh scale={1.8}>
        <sphereGeometry args={[1.2, 32, 24]} />
        <MeshWobbleMaterial
          color={color}
          speed={1.0}
          factor={0.25}
          transparent
          opacity={theme === 'day' ? 0.25 : 0.4}
          wireframe
        />
      </mesh>
      
      {/* Mid Energy Shell */}
      <mesh scale={2.6}>
        <sphereGeometry args={[1.2, 28, 20]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.7}
          factor={0.18}
          transparent
          opacity={theme === 'day' ? 0.15 : 0.25}
          wireframe
        />
      </mesh>
      
      {/* Outer Resonance Field */}
      <mesh scale={3.8}>
        <sphereGeometry args={[1.2, 24, 16]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.5}
          factor={0.12}
          transparent
          opacity={theme === 'day' ? 0.08 : 0.15}
          wireframe
        />
      </mesh>
      
      {/* Extended Aura Field */}
      <mesh scale={5.2}>
        <sphereGeometry args={[1.2, 20, 14]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.3}
          factor={0.08}
          transparent
          opacity={theme === 'day' ? 0.04 : 0.08}
          wireframe
        />
      </mesh>
      
      {/* Distant Echo Field */}
      <mesh scale={7.0}>
        <sphereGeometry args={[1.2, 16, 12]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.2}
          factor={0.05}
          transparent
          opacity={theme === 'day' ? 0.02 : 0.05}
          wireframe
        />
      </mesh>
      
      {/* Ethereal Boundary */}
      <mesh scale={9.0}>
        <sphereGeometry args={[1.2, 12, 10]} />
        <MeshWobbleMaterial
          color={color}
          speed={0.15}
          factor={0.03}
          transparent
          opacity={theme === 'day' ? 0.01 : 0.03}
          wireframe
        />
      </mesh>
    </group>
  );
};

export default WobbleFieldObject;
