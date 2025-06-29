import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
}

const DynamicSceneObject = ({ object, isSelected, onSelect, isLocked }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [pointerStartTime, setPointerStartTime] = useState<number>(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...object.position);
      meshRef.current.rotation.set(...object.rotation);
      meshRef.current.scale.set(...object.scale);
    }
  }, [object.position, object.rotation, object.scale]);

  useFrame((state) => {
    if (!isLocked && meshRef.current && !isSelected) {
      // Add subtle rotation when not locked and not selected
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }

    // Add holographic effect for selected objects
    if (isSelected && meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = object.position[1] + Math.sin(time * 2) * 0.1;
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    
    setPointerStartTime(Date.now());
    setHasMoved(false);
    setStartPosition({ x: e.clientX || e.point?.x || 0, y: e.clientY || e.point?.y || 0 });
    
    const timer = setTimeout(() => {
      if (!hasMoved) {
        console.log('Long press detected on object:', object.id);
        onSelect();
      }
    }, 500);
    setLongPressTimer(timer);
  };

  const handlePointerMove = (e: any) => {
    const currentX = e.clientX || e.point?.x || 0;
    const currentY = e.clientY || e.point?.y || 0;
    
    const moveDistance = Math.sqrt(
      Math.pow(currentX - startPosition.x, 2) + 
      Math.pow(currentY - startPosition.y, 2)
    );
    
    // If moved more than 10px, cancel long press
    if (moveDistance > 10) {
      setHasMoved(true);
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        setLongPressTimer(null);
      }
    }
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    
    const pointerDuration = Date.now() - pointerStartTime;
    
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    
    // If it was a quick tap (less than 200ms) and didn't move much
    if (pointerDuration < 200 && !hasMoved) {
      console.log('Quick tap on object:', object.id);
      onSelect();
    }
  };

  const renderGeometry = () => {
    const args = getGeometryArgs(object.type);
    
    switch (object.type) {
      case 'box':
        return <boxGeometry args={args as [number?, number?, number?]} />;
      case 'sphere':
        return <sphereGeometry args={args as [number?, number?, number?]} />;
      case 'cylinder':
        return <cylinderGeometry args={args as [number?, number?, number?, number?]} />;
      case 'cone':
        return <coneGeometry args={args as [number?, number?, number?]} />;
      case 'torus':
        return <torusGeometry args={args as [number?, number?, number?, number?]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={args as [number?, number?]} />;
      case 'icosahedron':
        return <icosahedronGeometry args={args as [number?, number?]} />;
      case 'octahedron':
        return <octahedronGeometry args={args as [number?, number?]} />;
      case 'tetrahedron':
        return <tetrahedronGeometry args={args as [number?, number?]} />;
      case 'plane':
        return <planeGeometry args={args as [number?, number?]} />;
      case 'ring':
        return <ringGeometry args={args as [number?, number?, number?]} />;
      case 'torusKnot':
        return <torusKnotGeometry args={args as [number?, number?, number?, number?]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const renderMaterial = () => {
    const { material, color } = object;
    
    switch (material.type) {
      case 'basic':
        return (
          <meshBasicMaterial
            color={color}
            wireframe={material.wireframe}
            transparent={material.transparent}
            opacity={material.opacity}
          />
        );
      case 'physical':
        return (
          <meshPhysicalMaterial
            color={color}
            metalness={material.metalness}
            roughness={material.roughness}
            wireframe={material.wireframe}
            transparent={material.transparent}
            opacity={material.opacity}
          />
        );
      default:
        return (
          <meshStandardMaterial
            color={color}
            metalness={material.metalness}
            roughness={material.roughness}
            wireframe={material.wireframe}
            transparent={material.transparent}
            opacity={material.opacity}
          />
        );
    }
  };

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setIsHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {renderGeometry()}
        {renderMaterial()}
      </mesh>
      
      {/* Holographic selection effect */}
      {isSelected && (
        <mesh ref={meshRef}>
          {renderGeometry()}
          <meshBasicMaterial
            color="#00ffff"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Hover effect */}
      {isHovered && !isSelected && (
        <mesh ref={meshRef}>
          {renderGeometry()}
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};

const getGeometryArgs = (type: SceneObject['type']): number[] => {
  switch (type) {
    case 'box': return [1, 1, 1];
    case 'sphere': return [0.5, 32, 32];
    case 'cylinder': return [0.5, 0.5, 1, 32];
    case 'cone': return [0.5, 1, 32];
    case 'torus': return [0.4, 0.1, 16, 100];
    case 'dodecahedron': return [0.5, 0];
    case 'icosahedron': return [0.5, 0];
    case 'octahedron': return [0.5, 0];
    case 'tetrahedron': return [0.5, 0];
    case 'plane': return [1, 1];
    case 'ring': return [0.2, 0.5, 32];
    case 'torusKnot': return [0.4, 0.15, 128, 16];
    default: return [1, 1, 1];
  }
};

export default DynamicSceneObject;
