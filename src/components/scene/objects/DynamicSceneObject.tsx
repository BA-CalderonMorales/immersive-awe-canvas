import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
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
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    // Allow event to propagate to OrbitControls and other listeners.
    onSelect();
  };

  const handlePointerEnter = (e: ThreeEvent<MouseEvent>) => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = (e: ThreeEvent<MouseEvent>) => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <mesh
      ref={meshRef}
      name={object.id}
      userData={{ objectId: object.id }}
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