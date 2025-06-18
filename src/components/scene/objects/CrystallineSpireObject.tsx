
import { useRef, useMemo } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { Group } from 'three';
import { useExperience } from '@/hooks/useExperience';
import DynamicMaterial from '../materials/DynamicMaterial';

interface CrystallineSpireObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const CrystallineSpireObject = ({ color, materialConfig, isLocked }: CrystallineSpireObjectProps) => {
  const groupRef = useRef<Group>(null!);
  const swarmRefs = useRef<Group[]>([]);
  const { mouse } = useThree();
  const { theme } = useExperience();
  const timeRef = useRef(0);

  // Generate crystal swarm configuration
  const crystalSwarmConfig = useMemo(() => {
    const swarm = [];
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const radius = 6 + Math.random() * 8;
      const height = (Math.random() - 0.5) * 12;
      
      swarm.push({
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: 0.2 + Math.random() * 0.3,
        speed: 0.6 + Math.random() * 0.4,
        geometry: Math.floor(Math.random() * 3), // 0: octahedron, 1: diamond, 2: crystal
        phaseOffset: Math.random() * Math.PI * 2,
        orbitSpeed: 0.08 + Math.random() * 0.12
      });
    }
    return swarm;
  }, []);

  // Ultra-smooth crystalline pulse function
  const getCrystallinePulse = (time: number) => {
    const pulseSpeed = 0.6; // Slower, more mystical speed
    const t = time * pulseSpeed;
    
    // Create smooth crystalline energy pulses
    const mainPulse = Math.exp(-Math.pow((t % 4) - 1.2, 2) * 6) * 0.5; // Main energy surge
    const echoPulse = Math.exp(-Math.pow((t % 4) - 2.8, 2) * 8) * 0.3; // Echo pulse
    const ambientFlow = Math.sin(t * Math.PI * 0.4) * 0.12; // Gentle ambient flow
    const crystallineResonance = Math.sin(t * Math.PI * 0.7) * 0.08; // Higher frequency resonance
    
    return Math.max(0.75, mainPulse + echoPulse + ambientFlow + crystallineResonance + 0.9); // Smooth positive range
  };

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    
    // Mouse influence creates energy field distortion
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.18;
    
    if (groupRef.current) {
      // Very gentle rotation for crystalline formation
      groupRef.current.rotation.y += 0.0015;
      
      // Smooth crystalline pulse affects the entire structure
      const crystalPulse = getCrystallinePulse(timeRef.current);
      const fieldPulse = crystalPulse * (1 + mouseInfluence * 0.25);
      groupRef.current.scale.setScalar(fieldPulse);
      
      // Subtle crystalline resonance motion
      const resonance = Math.sin(timeRef.current * 0.2) * 0.04;
      groupRef.current.rotation.x = resonance;
      groupRef.current.rotation.z = Math.cos(timeRef.current * 0.15) * 0.025;
    }

    // Animate crystal swarm elements
    swarmRefs.current.forEach((swarmRef, index) => {
      if (!swarmRef) return;
      
      const config = crystalSwarmConfig[index];
      const swarmPulse = getCrystallinePulse(timeRef.current + config.phaseOffset);
      
      // Orbital motion around the spire
      const orbitAngle = timeRef.current * config.orbitSpeed + config.phaseOffset;
      const baseRadius = Math.sqrt(config.position[0] ** 2 + config.position[2] ** 2);
      
      swarmRef.position.x = Math.cos(orbitAngle) * baseRadius;
      swarmRef.position.z = Math.sin(orbitAngle) * baseRadius;
      swarmRef.position.y = config.position[1] + Math.sin(timeRef.current * 0.25 + config.phaseOffset) * 0.8;
      
      // Individual crystalline pulse scaling
      const crystalScale = swarmPulse * config.scale * (0.7 + mouseInfluence * 0.4);
      swarmRef.scale.setScalar(crystalScale);
      
      // Individual crystal rotation
      swarmRef.rotation.x = timeRef.current * 0.15 + config.phaseOffset;
      swarmRef.rotation.y = timeRef.current * 0.18 + config.phaseOffset * 0.6;
      swarmRef.rotation.z = timeRef.current * 0.12 + config.phaseOffset * 0.4;
    });
  });

  const getCrystalGeometry = (type: number) => {
    switch (type) {
      case 0:
        return <octahedronGeometry args={[1, 0]} />;
      case 1:
        return <coneGeometry args={[0.6, 2, 8]} />;
      case 2:
        return <cylinderGeometry args={[0.3, 0.8, 1.8, 6]} />;
      default:
        return <octahedronGeometry args={[1, 0]} />;
    }
  };

  return (
    <>
      {/* Main Crystalline Spire Formation */}
      <group ref={groupRef}>
        {/* Central Spire Core */}
        <mesh scale={1.0} position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[1.5, 6, 8]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: 0.85,
              emissive: color,
              emissiveIntensity: theme === 'day' ? 0.3 : 0.5
            }}
            color={color}
          />
        </mesh>
        
        {/* Secondary Spire Layer */}
        <mesh scale={1.2} position={[0, 1, 0]} rotation={[0, Math.PI / 8, 0]}>
          <coneGeometry args={[1.2, 4.5, 6]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: theme === 'day' ? 0.4 : 0.6,
              wireframe: true
            }}
            color={color}
          />
        </mesh>
        
        {/* Tertiary Crystal Formation */}
        <mesh scale={1.5} position={[0, -0.5, 0]} rotation={[0, Math.PI / 6, 0]}>
          <coneGeometry args={[1.0, 3.5, 6]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: theme === 'day' ? 0.25 : 0.4,
              wireframe: true
            }}
            color={color}
          />
        </mesh>
        
        {/* Base Crystal Platform */}
        <mesh scale={2.0} position={[0, -2, 0]}>
          <cylinderGeometry args={[2, 1.5, 1, 8]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: theme === 'day' ? 0.2 : 0.35,
              wireframe: true
            }}
            color={color}
          />
        </mesh>
        
        {/* Energy Field Rings */}
        <mesh scale={3.2} position={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.15, 16, 32]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: theme === 'day' ? 0.15 : 0.25,
              wireframe: true
            }}
            color={color}
          />
        </mesh>
        
        <mesh scale={4.5} position={[0, 1.5, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[2.8, 0.12, 12, 24]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: theme === 'day' ? 0.1 : 0.18,
              wireframe: true
            }}
            color={color}
          />
        </mesh>
        
        {/* Outer Resonance Field */}
        <mesh scale={6.0} position={[0, -1, 0]} rotation={[0, 0, Math.PI / 6]}>
          <torusGeometry args={[3.2, 0.08, 8, 16]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: theme === 'day' ? 0.06 : 0.12,
              wireframe: true
            }}
            color={color}
          />
        </mesh>
        
        {/* Extended Energy Aura */}
        <mesh scale={8.0} position={[0, 0.5, 0]}>
          <torusGeometry args={[3.8, 0.05, 6, 12]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              transparent: true,
              opacity: theme === 'day' ? 0.03 : 0.08,
              wireframe: true
            }}
            color={color}
          />
        </mesh>
      </group>

      {/* Swarm of Crystal Satellites */}
      {crystalSwarmConfig.map((config, index) => (
        <group
          key={index}
          ref={(ref) => {
            if (ref) swarmRefs.current[index] = ref;
          }}
          position={config.position}
        >
          {/* Core crystal satellite */}
          <mesh>
            {getCrystalGeometry(config.geometry)}
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.7,
                emissive: color,
                emissiveIntensity: theme === 'day' ? 0.15 : 0.25
              }}
              color={color}
            />
          </mesh>
          
          {/* Energy field around crystal */}
          <mesh scale={1.8}>
            <octahedronGeometry args={[1, 0]} />
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: theme === 'day' ? 0.12 : 0.2,
                wireframe: true
              }}
              color={color}
            />
          </mesh>
        </group>
      ))}
    </>
  );
};

export default CrystallineSpireObject;
