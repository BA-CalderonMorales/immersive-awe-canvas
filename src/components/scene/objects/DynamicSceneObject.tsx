
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useObjectInteraction } from './hooks/useObjectInteraction';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';
import ObjectEffects from './components/ObjectEffects';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
}

const DynamicSceneObject = ({ object, isSelected, onSelect, isLocked }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
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

  return (
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
  );
};

export default DynamicSceneObject;
