
import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useSimplifiedObjectInteraction } from './hooks/useSimplifiedObjectInteraction';
import { useDragHandler } from './hooks/useDragHandler';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useMovementMode } from '@/context/MovementModeContext';
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
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(object.position);
  const [isDragging, setIsDragging] = useState(false);
  const { actions } = useSceneObjectsContext();
  const { movementMode } = useMovementMode();
  const { camera } = useThree();

  // Drag handler
  const dragHandler = useDragHandler({
    camera,
    movementMode,
    onDragStart: () => {
      setIsDragging(true);
      onSelect();
      
      // Disable orbit controls
      window.dispatchEvent(new CustomEvent('object-drag-start'));
      
      const modeNames = {
        'x-axis': 'X-Axis',
        'y-axis': 'Y-Axis',
        'z-axis': 'Z-Axis',
        'freehand': 'Freehand',
        'none': 'Disabled'
      };
      
      toast.info(`🎯 Moving ${object.type} - ${modeNames[movementMode]}`, {
        description: movementMode === 'freehand' 
          ? 'Drag to reposition object freely'
          : `Drag to move along ${movementMode.split('-')[0].toUpperCase()}-axis`,
        duration: 2000,
        style: {
          background: 'rgba(0, 0, 0, 0.9)',
          color: '#fff',
          border: '1px solid rgba(251, 191, 36, 0.3)',
          backdropFilter: 'blur(8px)',
        },
      });
    },
    onDragEnd: () => {
      setIsDragging(false);
      
      // Re-enable orbit controls
      window.dispatchEvent(new CustomEvent('object-drag-end'));
      
      // Update object position in context
      if (meshRef.current) {
        const finalPosition: [number, number, number] = [
          meshRef.current.position.x,
          meshRef.current.position.y,
          meshRef.current.position.z
        ];
        
        actions.updateObject(object.id, { position: finalPosition });
        
        toast.success(`📍 ${object.type} repositioned`, {
          description: `Position: [${finalPosition.map(n => n.toFixed(1)).join(', ')}]`,
          duration: 2000,
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            color: '#fff',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            backdropFilter: 'blur(8px)',
          },
        });
      }
    },
    onPositionUpdate: (position) => {
      if (meshRef.current) {
        meshRef.current.position.set(...position);
        setCurrentPosition(position);
      }
    }
  });

  // Object interaction
  const {
    isHovered,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerOver,
    handlePointerOut,
    handleClick,
    showLongPressEffect,
  } = useSimplifiedObjectInteraction(
    onSelect,
    (e) => dragHandler.startDrag(e, meshRef.current.position),
    (e) => dragHandler.updateDrag(e),
    () => dragHandler.endDrag(),
    movementMode
  );

  // Update position when object changes from outside
  useEffect(() => {
    if (!isDragging && meshRef.current) {
      setCurrentPosition(object.position);
      meshRef.current.position.set(...object.position);
      meshRef.current.rotation.set(...object.rotation);
      meshRef.current.scale.set(...object.scale);
    }
  }, [object.position, object.rotation, object.scale, isDragging]);

  useFrame((state) => {
    if (!isLocked && meshRef.current && !isSelected && !isDragging) {
      // Subtle rotation when not locked, selected, or being dragged
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
    }

    // Holographic floating effect for selected objects
    if (isSelected && meshRef.current && !isDragging) {
      const time = state.clock.getElapsedTime();
      const baseY = currentPosition[1];
      meshRef.current.position.y = baseY + Math.sin(time * 2) * 0.1;
    }
  });

  // Context menu handlers
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
    console.log('Deleting object:', object.id);
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
    console.log('Duplicating object:', object.id);
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
    actions.updateObject(newObject.id, newObject);
    
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
    
    console.log('Color changed for object:', object.id, 'to:', randomColor);
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
