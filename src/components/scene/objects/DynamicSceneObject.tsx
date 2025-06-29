
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useObjectInteraction } from './hooks/useObjectInteraction';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';
import ObjectEffects from './components/ObjectEffects';
import ObjectContextMenu from './components/ObjectContextMenu';
import { toast } from 'sonner';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
}

const DynamicSceneObject = ({ object, isSelected, onSelect, isLocked }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const { actions } = useSceneObjectsContext();
  
  const {
    isHovered,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
    handleClick,
  } = useObjectInteraction(onSelect);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...object.position);
      meshRef.current.rotation.set(...object.rotation);
      meshRef.current.scale.set(...object.scale);
    }
  }, [object.position, object.rotation, object.scale]);

  useFrame((state) => {
    if (!isLocked && meshRef.current && !isSelected) {
      // Add subtle rotation when not locked and not selected
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }

    // Add holographic effect for selected objects
    if (isSelected && meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = object.position[1] + Math.sin(time * 2) * 0.1;
    }
  });

  const handleEdit = () => {
    console.log('Editing object:', object.id);
    onSelect();
    toast.success('Object selected for editing');
  };

  const handleDelete = () => {
    actions.removeObject(object.id);
    toast.success(`${object.type} deleted from scene`);
  };

  const handleDuplicate = () => {
    actions.addObject(object.type);
    toast.success(`${object.type} duplicated`);
  };

  const handleMove = () => {
    console.log('Move mode activated for:', object.id);
    onSelect();
    toast.info('Click and drag to move object');
  };

  const handleChangeColor = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    actions.updateObject(object.id, { color: randomColor });
    toast.success('Color changed!');
  };

  return (
    <ObjectContextMenu
      object={object}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      onMove={handleMove}
      onChangeColor={handleChangeColor}
    >
      <group>
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
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
        />
      </group>
    </ObjectContextMenu>
  );
};

export default DynamicSceneObject;
