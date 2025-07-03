
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { MaterialConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicMaterial from '../materials/DynamicMaterial';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface WavyGridObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
  isMotionFrozen?: boolean;
}

const WavyGridObject = ({ color, materialConfig, isLocked, isMotionFrozen }: WavyGridObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled } = useSceneObjectsContext();

  useFrame((state) => {
    if (meshRef.current?.userData.isBeingDragged) return;
    if (isMotionFrozen) return;
    if (!isLocked && meshRef.current) {
      // Smooth wave-like rotation
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.15;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
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
