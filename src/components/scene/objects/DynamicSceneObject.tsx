import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, Raycaster, Vector2 } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useObjectInteraction } from './hooks/useObjectInteraction';
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
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(object.position);
  const { actions } = useSceneObjectsContext();
  const { movementMode } = useMovementMode();
  const { camera, gl, scene } = useThree();
  const dragStartPosition = useRef(new Vector3());
  const dragPlane = useRef(new Vector3());
  const raycaster = useRef(new Raycaster());
  
  const handleDragStart = (event: any) => {
    if (movementMode === 'none') return;
    
    console.log('Drag started for object:', object.id, 'in mode:', movementMode);
    setIsDragging(true);
    onSelect(); // Select the object when starting to drag
    
    // Dispatch event to disable orbit controls
    window.dispatchEvent(new CustomEvent('object-drag-start'));
    
    // Store initial position
    if (meshRef.current) {
      dragStartPosition.current.copy(meshRef.current.position);
    }
    
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
  };
  
  const handleDrag = (event: any) => {
    if (!isDragging || !meshRef.current || movementMode === 'none') return;
    
    // Get mouse position in normalized device coordinates
    const mouse = new Vector2();
    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Update raycaster
    raycaster.current.setFromCamera(mouse, camera);
    
    // Calculate movement based on camera orientation and movement mode
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    
    // Create a plane perpendicular to camera for free movement
    const plane = new Vector3().copy(cameraDirection).normalize();
    const intersects = raycaster.current.ray.intersectPlane(
      new THREE.Plane(plane, -dragStartPosition.current.dot(plane)),
      new Vector3()
    );
    
    if (intersects) {
      const deltaMovement = intersects.clone().sub(dragStartPosition.current);
      const sensitivity = 0.5;
      
      let newPosition = new Vector3().copy(dragStartPosition.current);
      
      // Apply movement constraints based on mode
      switch (movementMode) {
        case 'x-axis':
          newPosition.x += deltaMovement.x * sensitivity;
          break;
        case 'y-axis':
          newPosition.y += deltaMovement.y * sensitivity;
          break;
        case 'z-axis':
          newPosition.z += deltaMovement.z * sensitivity;
          break;
        case 'freehand':
          newPosition.add(deltaMovement.multiplyScalar(sensitivity));
          break;
      }
      
      // Update mesh position immediately for smooth dragging
      meshRef.current.position.copy(newPosition);
      setCurrentPosition([newPosition.x, newPosition.y, newPosition.z]);
      
      console.log(`Object dragged to position in ${movementMode} mode:`, newPosition);
    }
  };
  
  const handleDragEnd = () => {
    if (!isDragging) return;
    
    console.log('Drag ended for object:', object.id);
    setIsDragging(false);
    
    // Dispatch event to re-enable orbit controls
    window.dispatchEvent(new CustomEvent('object-drag-end'));
    
    // Update the object position in the context when drag ends
    if (movementMode !== 'none' && meshRef.current) {
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
  } = useObjectInteraction(onSelect, handleDragStart, handleDrag, handleDragEnd, movementMode);

  // Update local position when object position changes from outside
  useEffect(() => {
    if (!isDragging) {
      setCurrentPosition(object.position);
      if (meshRef.current) {
        meshRef.current.position.set(...object.position);
        meshRef.current.rotation.set(...object.rotation);
        meshRef.current.scale.set(...object.scale);
      }
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
      const baseY = currentPosition[1];
      meshRef.current.position.y = baseY + Math.sin(time * 2) * 0.1;
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
