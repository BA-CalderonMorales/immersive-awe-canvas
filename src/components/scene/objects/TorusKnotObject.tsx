
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneThemeConfig } from '@/types/scene';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import DynamicMaterial from '../materials/DynamicMaterial';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface TorusKnotObjectProps {
  themeConfig: SceneThemeConfig;
  isLocked: boolean;
}

const TorusKnotObject = ({ themeConfig, isLocked }: TorusKnotObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const { isDragEnabled, actions, selectedObjectId } = useSceneObjectsContext();
  
  const isSelected = selectedObjectId === 'main-scene-object';
  const isBeingManipulated = useRef(false);

  useFrame((state) => {
    // Don't animate if being manipulated by gizmo
    if (isBeingManipulated.current) return;
    
    if (!isLocked && meshRef.current) {
      // Smooth, consistent rotation
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const handleClick = () => {
    console.log('🔍 DEBUG: Main object clicked, selecting main-scene-object');
    actions.selectObject('main-scene-object');
  };

  const handlePointerEnter = () => {
    if (!isDragEnabled) {
      setIsHovered(true);
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'grab';
    }
  };

  const handlePointerLeave = () => {
    if (!isDragEnabled) {
      setIsHovered(false);
    }
    document.body.style.cursor = 'auto';
  };

  // Listen for gizmo manipulation
  const handleObjectChange = () => {
    isBeingManipulated.current = true;
    // Reset after a short delay when manipulation stops
    setTimeout(() => {
      isBeingManipulated.current = false;
    }, 100);
  };

  return (
    <mesh 
      ref={meshRef}
      name={MAIN_OBJECT_NAME}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      userData={{ 
        isMainObject: true,
        onObjectChange: handleObjectChange
      }}
    >
      <torusKnotGeometry args={[1, 0.3, 128, 16]} />
      <DynamicMaterial 
        materialConfig={themeConfig.material} 
        color={themeConfig.mainObjectColor} 
      />
      
      {/* Green wireframe overlay when drag mode is enabled (all main objects) */}
      {isDragEnabled && (
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshBasicMaterial 
            wireframe 
            color="#00ff00" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      )}
      
      {/* Selection wireframe overlay (when not in drag mode) */}
      {!isDragEnabled && isSelected && (
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshBasicMaterial 
            wireframe 
            color="#00ff00" 
            transparent 
            opacity={0.5} 
          />
        </mesh>
      )}
      
      {/* Hover wireframe overlay (when not in drag mode or selected) */}
      {!isDragEnabled && isHovered && !isSelected && (
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 16]} />
          <meshBasicMaterial 
            wireframe 
            color="#ffff00" 
            transparent 
            opacity={0.3} 
          />
        </mesh>
      )}
    </mesh>
  );
};

export default TorusKnotObject;
