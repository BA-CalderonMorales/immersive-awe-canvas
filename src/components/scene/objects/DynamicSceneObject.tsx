
import { useRef } from 'react';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';
import ObjectEffects from './components/ObjectEffects';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
}

const DynamicSceneObject = ({ object, isSelected, onSelect }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        position={object.position}
        rotation={object.rotation}
        scale={object.scale}
        onClick={handleClick}
      >
        <ObjectGeometry type={object.type} />
        <ObjectMaterial material={object.material} color={object.color} />
      </mesh>
      
      <ObjectEffects 
        isSelected={isSelected}
        isHovered={false}
        objectType={object.type}
        meshRef={meshRef}
        showLongPressEffect={false}
      />
    </group>
  );
};

export default DynamicSceneObject;
