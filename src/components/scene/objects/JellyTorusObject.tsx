
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface JellyTorusObjectProps {
  isLocked: boolean;
}

const JellyTorusObject = ({ isLocked }: JellyTorusObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled } = useSceneObjectsContext();

  useFrame((state, delta) => {
    if (meshRef.current?.userData.isBeingDragged) return;
    if (!isLocked && meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Jelly-like scaling effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const handlePointerEnter = () => {
    setIsHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    document.body.style.cursor = 'auto';
  };

  return (
    <mesh 
      ref={meshRef}
      name={MAIN_OBJECT_NAME}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <torusGeometry args={[1, 0.4, 16, 100]} />
      <meshPhysicalMaterial
        color="#ff6b9d"
        metalness={0.1}
        roughness={0.1}
        transmission={0.9}
        thickness={0.5}
        transparent
        opacity={0.8}
      />
      
      {/* Wireframe overlay - show when drag is enabled or when hovered */}
      {(isDragEnabled || isHovered) && (
        <mesh>
          <torusGeometry args={[1, 0.4, 16, 100]} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};

export default JellyTorusObject;
