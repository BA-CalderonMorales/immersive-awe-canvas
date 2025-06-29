
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color } from 'three';

interface ObjectEffectsProps {
  isSelected: boolean;
  isHovered: boolean;
  objectType: string;
  meshRef: React.RefObject<Mesh>;
  showLongPressEffect: boolean;
}

const ObjectEffects = ({ 
  isSelected, 
  isHovered, 
  objectType, 
  meshRef, 
  showLongPressEffect 
}: ObjectEffectsProps) => {
  const outlineRef = useRef<Mesh>(null!);
  const hologramRef = useRef<Mesh>(null!);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Selection outline effect
    if (outlineRef.current) {
      outlineRef.current.visible = isSelected || isHovered;
      if (isSelected || isHovered) {
        outlineRef.current.scale.setScalar(1.1 + Math.sin(time * 4) * 0.02);
        
        // Copy position and rotation from main mesh
        if (meshRef.current) {
          outlineRef.current.position.copy(meshRef.current.position);
          outlineRef.current.rotation.copy(meshRef.current.rotation);
        }
      }
    }

    // Holographic long-press effect
    if (hologramRef.current) {
      hologramRef.current.visible = showLongPressEffect;
      if (showLongPressEffect) {
        // Pulsing holographic effect
        const pulse = Math.sin(time * 8) * 0.5 + 0.5;
        hologramRef.current.scale.setScalar(1.2 + pulse * 0.3);
        
        // Copy position and rotation from main mesh
        if (meshRef.current) {
          hologramRef.current.position.copy(meshRef.current.position);
          hologramRef.current.rotation.copy(meshRef.current.rotation);
        }
      }
    }
  });

  return (
    <>
      {/* Selection/Hover Outline */}
      <mesh ref={outlineRef} visible={false}>
        {objectType === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {objectType === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {objectType === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
        {objectType === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
        {objectType === 'torus' && <torusGeometry args={[0.4, 0.1, 16, 100]} />}
        {objectType === 'dodecahedron' && <dodecahedronGeometry args={[0.5, 0]} />}
        {objectType === 'icosahedron' && <icosahedronGeometry args={[0.5, 0]} />}
        {objectType === 'octahedron' && <octahedronGeometry args={[0.5, 0]} />}
        {objectType === 'tetrahedron' && <tetrahedronGeometry args={[0.5, 0]} />}
        {objectType === 'plane' && <planeGeometry args={[1, 1]} />}
        {objectType === 'ring' && <ringGeometry args={[0.2, 0.5, 32]} />}
        {objectType === 'torusKnot' && <torusKnotGeometry args={[0.4, 0.15, 128, 16]} />}
        
        <meshBasicMaterial
          color={isSelected ? "#00ff00" : "#ffff00"}
          wireframe={true}
          transparent={true}
          opacity={0.6}
        />
      </mesh>

      {/* Holographic Long-Press Effect */}
      <mesh ref={hologramRef} visible={false}>
        {objectType === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {objectType === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {objectType === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
        {objectType === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
        {objectType === 'torus' && <torusGeometry args={[0.4, 0.1, 16, 100]} />}
        {objectType === 'dodecahedron' && <dodecahedronGeometry args={[0.5, 0]} />}
        {objectType === 'icosahedron' && <icosahedronGeometry args={[0.5, 0]} />}
        {objectType === 'octahedron' && <octahedronGeometry args={[0.5, 0]} />}
        {objectType === 'tetrahedron' && <tetrahedronGeometry args={[0.5, 0]} />}
        {objectType === 'plane' && <planeGeometry args={[1, 1]} />}
        {objectType === 'ring' && <ringGeometry args={[0.2, 0.5, 32]} />}
        {objectType === 'torusKnot' && <torusKnotGeometry args={[0.4, 0.15, 128, 16]} />}
        
        <meshBasicMaterial
          color="#00aaff"
          transparent={true}
          opacity={0.3}
          wireframe={true}
        />
      </mesh>
    </>
  );
};

export default ObjectEffects;
