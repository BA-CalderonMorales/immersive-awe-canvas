
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
  isGrabMode: boolean; // unused but for API consistency
}

const WobbleFieldObject = ({ color, materialConfig, isLocked }: WobbleFieldObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const swarmRefs = useRef<Group[]>([]);
  const { mouse } = useThree();
  const { theme } = useExperience();
  const timeRef = useRef(0);

  // Generate swarm configuration
  const swarmConfig = useMemo(() => {
    const swarm = [];
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 8 + Math.random() * 6;
      const height = (Math.random() - 0.5) * 8;
      
      swarm.push({
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.4,
        speed: 0.8 + Math.random() * 0.6,
        geometry: Math.floor(Math.random() * 4), // 0: icosahedron, 1: octahedron, 2: dodecahedron, 3: tetrahedron
        phaseOffset: Math.random() * Math.PI * 2,
        orbitSpeed: 0.1 + Math.random() * 0.15
      });
    }
    return swarm;
  }, []);

  // Ultra-smooth, eerie heartbeat function
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

    // Animate swarm elements with individual heartbeats
    swarmRefs.current.forEach((swarmRef, index) => {
      if (!swarmRef) return;
      
      const config = swarmConfig[index];
      const swarmHeartbeat = getHeartbeatPulse(timeRef.current + config.phaseOffset);
      
      // Orbital motion around the center
      const orbitAngle = timeRef.current * config.orbitSpeed + config.phaseOffset;
      const baseRadius = Math.sqrt(config.position[0] ** 2 + config.position[2] ** 2);
      
      swarmRef.position.x = Math.cos(orbitAngle) * baseRadius;
      swarmRef.position.z = Math.sin(orbitAngle) * baseRadius;
      swarmRef.position.y = config.position[1] + Math.sin(timeRef.current * 0.3 + config.phaseOffset) * 0.5;
      
      // Individual heartbeat scaling
      const swarmPulse = swarmHeartbeat * config.scale * (0.8 + mouseInfluence * 0.3);
      swarmRef.scale.setScalar(swarmPulse);
      
      // Individual rotation
      swarmRef.rotation.x = timeRef.current * 0.2 + config.phaseOffset;
      swarmRef.rotation.y = timeRef.current * 0.15 + config.phaseOffset * 0.5;
      swarmRef.rotation.z = timeRef.current * 0.1 + config.phaseOffset * 0.3;
    });
  });

  const getGeometry = (type: number) => {
    switch (type) {
      case 0:
        return <icosahedronGeometry args={[1, 2]} />;
      case 1:
        return <octahedronGeometry args={[1, 0]} />;
      case 2:
        return <dodecahedronGeometry args={[1, 0]} />;
      case 3:
        return <tetrahedronGeometry args={[1, 0]} />;
      default:
        return <icosahedronGeometry args={[1, 2]} />;
    }
  };

  return (
    <>
      {/* Main Central Organism */}
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

      {/* Swarm of smaller organisms */}
      {swarmConfig.map((config, index) => (
        <group
          key={index}
          ref={(ref) => {
            if (ref) swarmRefs.current[index] = ref;
          }}
          position={config.position}
        >
          {/* Core of swarm element */}
          <mesh>
            {getGeometry(config.geometry)}
            <MeshWobbleMaterial
              color={color}
              speed={config.speed}
              factor={0.3}
              transparent
              opacity={0.6}
              emissive={color}
              emissiveIntensity={theme === 'day' ? 0.1 : 0.2}
            />
          </mesh>
          
          {/* Energy field around swarm element */}
          <mesh scale={1.5}>
            <sphereGeometry args={[1, 16, 12]} />
            <MeshWobbleMaterial
              color={color}
              speed={config.speed * 0.7}
              factor={0.15}
              transparent
              opacity={theme === 'day' ? 0.1 : 0.15}
              wireframe
            />
          </mesh>
        </group>
      ))}
    </>
  );
};

export default WobbleFieldObject;
