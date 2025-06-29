
import { useState, MutableRefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { Mesh } from 'three';
import { SceneObject } from '@/types/sceneObjects';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useMovementMode } from '@/context/MovementModeContext';
import { useDragHandler } from './useDragHandler';
import { toast } from 'sonner';

interface UseObjectDragProps {
  object: SceneObject;
  meshRef: MutableRefObject<Mesh>;
  onSelect: () => void;
}

export const useObjectDrag = ({ object, meshRef, onSelect }: UseObjectDragProps) => {
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(object.position);
  const [isDragging, setIsDragging] = useState(false);
  const { actions } = useSceneObjectsContext();
  const { movementMode } = useMovementMode();
  const { camera } = useThree();

  const dragHandler = useDragHandler({
    camera,
    movementMode,
    meshRef,
    onDragStart: () => {
      setIsDragging(true);
      onSelect();
      
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
      setCurrentPosition(position);
    }
  });

  return {
    currentPosition,
    setCurrentPosition,
    isDragging,
    dragHandler,
  };
};
