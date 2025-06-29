import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { MaterialConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicMaterial from '../materials/DynamicMaterial';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface DistortionSphereObjectProps {
  color: string;
  materialConfig: MaterialConfig;
  isLocked: boolean;
}

const DistortionSphereObject = ({ color, materialConfig, isLocked }: DistortionSphereObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled, forceWireframe, objectRefs } = useSceneObjectsContext();

  useEffect(() => {
    if (meshRef.current) {
      objectRefs.current.set(MAIN_OBJECT_NAME, meshRef.current);
    }
    return () => {
      objectRefs.current.delete(MAIN_OBJECT_NAME);
    };
  }, [objectRefs]);

  useFrame((state) => {
    if (meshRef.current?.userData.isBeingDragged) return;
    if (!isLocked && meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Subtle scale pulsing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
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
      <sphereGeometry args={[1.2, 64, 64]} />
      <DynamicMaterial materialConfig={materialConfig} color={color} />
      
      {/* Wireframe overlay - show when drag is enabled, force wireframe is enabled, or when hovered */}
      {(isDragEnabled || forceWireframe || isHovered) && (
        <mesh>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};

export default DistortionSphereObject;