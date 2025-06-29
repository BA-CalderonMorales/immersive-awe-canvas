import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { MaterialConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicMaterial from '../materials/DynamicMaterial';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface MorphingIcosahedronObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const MorphingIcosahedronObject = ({ color, materialConfig, isLocked }: MorphingIcosahedronObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled } = useSceneObjectsContext();

  useFrame((state) => {
    if (meshRef.current?.userData.isBeingDragged) return;
    if (!isLocked && meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
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
      name={MAIN_OBJECT_NAME}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <icosahedronGeometry args={[1, 2]} />
      <DynamicMaterial materialConfig={materialConfig} color={color} />
      
      {/* Wireframe overlay - show when drag is enabled or when hovered */}
      {(isDragEnabled || isHovered) && (
        <mesh>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};

export default MorphingIcosahedronObject;