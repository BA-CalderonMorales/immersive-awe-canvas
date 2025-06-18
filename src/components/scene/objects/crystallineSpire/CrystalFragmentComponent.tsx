
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

const CrystalFragmentComponent = ({ fragment, color, materialConfig, onRef }: CrystalFragmentProps) => {
  const { theme } = useExperience();

  return (
    <group
      ref={onRef}
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
  );
};

export default CrystalFragmentComponent;
