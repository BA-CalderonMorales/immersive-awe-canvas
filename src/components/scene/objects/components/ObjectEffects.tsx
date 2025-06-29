
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import ObjectGeometry from './ObjectGeometry';
import { SceneObject } from '@/types/sceneObjects';

interface ObjectEffectsProps {
  isSelected: boolean;
  isHovered: boolean;
  objectType: SceneObject['type'];
  meshRef: React.RefObject<Mesh>;
  showLongPressEffect?: boolean;
}

const ObjectEffects = ({ 
  isSelected, 
  isHovered, 
  objectType, 
  meshRef,
  showLongPressEffect = false 
}: ObjectEffectsProps) => {
  const hologramRef = useRef<Mesh>(null);
  const longPressEffectRef = useRef<Mesh>(null);

  useFrame((state) => {
    // Animate holographic selection effect
    if (isSelected && hologramRef.current) {
      const time = state.clock.getElapsedTime();
      hologramRef.current.rotation.x = meshRef.current?.rotation.x || 0;
      hologramRef.current.rotation.y = meshRef.current?.rotation.y || 0;
      hologramRef.current.rotation.z = meshRef.current?.rotation.z || 0;
      hologramRef.current.position.copy(meshRef.current?.position || { x: 0, y: 0, z: 0 } as any);
      
      // Pulsing scale effect
      const scale = 1.1 + Math.sin(time * 3) * 0.05;
      hologramRef.current.scale.setScalar(scale);
    }

    // Animate iPhone-style long press effect
    if (showLongPressEffect && longPressEffectRef.current) {
      const time = state.clock.getElapsedTime();
      longPressEffectRef.current.rotation.x = meshRef.current?.rotation.x || 0;
      longPressEffectRef.current.rotation.y = meshRef.current?.rotation.y || 0;
      longPressEffectRef.current.rotation.z = meshRef.current?.rotation.z || 0;
      longPressEffectRef.current.position.copy(meshRef.current?.position || { x: 0, y: 0, z: 0 } as any);
      
      // iPhone-style shimmer effect
      const shimmerScale = 1.15 + Math.sin(time * 4) * 0.08;
      longPressEffectRef.current.scale.setScalar(shimmerScale);
    }
  });

  return (
    <>
      {/* Holographic selection effect */}
      {isSelected && (
        <mesh ref={hologramRef}>
          <ObjectGeometry type={objectType} />
          <meshBasicMaterial
            color="#00ffff"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
      
      {/* iPhone-style long press effect */}
      {showLongPressEffect && (
        <mesh ref={longPressEffectRef}>
          <ObjectGeometry type={objectType} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.2}
          />
        </mesh>
      )}
      
      {/* Additional outer glow for long press */}
      {showLongPressEffect && (
        <mesh ref={longPressEffectRef}>
          <ObjectGeometry type={objectType} />
          <meshBasicMaterial
            color="#87ceeb"
            wireframe
            transparent
            opacity={0.6}
          />
        </mesh>
      )}
      
      {/* Hover effect */}
      {isHovered && !isSelected && !showLongPressEffect && (
        <mesh>
          <ObjectGeometry type={objectType} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.15}
          />
        </mesh>
      )}
    </>
  );
};

export default ObjectEffects;
