import { useRef, useEffect, useState } from 'react';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
}

const DynamicSceneObject = ({ object, isSelected, onSelect }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { objectRefs } = useSceneObjectsContext();

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.name = object.id;
      meshRef.current.userData = { objectId: object.id };
      objectRefs.current.set(object.id, meshRef.current);
    }
    return () => {
      objectRefs.current.delete(object.id);
    };
  }, [object.id, objectRefs]);

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect();
  };

  const handlePointerEnter = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (e: any) => {
    e.stopPropagation();
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <ObjectGeometry type={object.type} />
      <ObjectMaterial material={object.material} color={object.color} />
      
      {/* Selection wireframe overlay */}
      {isSelected && (
        <mesh>
          <ObjectGeometry type={object.type} />
          <meshBasicMaterial wireframe color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Hover wireframe overlay */}
      {isHovered && !isSelected && (
        <mesh>
          <ObjectGeometry type={object.type} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.3} />
        </mesh>
      )}
    </mesh>
  );
};

export default DynamicSceneObject;