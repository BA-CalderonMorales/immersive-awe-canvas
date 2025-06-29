
import { useRef, useEffect } from 'react';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
}

const DynamicSceneObject = ({ object, isSelected, onSelect }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.name = object.id;
      meshRef.current.userData = { objectId: object.id };
    }
  }, [object.id]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={handleClick}
    >
      <ObjectGeometry type={object.type} />
      <ObjectMaterial material={object.material} color={object.color} />
      {isSelected && (
        <meshBasicMaterial wireframe color="#00ffff" transparent opacity={0.3} />
      )}
    </mesh>
  );
};

export default DynamicSceneObject;
