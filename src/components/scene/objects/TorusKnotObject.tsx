
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneThemeConfig } from '@/types/scene';
import DynamicMaterial from '../materials/DynamicMaterial';

interface TorusKnotObjectProps {
  themeConfig: SceneThemeConfig;
  isLocked: boolean;
}

const TorusKnotObject = ({ themeConfig, isLocked }: TorusKnotObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state) => {
    if (!isLocked && meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
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
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <DynamicMaterial 
        materialConfig={themeConfig.material} 
        color={themeConfig.mainObjectColor} 
      />
      
      {/* Hover wireframe overlay */}
      {isHovered && (
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};

export default TorusKnotObject;
