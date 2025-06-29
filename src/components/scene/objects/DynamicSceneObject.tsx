
import { useRef } from 'react';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useMovementMode } from '@/context/MovementModeContext';
import { useSimplifiedObjectInteraction } from './hooks/useSimplifiedObjectInteraction';
import { useObjectSelection } from './hooks/useObjectSelection';
import { useObjectDrag } from './hooks/useObjectDrag';
import ObjectGeometry from './components/ObjectGeometry';
import ObjectMaterial from './components/ObjectMaterial';
import ObjectEffects from './components/ObjectEffects';
import ObjectContextMenu from './components/ObjectContextMenu';
import ObjectAnimationController from './components/ObjectAnimationController';

interface DynamicSceneObjectProps {
  object: SceneObject;
  isSelected: boolean;
  onSelect: () => void;
  isLocked: boolean;
}

const DynamicSceneObject = ({ object, isSelected, onSelect, isLocked }: DynamicSceneObjectProps) => {
  const meshRef = useRef<Mesh>(null!);
  const { movementMode } = useMovementMode();

  // Custom hooks for object functionality
  const objectSelection = useObjectSelection({ object, onSelect });
  const { currentPosition, isDragging, dragHandler } = useObjectDrag({ object, meshRef, onSelect });

  // Object interaction handling
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

  return (
    <ObjectContextMenu
      object={object}
      onEdit={objectSelection.handleEdit}
      onDelete={objectSelection.handleDelete}
      onDuplicate={objectSelection.handleDuplicate}
      onMove={objectSelection.handleMove}
      onChangeColor={objectSelection.handleChangeColor}
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

        <ObjectAnimationController
          meshRef={meshRef}
          object={object}
          isSelected={isSelected}
          isLocked={isLocked}
          isDragging={isDragging}
          currentPosition={currentPosition}
        />
      </group>
    </ObjectContextMenu>
  );
};

export default DynamicSceneObject;
