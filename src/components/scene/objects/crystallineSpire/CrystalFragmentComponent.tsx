
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

const getCrystalGeometry = (type: number) => {
  switch (type) {
    case 0:
      return <octahedronGeometry args={[1, 3]} />; // Higher detail
    case 1:
      return <tetrahedronGeometry args={[1, 2]} />; // More refined
    case 2:
      return <icosahedronGeometry args={[1, 2]} />; // Better definition
    case 3:
      return <dodecahedronGeometry args={[1, 3]} />; // Higher detail
    default:
      return <octahedronGeometry args={[1, 2]} />;
  }
};

const CrystalFragmentComponent = ({ fragment, color, materialConfig, onRef }: CrystalFragmentProps) => {
  const { theme } = useExperience();

  return (
    <group
      ref={onRef}
      position={fragment.position}
    >
      {/* Main crystal fragment with proper lighting */}
      <mesh castShadow receiveShadow>
        {getCrystalGeometry(fragment.geometry)}
        <DynamicMaterial
          materialConfig={{
            ...materialConfig,
            materialType: 'physical', // Better for crystals
            transparent: true,
            opacity: 0.85,
            roughness: 0.1,
            metalness: 0.2,
            clearcoat: 0.8,
            clearcoatRoughness: 0.1,
            emissive: color,
            emissiveIntensity: theme === 'day' ? 0.2 : 0.4,
            ior: 1.5 // Crystal-like refraction
          }}
          color={color}
        />
      </mesh>
      
      {/* Inner core for depth and complexity */}
      <mesh scale={0.6}>
        {getCrystalGeometry((fragment.geometry + 1) % 4)}
        <DynamicMaterial
          materialConfig={{
            ...materialConfig,
            materialType: 'physical',
            transparent: true,
            opacity: 0.6,
            roughness: 0.05,
            metalness: 0.8,
            emissive: color,
            emissiveIntensity: theme === 'day' ? 0.3 : 0.6
          }}
          color={color}
        />
      </mesh>
      
      {/* Outer wireframe for crystal structure definition */}
      <mesh scale={1.2}>
        {getCrystalGeometry(fragment.geometry)}
        <DynamicMaterial
          materialConfig={{
            ...materialConfig,
            materialType: 'basic',
            transparent: true,
            opacity: theme === 'day' ? 0.15 : 0.25,
            wireframe: true
          }}
          color={color}
        />
      </mesh>
    </group>
  );
};

export default CrystalFragmentComponent;
