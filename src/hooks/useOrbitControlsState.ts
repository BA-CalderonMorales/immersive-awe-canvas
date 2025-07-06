import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';

export const useOrbitControlsState = () => {
  const { isDragging, isDragEnabled } = useSceneObjectsContext();
  const { gl } = useThree();
  const orbitControlsRef = useRef<{ enabled: boolean } | null>(null);

  useEffect(() => {
    // Find orbit controls in the scene
    const scene = gl.domElement.parentElement;
    if (scene) {
      const canvas = scene.querySelector('canvas');
      if (canvas && orbitControlsRef.current) {
        // Disable orbit controls when dragging objects
        orbitControlsRef.current.enabled = !isDragging && !isDragEnabled;
      }
    }
  }, [isDragging, isDragEnabled, gl]);

  return { orbitControlsRef };
};