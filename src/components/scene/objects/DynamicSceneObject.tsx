import { useRef, useState } from 'react';
import { Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
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
  const { isDragEnabled } = useSceneObjectsContext();

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    onSelect();
  };

  const handlePointerEnter = (e: ThreeEvent<MouseEvent>) => {
    if (!isDragEnabled) {
      setIsHovered(true);
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerLeave = (e: ThreeEvent<MouseEvent>) => {
    if (!isDragEnabled) {
      setIsHovered(false);
      document.body.style.cursor = 'auto';
    }
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
      
      {/* Drag wireframe overlay */}
      {isDragEnabled && (
        <mesh>
          <ObjectGeometry type={object.type} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Selection wireframe overlay (when not dragging) */}
      {!isDragEnabled && isSelected && (
        <mesh>
          <ObjectGeometry type={object.type} />
          <meshBasicMaterial wireframe color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Hover wireframe overlay (when not dragging or selected) */}
      {!isDragEnabled && isHovered && !isSelected && (
        <mesh>
          <ObjectGeometry type={object.type} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.3} />
        </mesh>
      )}
    </mesh>
  );
};

export default DynamicSceneObject;