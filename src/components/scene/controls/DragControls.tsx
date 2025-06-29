
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DragControls as ThreeDragControls } from 'three-stdlib';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';

interface DragControlsProps {
  enabled: boolean;
}

const DragControls = ({ enabled }: DragControlsProps) => {
  const { camera, gl, scene } = useThree();
  const { objects, actions } = useSceneObjectsContext();
  const controlsRef = useRef<ThreeDragControls>();

  useEffect(() => {
    if (!enabled) {
      controlsRef.current?.dispose();
      controlsRef.current = undefined;
      return;
    }

    // Get all mesh objects from the scene
    const meshes = objects.map(obj => {
      const mesh = scene.getObjectByName(obj.id);
      return mesh;
    }).filter(Boolean);

    if (meshes.length === 0) return;

    const controls = new ThreeDragControls(meshes, camera, gl.domElement);
    controlsRef.current = controls;

    controls.addEventListener('dragstart', (event) => {
      const object = event.object;
      if (object.userData?.objectId) {
        actions.selectObject(object.userData.objectId);
      }
    });

    controls.addEventListener('drag', (event) => {
      const object = event.object;
      if (object.userData?.objectId) {
        const position: [number, number, number] = [
          object.position.x,
          object.position.y,
          object.position.z
        ];
        actions.updateObject(object.userData.objectId, { position });
      }
    });

    return () => {
      controls.dispose();
    };
  }, [enabled, objects, camera, gl, scene, actions]);

  return null;
};

export default DragControls;
