
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
      {/* Main spire body with crystal facets */}
      <mesh position={[0, formation.height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[formation.radius * 0.15, formation.radius * 0.8, formation.height, formation.segments * 2]} />
        <DynamicMaterial
          materialConfig={{
            ...materialConfig,
            materialType: 'physical',
            transparent: true,
            opacity: formation.type === 'main' ? 0.9 : 0.8,
            roughness: 0.1,
            metalness: 0.3,
            clearcoat: 0.9,
            clearcoatRoughness: 0.05,
            emissive: color,
            emissiveIntensity: theme === 'day' ? 0.15 : 0.35,
            ior: 1.6
          }}
          color={color}
        />
      </mesh>
      
      {/* Crystal tip with multiple facets */}
      <mesh position={[0, formation.height, 0]} castShadow>
        <coneGeometry args={[formation.radius * 0.4, formation.height * 0.5, formation.segments * 2]} />
        <DynamicMaterial
          materialConfig={{
            ...materialConfig,
            materialType: 'physical',
            transparent: true,
            opacity: 0.95,
            roughness: 0.05,
            metalness: 0.1,
            clearcoat: 1.0,
            clearcoatRoughness: 0.0,
            emissive: color,
            emissiveIntensity: theme === 'day' ? 0.3 : 0.6,
            ior: 1.8
          }}
          color={color}
        />
      </mesh>
      
      {/* Crystal base platform */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[formation.radius * 1.2, formation.radius * 1.0, formation.height * 0.1, formation.segments * 3]} />
        <DynamicMaterial
          materialConfig={{
            ...materialConfig,
            materialType: 'physical',
            transparent: true,
            opacity: 0.7,
            roughness: 0.2,
            metalness: 0.8,
            emissive: color,
            emissiveIntensity: theme === 'day' ? 0.1 : 0.2
          }}
          color={color}
        />
      </mesh>
      
      {/* Energy ring only for main spire */}
      {formation.type === 'main' && (
        <mesh position={[0, formation.height * 0.7, 0]}>
          <torusGeometry args={[formation.radius * 1.5, formation.radius * 0.08, 16, 32]} />
          <DynamicMaterial
            materialConfig={{
              ...materialConfig,
              materialType: 'basic',
              transparent: true,
              opacity: theme === 'day' ? 0.6 : 0.8,
              emissive: color,
              emissiveIntensity: theme === 'day' ? 0.8 : 1.2
            }}
            color={color}
          />
        </mesh>
      )}
    </group>
  );
};

export default SpireStructure;
