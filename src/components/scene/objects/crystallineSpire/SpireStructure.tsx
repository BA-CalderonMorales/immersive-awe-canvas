
import { useRef } from 'react';
import { Group } from 'three';
import { MaterialConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import DynamicMaterial from '../../materials/DynamicMaterial';
import { SpireFormation } from './useSpireFormations';

interface SpireStructureProps {
  formation: SpireFormation;
  color: string;
  materialConfig: MaterialConfig;
  onRef: (ref: Group | null) => void;
}

const SpireStructure = ({ formation, color, materialConfig, onRef }: SpireStructureProps) => {
  const { theme } = useExperience();

  return (
    <group
      ref={onRef}
      position={formation.position}
      rotation={[0, formation.rotation, 0]}
    >
      {/* Clean, minimalist spire body */}
      <mesh position={[0, formation.height / 2, 0]}>
        <cylinderGeometry args={[formation.radius * 0.2, formation.radius, formation.height, formation.segments]} />
        <DynamicMaterial
          materialConfig={{
            ...materialConfig,
            transparent: true,
            opacity: formation.type === 'main' ? 0.9 : 0.7,
            emissive: color,
            emissiveIntensity: theme === 'day' ? 0.1 : 0.3,
            wireframe: false
          }}
          color={color}
        />
      </mesh>
      
      {/* Simple crystal tip */}
      <mesh position={[0, formation.height, 0]}>
        <coneGeometry args={[formation.radius * 0.3, formation.height * 0.4, formation.segments]} />
        <DynamicMaterial
          materialConfig={{
            ...materialConfig,
            transparent: true,
            opacity: 0.95,
            emissive: color,
            emissiveIntensity: theme === 'day' ? 0.2 : 0.5
          }}
          color={color}
        />
      </mesh>
      
      {/* Single energy ring only for main spire */}
      {formation.type === 'main' && (
        <mesh position={[0, formation.height * 0.7, 0]}>
          <torusGeometry args={[formation.radius * 1.5, formation.radius * 0.05, 8, 16]} />
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
      )}
    </group>
  );
};

export default SpireStructure;
