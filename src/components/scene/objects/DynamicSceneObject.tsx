
import { useRef, useEffect, useState } from 'react';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useObjectSelection } from './hooks/useObjectSelection';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';
import ObjectEffects from './components/ObjectEffects';
import ObjectContextMenu from './components/ObjectContextMenu';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
}

const DynamicSceneObject = ({ object, isSelected, onSelect }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);

  const objectSelection = useObjectSelection({ object, onSelect });

  // Update mesh position when object position changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...object.position);
    }
  }, [object.position]);

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = () => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <ObjectContextMenu
      object={object}
      onEdit={objectSelection.handleEdit}
      onDelete={objectSelection.handleDelete}
      onDuplicate={objectSelection.handleDuplicate}
      onMove={objectSelection.handleMove}
      onChangeColor={objectSelection.handleChangeColor}
    >
      <group>
        <mesh
          ref={meshRef}
          position={object.position}
          rotation={object.rotation}
          scale={object.scale}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <ObjectGeometry type={object.type} />
          <ObjectMaterial material={object.material} color={object.color} />
        </mesh>
        
        <ObjectEffects 
          isSelected={isSelected}
          isHovered={isHovered}
          objectType={object.type}
          meshRef={meshRef}
          showLongPressEffect={false}
        />
      </group>
    </ObjectContextMenu>
  );
};

export default DynamicSceneObject;
