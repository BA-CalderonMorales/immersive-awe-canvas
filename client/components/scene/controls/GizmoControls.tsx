import { useRef, useEffect, useCallback, useState } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useDeviceType } from '@/hooks/use-mobile';
import * as THREE from 'three';

interface GizmoControlsProps {
  enabled: boolean;
  mode?: 'translate' | 'rotate' | 'scale';
  onDragStateChange?: (isDragging: boolean) => void;
}

const GizmoControls = ({ enabled, mode = 'translate', onDragStateChange }: GizmoControlsProps) => {
  const transformRef = useRef<{ attach: (object: unknown) => void; detach: () => void } | null>(null);
  const { scene, camera, gl } = useThree();
  const { selectedObjectId, objects, actions, isDragEnabled, setIsDragging } = useSceneObjectsContext();
  const { isMobile, isTablet, isDesktop } = useDeviceType();
  
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  const selectedMesh = useRef<THREE.Object3D | null>(null);
  const [meshFound, setMeshFound] = useState(false); // Track when mesh is found to trigger re-render

  useEffect(() => {
    console.log('🔍 DEBUG: GizmoControls useEffect', { enabled, selectedObjectId });
    
    if (!enabled || !selectedObjectId) {
      selectedMesh.current = null;
      setMeshFound(false);
      if (transformRef.current) {
        transformRef.current.detach();
      }
      return;
    }

    // Find the selected mesh in the scene
    let mesh = null;
    if (selectedObjectId === 'main-scene-object') {
      mesh = scene.getObjectByName('main-scene-object');
      console.log('🔍 DEBUG: Looking for main-scene-object:', mesh);
    } else {
      mesh = scene.getObjectByName(selectedObjectId);
      console.log('🔍 DEBUG: Looking for object:', selectedObjectId, mesh);
    }
    
    selectedMesh.current = mesh || null;
    setMeshFound(!!mesh); // Update state to trigger re-render
    
    if (transformRef.current && selectedMesh.current) {
      console.log('🔍 DEBUG: Attaching gizmo to mesh:', selectedMesh.current);
      transformRef.current.attach(selectedMesh.current);
    } else {
      console.log('🔍 DEBUG: Failed to attach gizmo:', { 
        transformRef: !!transformRef.current, 
        selectedMesh: !!selectedMesh.current 
      });
    }
  }, [enabled, selectedObjectId, scene]);

  const handleObjectChange = () => {
    if (!selectedMesh.current) return;
    
    // Notify main object it's being manipulated
    if (selectedMesh.current.userData?.onObjectChange) {
      selectedMesh.current.userData.onObjectChange();
    }
    
    // Handle main scene object differently since it's not in the objects array
    if (selectedObjectId === 'main-scene-object') {
      // Main scene object position is managed by the gizmo directly
      return;
    }
    
    if (!selectedObject || !selectedMesh.current) return;
    
    const position: [number, number, number] = [
      selectedMesh.current.position?.x ?? 0,
      selectedMesh.current.position?.y ?? 0,
      selectedMesh.current.position?.z ?? 0
    ];
    
    const rotation: [number, number, number] = [
      selectedMesh.current.rotation?.x ?? 0,
      selectedMesh.current.rotation?.y ?? 0,
      selectedMesh.current.rotation?.z ?? 0
    ];
    
    const scale: [number, number, number] = [
      selectedMesh.current.scale?.x ?? 1,
      selectedMesh.current.scale?.y ?? 1,
      selectedMesh.current.scale?.z ?? 1
    ];

    actions.updateObject(selectedObject.id, { position, rotation, scale });
  };

  // Handle gizmo interaction states
  const handleTransformStart = useCallback(() => {
    setIsDragging(true);
    onDragStateChange?.(true);
  }, [setIsDragging, onDragStateChange]);

  const handleTransformEnd = useCallback(() => {
    setIsDragging(false);
    onDragStateChange?.(false);
  }, [setIsDragging, onDragStateChange]);

  const shouldShowGizmo = enabled && meshFound;

  if (!shouldShowGizmo) {
    return null;
  }

  return (
    <TransformControls
      ref={(ref) => {
        transformRef.current = ref;
        console.log('🔍 DEBUG: TransformControls ref callback:', !!ref);
      }}
      object={selectedMesh.current}
      mode={mode}
      size={isMobile ? 2.0 : isTablet ? 1.6 : 1.2} // Device-specific sizing for optimal interaction
      space="world"
      rotationSnap={null}
      translationSnap={null}
      scaleSnap={null}
      onObjectChange={handleObjectChange}
      onMouseDown={handleTransformStart}
      onMouseUp={handleTransformEnd}
      showX={true}
      showY={true}
      showZ={true}
    />
  );
};

export default GizmoControls;