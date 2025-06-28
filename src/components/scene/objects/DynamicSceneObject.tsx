
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
}

const DynamicSceneObject = ({ object, isSelected, onSelect, isLocked }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...object.position);
      meshRef.current.rotation.set(...object.rotation);
      meshRef.current.scale.set(...object.scale);
    }
  }, [object.position, object.rotation, object.scale]);

  useFrame(() => {
    if (!isLocked && meshRef.current && !isSelected) {
      // Add subtle rotation when not locked and not selected
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }
  });

  const renderGeometry = () => {
    const args = getGeometryArgs(object.type);
    
    switch (object.type) {
      case 'box':
        return <boxGeometry args={args} />;
      case 'sphere':
        return <sphereGeometry args={args} />;
      case 'cylinder':
        return <cylinderGeometry args={args} />;
      case 'cone':
        return <coneGeometry args={args} />;
      case 'torus':
        return <torusGeometry args={args} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={args} />;
      case 'icosahedron':
        return <icosahedronGeometry args={args} />;
      case 'octahedron':
        return <octahedronGeometry args={args} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={args} />;
      case 'plane':
        return <planeGeometry args={args} />;
      case 'ring':
        return <ringGeometry args={args} />;
      case 'torusKnot':
        return <torusKnotGeometry args={args} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const renderMaterial = () => {
    const { material, color } = object;
    
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

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {renderGeometry()}
      {renderMaterial()}
      {isSelected && (
        <meshBasicMaterial
          color="#00ff00"
          wireframe
          transparent
          opacity={0.3}
        />
      )}
    </mesh>
  );
};

const getGeometryArgs = (type: SceneObject['type']): any[] => {
  switch (type) {
    case 'box': return [1, 1, 1];
    case 'sphere': return [0.5, 32, 32];
    case 'cylinder': return [0.5, 0.5, 1, 32];
    case 'cone': return [0.5, 1, 32];
    case 'torus': return [0.4, 0.1, 16, 100];
    case 'dodecahedron': return [0.5, 0];
    case 'icosahedron': return [0.5, 0];
    case 'octahedron': return [0.5, 0];
    case 'tetrahedron': return [0.5, 0];
    case 'plane': return [1, 1];
    case 'ring': return [0.2, 0.5, 32];
    case 'torusKnot': return [0.4, 0.15, 128, 16];
    default: return [1, 1, 1];
  }
};

export default DynamicSceneObject;
