import { useRef, useMemo } from 'react';
import { MaterialConfig } from '@/types/scene';
import { useFrame, useThree } from '@react-three/fiber';
import { Group, DoubleSide } from 'three';
import { useSpireFormations } from './crystallineSpire/useSpireFormations';
import { useCrystalFragments } from './crystallineSpire/useCrystalFragments';
import { useExperience } from '@/hooks/useExperience';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import SpireStructure from './crystallineSpire/SpireStructure';
import CrystalFragmentComponent from './crystallineSpire/CrystalFragmentComponent';
import EnergyWeb from './crystallineSpire/EnergyWeb';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface CrystallineSpireObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
  isMotionFrozen?: boolean;
}

const CrystallineSpireObject = ({ color, materialConfig, isLocked, isMotionFrozen }: CrystallineSpireObjectProps) => {
  const mainGroupRef = useRef<Group>(null!);
  const spireRefs = useRef<Group[]>([]);
  const orbitalRefs = useRef<Group[]>([]);
  const { mouse } = useThree();
  const { theme } = useExperience();
  const { isDragEnabled } = useSceneObjectsContext();
  const timeRef = useRef(0);

  // Static formations and fragments - avoid recreating on theme change
  const spireFormations = useSpireFormations();
  const crystalFragments = useCrystalFragments();

  // Stable material config that doesn't cause re-renders on theme changes
  const stableMaterialConfig = useMemo(() => ({
    materialType: materialConfig.materialType || 'standard' as const,
    roughness: materialConfig.roughness || 0.5,
    metalness: materialConfig.metalness || 0.5,
    transparent: true,
    opacity: materialConfig.opacity || 0.9,
  }), [materialConfig.materialType, materialConfig.roughness, materialConfig.metalness, materialConfig.opacity]);

  // Gentle, meditative animation
  const getGentlePulse = (time: number) => {
    return Math.sin(time * 0.5) * 0.5 + 0.5;
  };

  useFrame((state) => {
    if (mainGroupRef.current?.userData.isBeingDragged) return;
    if (isLocked) return;
    if (isMotionFrozen) return;
    
    timeRef.current = state.clock.getElapsedTime();
    const mouseInfluence = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y) * 0.1;
    
    if (mainGroupRef.current) {
      // Slow, peaceful rotation
      mainGroupRef.current.rotation.y += 0.001;
      
      // Gentle breathing motion
      const pulse = getGentlePulse(timeRef.current);
      const scaleFactor = 0.9 + pulse * 0.1 + mouseInfluence * 0.1;
      mainGroupRef.current.scale.setScalar(scaleFactor);
      
      // Subtle floating
      mainGroupRef.current.position.y = Math.sin(timeRef.current * 0.2) * 0.05;
    }

    // Smooth satellite motion
    spireRefs.current.forEach((spireRef, index) => {
      if (!spireRef) return;
      
      const formation = spireFormations[index];
      if (!formation) return;
      
      if (formation.type === 'satellite') {
        const orbitAngle = timeRef.current * formation.orbitSpeed! + formation.phaseOffset!;
        const baseRadius = Math.sqrt(formation.position[0] ** 2 + formation.position[2] ** 2);
        
        spireRef.position.x = Math.cos(orbitAngle) * baseRadius;
        spireRef.position.z = Math.sin(orbitAngle) * baseRadius;
        spireRef.position.y = formation.position[1] + Math.sin(timeRef.current * 0.3 + formation.phaseOffset!) * 0.1;
      }
      
      // Gentle scaling
      const spireP = getGentlePulse(timeRef.current + index * 0.3);
      const spireScale = formation.scale * (0.9 + spireP * 0.2);
      spireRef.scale.setScalar(spireScale);
      
      // Minimal rotation
      spireRef.rotation.x = formation.rotation + timeRef.current * 0.05;
    });

    // Graceful fragment motion
    orbitalRefs.current.forEach((orbitalRef, index) => {
      if (!orbitalRef) return;
      
      const fragment = crystalFragments[index];
      if (!fragment) return;
      
      const orbitAngle = timeRef.current * fragment.orbitSpeed + fragment.phaseOffset;
      orbitalRef.position.x = Math.cos(orbitAngle) * fragment.orbitRadius;
      orbitalRef.position.z = Math.sin(orbitAngle) * fragment.orbitRadius;
      
      orbitalRef.position.y = fragment.position[1] + 
        Math.sin(timeRef.current * 0.4 + fragment.floatOffset) * 0.5;
      
      orbitalRef.rotation.x += fragment.rotationSpeed[0];
      orbitalRef.rotation.y += fragment.rotationSpeed[1];
      orbitalRef.rotation.z += fragment.rotationSpeed[2];
      
      const fragmentPulse = getGentlePulse(timeRef.current + fragment.phaseOffset);
      orbitalRef.scale.setScalar(fragment.scale * (0.9 + fragmentPulse * 0.2));
    });
  });

  return (
    <>
      <group ref={mainGroupRef} name={MAIN_OBJECT_NAME}>
        {spireFormations.map((formation, index) => (
          <SpireStructure
            key={index}
            formation={formation}
            color={color}
            materialConfig={stableMaterialConfig}
            theme={theme}
            onRef={(ref) => {
              if (ref) spireRefs.current[index] = ref;
            }}
          />
        ))}
        
        <EnergyWeb 
          color={color}
          materialConfig={stableMaterialConfig}
        />

        {isDragEnabled && (
          <mesh>
            <sphereGeometry args={[6, 32, 16]} />
            <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.3} side={DoubleSide} />
          </mesh>
        )}
      </group>

      {crystalFragments.map((fragment, index) => (
        <CrystalFragmentComponent
          key={index}
          fragment={fragment}
          color={color}
          materialConfig={stableMaterialConfig}
          onRef={(ref) => {
            if (ref) orbitalRefs.current[index] = ref;
          }}
        />
      ))}
    </>
  );
};

export default CrystallineSpireObject;