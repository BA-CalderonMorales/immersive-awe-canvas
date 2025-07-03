import { useRef, useState } from 'react';
import { Mesh, Vector3 } from 'three';
import { ThreeEvent, useThree } from '@react-three/fiber';
import { SceneObject } from '@/types/sceneObjects';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
}

const DynamicSceneObject = ({ object, isSelected, onSelect }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { isDragEnabled, actions } = useSceneObjectsContext();
  const { camera, gl } = useThree();
  
  const dragStartPosition = useRef<Vector3>(new Vector3());
  const dragOffset = useRef<Vector3>(new Vector3());

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation(); // Prevent scene click from deselecting
    console.log('🔍 DEBUG: DynamicSceneObject clicked', { 
      objectId: object.id, 
      isDragEnabled, 
      currentSelected: isSelected 
    });
    onSelect(); // This should call actions.selectObject(object.id)
  };

  const handlePointerEnter = (e: ThreeEvent<MouseEvent>) => {
    if (!isDragEnabled) {
      setIsHovered(true);
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'grab';
    }
  };

  const handlePointerLeave = (e: ThreeEvent<MouseEvent>) => {
    if (!isDragEnabled && !isDragging) {
      setIsHovered(false);
      document.body.style.cursor = 'auto';
    }
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragEnabled) return;
    
    e.stopPropagation();
    setIsDragging(true);
    onSelect();
    document.body.style.cursor = 'grabbing';
    
    // Calculate drag offset
    const intersectionPoint = e.point;
    const meshPosition = meshRef.current.position;
    dragOffset.current.copy(intersectionPoint).sub(meshPosition);
    dragStartPosition.current.copy(meshPosition);
    
    gl.domElement.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging || !isDragEnabled) return;
    
    e.stopPropagation();
    
    // Convert screen coordinates to world position
    const newPosition = e.point.clone().sub(dragOffset.current);
    meshRef.current.position.copy(newPosition);
    
    // Update object state
    const position: [number, number, number] = [newPosition.x, newPosition.y, newPosition.z];
    actions.updateObject(object.id, { position });
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    
    e.stopPropagation();
    setIsDragging(false);
    document.body.style.cursor = isDragEnabled ? 'grab' : 'auto';
    
    gl.domElement.releasePointerCapture(e.pointerId);
  };

  return (
    <mesh
      ref={meshRef}
      name={object.id}
      userData={{ objectId: object.id, isBeingDragged: isDragging }}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <ObjectGeometry type={object.type} />
      <ObjectMaterial material={object.material} color={object.color} />
      
      {/* Green wireframe overlay when drag mode is enabled (all objects) */}
      {isDragEnabled && (
        <mesh>
          <ObjectGeometry type={object.type} />
          <meshBasicMaterial wireframe color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Selection wireframe overlay (when not in drag mode) */}
      {!isDragEnabled && isSelected && (
        <mesh>
          <ObjectGeometry type={object.type} />
          <meshBasicMaterial wireframe color="#00ff00" transparent opacity={0.5} />
        </mesh>
      )}
      
      {/* Hover wireframe overlay (when not in drag mode or selected) */}
      {!isDragEnabled && isHovered && !isSelected && (
        <mesh>
          <ObjectGeometry type={object.type} />
          <meshBasicMaterial wireframe color="#ffff00" transparent opacity={0.3} />
        </mesh>
      )}
    </mesh>
  );
};

export default DynamicSceneObject;