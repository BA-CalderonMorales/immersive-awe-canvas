
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneThemeConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useDragControls } from '@/hooks/useDragControls';
import DynamicMaterial from '../materials/DynamicMaterial';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface TorusKnotObjectProps {
  themeConfig: SceneThemeConfig;
  isLocked: boolean;
}

const TorusKnotObject = ({ themeConfig, isLocked }: TorusKnotObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled, actions } = useSceneObjectsContext();

  const { isDragging, dragHandlers } = useDragControls({
    enabled: isDragEnabled,
    onDragStart: () => {
      if (meshRef.current) {
        meshRef.current.userData.isBeingDragged = true;
      }
    },
    onDragEnd: () => {
      if (meshRef.current) {
        meshRef.current.userData.isBeingDragged = false;
      }
    }
  });

  useFrame((state) => {
    if (meshRef.current?.userData.isBeingDragged) return;
    if (!isLocked && meshRef.current) {
      // Smooth, consistent rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const handleClick = () => {
    // Select the main object when clicked
    actions.selectObject('main-scene-object');
  };

  const handlePointerEnter = () => {
    if (!isDragEnabled) {
      setIsHovered(true);
      document.body.style.cursor = 'pointer';
    } else {
      dragHandlers.onPointerEnter();
    }
  };

  const handlePointerLeave = () => {
    if (!isDragEnabled) {
      setIsHovered(false);
      document.body.style.cursor = 'auto';
    } else {
      dragHandlers.onPointerLeave();
    }
  };

  return (
    <mesh 
      ref={meshRef}
      name={MAIN_OBJECT_NAME}
      userData={{ isBeingDragged: isDragging }}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      {...(isDragEnabled ? dragHandlers : {})}
    >
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <DynamicMaterial 
        materialConfig={themeConfig.material} 
        color={themeConfig.mainObjectColor} 
      />
      
      {/* Wireframe overlay - show when drag is enabled or when hovered */}
      {(isDragEnabled || isHovered) && (
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.5} />
        </mesh>
      )}
    </mesh>
  );
};

export default TorusKnotObject;
