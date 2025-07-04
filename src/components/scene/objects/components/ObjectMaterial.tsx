
import { SceneObject } from '@/types/sceneObjects';

interface ObjectMaterialProps {
  material: SceneObject['material'];
  color: string;
}

const ObjectMaterial = ({ material, color }: ObjectMaterialProps) => {
  switch (material.type) {
    case 'basic':
      return (
        <meshBasicMaterial
          color={color}
          wireframe={material.wireframe}
          transparent={material.transparent}
          opacity={material.opacity}
        />
      );
    case 'physical':
      return (
        <meshPhysicalMaterial
          color={color}
          metalness={material.metalness}
          roughness={material.roughness}
          wireframe={material.wireframe}
          transparent={material.transparent}
          opacity={material.opacity}
        />
      );
    default:
      return (
        <meshStandardMaterial
          color={color}
          metalness={material.metalness}
          roughness={material.roughness}
          wireframe={material.wireframe}
          transparent={material.transparent}
          opacity={material.opacity}
        />
      );
  }
};

export default ObjectMaterial;
