
import { useRef, useMemo } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import { useExperience } from '@/hooks/useExperience';
import DynamicMaterial from '../materials/DynamicMaterial';

interface CrystallineSpireObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const CrystallineSpireObject = ({ color, materialConfig, isLocked }: CrystallineSpireObjectProps) => {
  const mainGroupRef = useRef<Group>(null!);
  const spireRefs = useRef<Group[]>([]);
  const orbitalRefs = useRef<Group[]>([]);
  const { mouse } = useThree();
  const { theme } = useExperience();
  const timeRef = useRef(0);

  // Generate recursive spire formations
  const spireFormations = useMemo(() => {
    const formations = [];
    
    // Main central spires with different heights and rotations
    for (let level = 0; level < 5; level++) {
      const height = 8 - level * 1.2;
      const radius = 0.8 + level * 0.3;
      const segments = 8 - level;
      
      formations.push({
        position: [0, level * 1.5, 0] as [number, number, number],
        height,
        radius,
        segments,
        rotation: level * Math.PI / 4,
        scale: 1 - level * 0.15,
        type: 'main'
      });
    }
    
    // Recursive satellite spires
    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = 4 + ring * 2;
      const spireCount = 6 + ring * 2;
      
      for (let i = 0; i < spireCount; i++) {
        const angle = (i / spireCount) * Math.PI * 2;
        const x = Math.cos(angle) * ringRadius;
        const z = Math.sin(angle) * ringRadius;
        const y = Math.sin(angle * 3) * 0.5;
        
        formations.push({
          position: [x, y, z] as [number, number, number],
          height: 3 - ring * 0.5,
          radius: 0.3 + ring * 0.1,
          segments: 6,
          rotation: angle + ring * 0.5,
          scale: 0.7 - ring * 0.2,
          type: 'satellite',
          orbitSpeed: 0.1 + ring * 0.05,
          phaseOffset: i * 0.3
        });
      }
    }
    
    return formations;
  }, []);

  // Generate floating crystal fragments
  const crystalFragments = useMemo(() => {
    const fragments = [];
    
    for (let i = 0; i < 24; i++) {
      const radius = 8 + Math.random() * 6;
      const angle = (i / 24) * Math.PI * 2;
      const height = (Math.random() - 0.5) * 8;
      
      fragments.push({
        position: [
          Math.cos(angle) * radius + (Math.random() - 0.5) * 2,
          height,
          Math.sin(angle) * radius + (Math.random() - 0.5) * 2
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.4,
        geometry: Math.floor(Math.random() * 4), // Different crystal shapes
        rotationSpeed: [
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ] as [number, number, number],
        orbitRadius: radius,
        orbitSpeed: 0.05 + Math.random() * 0.1,
        phaseOffset: Math.random() * Math.PI * 2,
        floatOffset: Math.random() * Math.PI * 2
      });
    }
    
    return fragments;
  }, []);

  // Enhanced energy pulse function with recursive patterns
  const getRecursivePulse = (time: number, depth: number = 0) => {
    const baseFreq = 0.8;
    const pulse = Math.sin(time * baseFreq) * 0.5 + 0.5;
    
    if (depth > 0) {
      const subPulse = getRecursivePulse(time * 1.618, depth - 1) * 0.3;
      return pulse + subPulse;
    }
    
    return pulse;
  };

  useFrame((state) => {
    if (isLocked) return;
    
    timeRef.current = state.clock.getElapsedTime();
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.2;
    
    if (mainGroupRef.current) {
      // Slow mystical rotation
      mainGroupRef.current.rotation.y += 0.002;
      
      // Recursive pulse effect
      const mainPulse = getRecursivePulse(timeRef.current, 2);
      const scaleFactor = 0.8 + mainPulse * 0.3 + mouseInfluence * 0.2;
      mainGroupRef.current.scale.setScalar(scaleFactor);
      
      // Subtle breathing motion
      mainGroupRef.current.position.y = Math.sin(timeRef.current * 0.3) * 0.1;
    }

    // Animate spire formations
    spireRefs.current.forEach((spireRef, index) => {
      if (!spireRef) return;
      
      const formation = spireFormations[index];
      if (!formation) return;
      
      if (formation.type === 'satellite') {
        // Orbital motion for satellite spires
        const orbitAngle = timeRef.current * formation.orbitSpeed + formation.phaseOffset;
        const baseRadius = Math.sqrt(formation.position[0] ** 2 + formation.position[2] ** 2);
        
        spireRef.position.x = Math.cos(orbitAngle) * baseRadius;
        spireRef.position.z = Math.sin(orbitAngle) * baseRadius;
        spireRef.position.y = formation.position[1] + Math.sin(timeRef.current * 0.4 + formation.phaseOffset) * 0.3;
      }
      
      // Individual spire pulse
      const spireP = getRecursivePulse(timeRef.current + index * 0.2, 1);
      const spireScale = formation.scale * (0.7 + spireP * 0.4);
      spireRef.scale.setScalar(spireScale);
      
      // Rotation animation
      spireRef.rotation.x = formation.rotation + timeRef.current * 0.1;
      spireRef.rotation.z = Math.sin(timeRef.current * 0.15 + index) * 0.1;
    });

    // Animate crystal fragments
    orbitalRefs.current.forEach((orbitalRef, index) => {
      if (!orbitalRef) return;
      
      const fragment = crystalFragments[index];
      if (!fragment) return;
      
      // Orbital motion
      const orbitAngle = timeRef.current * fragment.orbitSpeed + fragment.phaseOffset;
      orbitalRef.position.x = Math.cos(orbitAngle) * fragment.orbitRadius;
      orbitalRef.position.z = Math.sin(orbitAngle) * fragment.orbitRadius;
      
      // Floating motion
      orbitalRef.position.y = fragment.position[1] + 
        Math.sin(timeRef.current * 0.5 + fragment.floatOffset) * 1.2;
      
      // Individual rotation
      orbitalRef.rotation.x += fragment.rotationSpeed[0];
      orbitalRef.rotation.y += fragment.rotationSpeed[1];
      orbitalRef.rotation.z += fragment.rotationSpeed[2];
      
      // Pulse scaling
      const fragmentPulse = getRecursivePulse(timeRef.current + fragment.phaseOffset, 0);
      orbitalRef.scale.setScalar(fragment.scale * (0.8 + fragmentPulse * 0.3));
    });
  });

  const getCrystalGeometry = (type: number) => {
    switch (type) {
      case 0:
        return <octahedronGeometry args={[1, 2]} />;
      case 1:
        return <tetrahedronGeometry args={[1, 1]} />;
      case 2:
        return <icosahedronGeometry args={[1, 1]} />;
      case 3:
        return <dodecahedronGeometry args={[1, 2]} />;
      default:
        return <octahedronGeometry args={[1, 1]} />;
    }
  };

  return (
    <>
      {/* Main Crystalline Spire Formation */}
      <group ref={mainGroupRef}>
        
        {/* Recursive Spire Structures */}
        {spireFormations.map((formation, index) => (
          <group
            key={`spire-${index}`}
            ref={(ref) => {
              if (ref) spireRefs.current[index] = ref;
            }}
            position={formation.position}
            rotation={[0, formation.rotation, 0]}
          >
            {/* Main spire body - crystalline tower */}
            <mesh position={[0, formation.height / 2, 0]}>
              <cylinderGeometry args={[formation.radius * 0.3, formation.radius, formation.height, formation.segments]} />
              <DynamicMaterial
                materialConfig={{
                  ...materialConfig,
                  transparent: true,
                  opacity: formation.type === 'main' ? 0.8 : 0.6,
                  emissive: color,
                  emissiveIntensity: theme === 'day' ? 0.2 : 0.4
                }}
                color={color}
              />
            </mesh>
            
            {/* Spire tip - sharp crystal point */}
            <mesh position={[0, formation.height, 0]}>
              <coneGeometry args={[formation.radius * 0.4, formation.height * 0.3, formation.segments]} />
              <DynamicMaterial
                materialConfig={{
                  ...materialConfig,
                  transparent: true,
                  opacity: 0.9,
                  emissive: color,
                  emissiveIntensity: theme === 'day' ? 0.3 : 0.6
                }}
                color={color}
              />
            </mesh>
            
            {/* Crystal formation rings */}
            {[0.3, 0.6, 0.9].map((heightRatio, ringIndex) => (
              <mesh
                key={`ring-${ringIndex}`}
                position={[0, formation.height * heightRatio, 0]}
                rotation={[0, ringIndex * Math.PI / 3, 0]}
              >
                <torusGeometry args={[formation.radius * 1.2, formation.radius * 0.1, 8, 16]} />
                <DynamicMaterial
                  materialConfig={{
                    ...materialConfig,
                    transparent: true,
                    opacity: theme === 'day' ? 0.2 : 0.4,
                    wireframe: true
                  }}
                  color={color}
                />
              </mesh>
            ))}
            
            {/* Base crystal cluster */}
            {formation.type === 'main' && (
              <group position={[0, -formation.height * 0.1, 0]}>
                {Array.from({ length: formation.segments }, (_, i) => {
                  const angle = (i / formation.segments) * Math.PI * 2;
                  const x = Math.cos(angle) * formation.radius * 0.8;
                  const z = Math.sin(angle) * formation.radius * 0.8;
                  return (
                    <mesh key={i} position={[x, 0, z]} rotation={[0, angle, 0]}>
                      <coneGeometry args={[formation.radius * 0.2, formation.height * 0.4, 6]} />
                      <DynamicMaterial
                        materialConfig={{
                          ...materialConfig,
                          transparent: true,
                          opacity: 0.6,
                          wireframe: true
                        }}
                        color={color}
                      />
                    </mesh>
                  );
                })}
              </group>
            )}
          </group>
        ))}
        
        {/* Energy Field Web - connecting all spires */}
        <group>
          {Array.from({ length: 8 }, (_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = 12;
            return (
              <mesh
                key={`energy-web-${i}`}
                position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}
                rotation={[0, angle, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.02, 0.02, radius * 2, 8]} />
                <DynamicMaterial
                  materialConfig={{
                    ...materialConfig,
                    transparent: true,
                    opacity: theme === 'day' ? 0.1 : 0.2,
                    emissive: color,
                    emissiveIntensity: 0.8
                  }}
                  color={color}
                />
              </mesh>
            );
          })}
        </group>
      </group>

      {/* Floating Crystal Fragments */}
      {crystalFragments.map((fragment, index) => (
        <group
          key={`fragment-${index}`}
          ref={(ref) => {
            if (ref) orbitalRefs.current[index] = ref;
          }}
          position={fragment.position}
        >
          {/* Main crystal fragment */}
          <mesh>
            {getCrystalGeometry(fragment.geometry)}
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: 0.7,
                emissive: color,
                emissiveIntensity: theme === 'day' ? 0.1 : 0.3
              }}
              color={color}
            />
          </mesh>
          
          {/* Energy aura around fragment */}
          <mesh scale={1.5}>
            <octahedronGeometry args={[1, 0]} />
            <DynamicMaterial
              materialConfig={{
                ...materialConfig,
                transparent: true,
                opacity: theme === 'day' ? 0.05 : 0.15,
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
