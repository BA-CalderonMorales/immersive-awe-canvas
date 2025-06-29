
import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useObjectInteraction } from './hooks/useObjectInteraction';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';
import ObjectEffects from './components/ObjectEffects';
import ObjectContextMenu from './components/ObjectContextMenu';
import { toast } from 'sonner';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
}

const DynamicSceneObject = ({ object, isSelected, onSelect, isLocked }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const { actions } = useSceneObjectsContext();
  
  const handleDragStart = () => {
    setIsDragging(true);
    onSelect(); // Select the object when starting to drag
  };
  
  const handleDrag = (delta: Vector3) => {
    if (meshRef.current) {
      const newPosition: [number, number, number] = [
        object.position[0] + delta.x,
        object.position[1] + delta.y,
        object.position[2] + delta.z
      ];
      
      // Update the object position immediately for smooth dragging
      meshRef.current.position.set(...newPosition);
      
      // Debounce the context update to avoid too many updates
      actions.updateObject(object.id, { position: newPosition });
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    toast.success(`📍 ${object.type} repositioned`, {
      description: "Object moved to new position",
      duration: 2000,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };
  
  const {
    isHovered,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
    handleClick,
    showLongPressEffect,
  } = useObjectInteraction(onSelect, handleDragStart, handleDrag, handleDragEnd);

  useEffect(() => {
    if (meshRef.current && !isDragging) {
      meshRef.current.position.set(...object.position);
      meshRef.current.rotation.set(...object.rotation);
      meshRef.current.scale.set(...object.scale);
    }
  }, [object.position, object.rotation, object.scale, isDragging]);

  useFrame((state) => {
    if (!isLocked && meshRef.current && !isSelected && !isDragging) {
      // Add subtle rotation when not locked, selected, or being dragged
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }

    // Add holographic floating effect for selected objects
    if (isSelected && meshRef.current && !isDragging) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = object.position[1] + Math.sin(time * 2) * 0.1;
    }
  });

  const handleEdit = () => {
    console.log('Editing object:', object.id);
    onSelect();
    toast.success(`✏️ ${object.type} selected for editing`, {
      description: "Use the settings panel to modify properties",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleDelete = () => {
    actions.removeObject(object.id);
    toast.success(`🗑️ ${object.type} deleted`, {
      description: "Object removed from scene",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleDuplicate = () => {
    const newObject = {
      ...object,
      id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: [
        object.position[0] + 2,
        object.position[1],
        object.position[2]
      ] as [number, number, number]
    };
    
    actions.addObject(object.type);
    toast.success(`📋 ${object.type} duplicated`, {
      description: "New object added to scene",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleMove = () => {
    console.log('Move mode activated for:', object.id);
    onSelect();
    toast.info(`🎯 Drag to move ${object.type}`, {
      description: "Long press or Ctrl+drag to reposition",
      duration: 3000,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  };

  const handleChangeColor = () => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#8800ff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    actions.updateObject(object.id, { color: randomColor });
    toast.success(`🎨 Color changed to ${randomColor}`, {
      description: "Object appearance updated",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: `1px solid ${randomColor}40`,
        backdropFilter: 'blur(8px)',
      },
    });
  };

  return (
    <ObjectContextMenu
      object={object}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDuplicate={handleDuplicate}
      onMove={handleMove}
      onChangeColor={handleChangeColor}
    >
      <group>
        <mesh
          ref={meshRef}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <ObjectGeometry type={object.type} />
          <ObjectMaterial material={object.material} color={object.color} />
        </mesh>
        
        <ObjectEffects 
          isSelected={isSelected}
          isHovered={isHovered}
          objectType={object.type}
          meshRef={meshRef}
          showLongPressEffect={showLongPressEffect}
        />
      </group>
    </ObjectContextMenu>
  );
};

export default DynamicSceneObject;
