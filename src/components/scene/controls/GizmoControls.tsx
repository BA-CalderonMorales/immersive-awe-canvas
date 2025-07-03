import { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import * as THREE from 'three';

interface GizmoControlsProps {
  enabled: boolean;
  mode?: 'translate' | 'rotate' | 'scale';
}

const GizmoControls = ({ enabled, mode = 'translate' }: GizmoControlsProps) => {
  const transformRef = useRef<any>(null);
  const { scene } = useThree();
  const { selectedObjectId, objects, actions } = useSceneObjectsContext();
  
  const selectedObject = objects.find(obj => obj.id === selectedObjectId);
  const selectedMesh = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    if (!enabled || !selectedObjectId) {
      selectedMesh.current = null;
      return;
    }

    // Find the selected mesh in the scene
    const mesh = scene.getObjectByName(selectedObjectId) || scene.getObjectByName('main-scene-object');
    selectedMesh.current = mesh || null;
    
    if (transformRef.current && selectedMesh.current) {
      transformRef.current.attach(selectedMesh.current);
    }
  }, [enabled, selectedObjectId, scene]);

  const handleObjectChange = () => {
    if (!selectedMesh.current || !selectedObject) return;
    
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

  if (!enabled || !selectedMesh.current) {
    return null;
  }

  return (
    <TransformControls
      ref={transformRef}
      object={selectedMesh.current}
      mode={mode}
      size={0.8}
      onObjectChange={handleObjectChange}
      showX={true}
      showY={true}
      showZ={true}
    />
  );
};

export default GizmoControls;