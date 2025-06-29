
import { useRef } from 'react';
import { Mesh } from 'three';
import ObjectGeometry from './ObjectGeometry';
import { SceneObject } from '@/types/sceneObjects';

interface ObjectEffectsProps {
  isSelected: boolean;
  isHovered: boolean;
  objectType: SceneObject['type'];
  meshRef: React.RefObject<Mesh>;
}

const ObjectEffects = ({ isSelected, isHovered, objectType, meshRef }: ObjectEffectsProps) => {
  return (
    <>
      {/* Holographic selection effect */}
      {isSelected && (
        <mesh ref={meshRef}>
          <ObjectGeometry type={objectType} />
          <meshBasicMaterial
            color="#00ffff"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Hover effect */}
      {isHovered && !isSelected && (
        <mesh ref={meshRef}>
          <ObjectGeometry type={objectType} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </>
  );
};

export default ObjectEffects;
