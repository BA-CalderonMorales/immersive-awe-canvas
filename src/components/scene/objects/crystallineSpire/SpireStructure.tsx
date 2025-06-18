
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
  );
};

export default SpireStructure;
