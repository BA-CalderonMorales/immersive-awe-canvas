
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { MaterialConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicMaterial from '../materials/DynamicMaterial';

interface WavyGridObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const WavyGridObject = ({ color, materialConfig, isLocked }: WavyGridObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled } = useSceneObjectsContext();

  useFrame((state) => {
    if (!isLocked && meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
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
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[4, 4, 32, 32]} />
      <DynamicMaterial materialConfig={materialConfig} color={color} />
      
      {/* Wireframe overlay - show when drag is enabled or when hovered */}
      {(isDragEnabled || isHovered) && (
        <mesh>
          <planeGeometry args={[4, 4, 32, 32]} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};

export default WavyGridObject;
