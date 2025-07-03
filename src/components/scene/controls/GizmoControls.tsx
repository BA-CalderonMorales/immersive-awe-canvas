import { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import { useIsMobile } from '@/hooks/use-mobile';
import * as THREE from 'three';

interface GizmoControlsProps {
  enabled: boolean;
  mode?: 'translate' | 'rotate' | 'scale';
}

const GizmoControls = ({ enabled, mode = 'translate' }: GizmoControlsProps) => {
  const transformRef = useRef<any>(null);
  const { scene, camera, gl } = useThree();
  const { selectedObjectId, objects, actions, isDragEnabled } = useSceneObjectsContext();
  const isMobile = useIsMobile();
  
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  const selectedMesh = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!enabled || !selectedObjectId) {
      selectedMesh.current = null;
      if (transformRef.current) {
        transformRef.current.detach();
      }
      return;
    }

    // Find the selected mesh in the scene
    let mesh = null;
    if (selectedObjectId === 'main-scene-object') {
      mesh = scene.getObjectByName('main-scene-object');
    } else {
      mesh = scene.getObjectByName(selectedObjectId);
    }
    
    selectedMesh.current = mesh || null;
    
    if (transformRef.current && selectedMesh.current) {
      transformRef.current.attach(selectedMesh.current);
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
    
    if (!selectedObject) return;
    
    const position: [number, number, number] = [
      selectedMesh.current.position.x,
      selectedMesh.current.position.y,
      selectedMesh.current.position.z
    ];
    
    const rotation: [number, number, number] = [
      selectedMesh.current.rotation.x,
      selectedMesh.current.rotation.y,
      selectedMesh.current.rotation.z
    ];
    
    const scale: [number, number, number] = [
      selectedMesh.current.scale.x,
      selectedMesh.current.scale.y,
      selectedMesh.current.scale.z
    ];

    actions.updateObject(selectedObject.id, { position, rotation, scale });
  };

  // Only show gizmo when drag mode is enabled AND object is selected
  const shouldShowGizmo = enabled && isDragEnabled && selectedMesh.current;

  if (!shouldShowGizmo) {
    return null;
  }

  return (
    <TransformControls
      ref={transformRef}
      object={selectedMesh.current}
      mode={mode}
      size={isMobile ? 1.5 : 1.0} // Larger size on mobile for easier touch interaction
      space="world"
      rotationSnap={null}
      translationSnap={null}
      scaleSnap={null}
      onObjectChange={handleObjectChange}
      showX={true}
      showY={true}
      showZ={true}
      // Prevent camera controls interference on mobile
      onMouseDown={() => {
        if (gl.domElement) {
          gl.domElement.style.touchAction = 'none';
        }
      }}
      onMouseUp={() => {
        if (gl.domElement) {
          gl.domElement.style.touchAction = 'pan-x pan-y';
        }
      }}
    />
  );
};

export default GizmoControls;