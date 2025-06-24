
import { MaterialConfig } from '@/types/scene';
import { useExperience } from '@/hooks/useExperience';
import DynamicMaterial from '../../materials/DynamicMaterial';
import { CrystalFragment } from './useCrystalFragments';
import { Group } from 'three';

interface CrystalFragmentProps {
  fragment: CrystalFragment;
  color: string;
  materialConfig: MaterialConfig;
  onRef: (ref: Group | null) => void;
}

const getCrystalGeometryComponent = (type: number) => {
  switch (type) {
    case 0:
      // Sharp prismatic crystal
      return <coneGeometry args={[0.3, 1.5, 6]} />;
    case 1:
      // Hexagonal prism crystal
      return <cylinderGeometry args={[0.25, 0.35, 1.2, 6]} />;
    case 2:
      // Pointed crystal
      return <octahedronGeometry args={[0.8, 2]} />;
    case 3:
      // Cluster crystal
      return <dodecahedronGeometry args={[0.6, 1]} />;
    case 4:
      // Needle crystal
      return <coneGeometry args={[0.15, 2, 4]} />;
    case 5:
      // Bipyramidal crystal (using octahedron for double-pyramid shape)
      return <octahedronGeometry args={[0.4, 1]} />;
    default:
      return <octahedronGeometry args={[0.6, 1]} />;
  }
};

const CrystalFragmentComponent = ({ fragment, color, materialConfig, onRef }: CrystalFragmentProps) => {
  const { theme } = useExperience();

  // Vary crystal colors based on cluster for more natural look
  const clusterColors = [color, color, `hsl(${(parseInt(color.slice(1), 16) % 360 + 20) % 360}, 70%, 60%)`, `hsl(${(parseInt(color.slice(1), 16) % 360 + 40) % 360}, 70%, 55%)`];
  const crystalColor = clusterColors[fragment.cluster] || color;

  return (
    <group
      ref={onRef}
      position={fragment.position}
      scale={[fragment.scale, fragment.scale * (1.2 + Math.sin(fragment.phaseOffset) * 0.3), fragment.scale]}
    >
      {/* Main crystal formation */}
      <mesh>
        {getCrystalGeometryComponent(fragment.geometry)}
        <DynamicMaterial
          materialConfig={{
            materialType: 'basic',
            transparent: true,
            opacity: 0.8 + Math.sin(fragment.phaseOffset) * 0.1,
            emissive: crystalColor,
            emissiveIntensity: theme === 'day' ? 0.3 : 0.6,
            wireframe: false
          }}
          color={crystalColor}
        />
      </mesh>
      
      {/* Crystal inner glow */}
      <mesh scale={0.7}>
        <octahedronGeometry args={[0.5, 0]} />
        <DynamicMaterial
          materialConfig={{
            materialType: 'basic',
            transparent: true,
            opacity: theme === 'day' ? 0.2 : 0.4,
            emissive: crystalColor,
            emissiveIntensity: theme === 'day' ? 0.6 : 1.0,
            wireframe: false
          }}
          color={crystalColor}
        />
      </mesh>

      {/* Tiny sparkle effects */}
      <mesh position={[0, fragment.scale * 0.8, 0]} scale={0.1}>
        <sphereGeometry args={[1, 4, 4]} />
        <DynamicMaterial
          materialConfig={{
            materialType: 'basic',
            transparent: true,
            opacity: theme === 'day' ? 0.7 : 0.9,
            emissive: crystalColor,
            emissiveIntensity: theme === 'day' ? 1.2 : 2.0,
            wireframe: false
          }}
          color={crystalColor}
        />
      </mesh>
    </group>
  );
};

export default CrystalFragmentComponent;
