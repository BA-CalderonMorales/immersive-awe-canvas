
import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DragControls as ThreeDragControls } from 'three-stdlib';
import { useSceneObjectsContext } from '@/context/SceneObjectsContext';
import * as THREE from 'three';

const MAIN_OBJECT_NAME = 'main-scene-object';

interface DragControlsProps {
  enabled: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DragControls = ({ enabled, onDragStart, onDragEnd }: DragControlsProps) => {
  const { camera, gl, scene } = useThree();
  const { objects, actions } = useSceneObjectsContext();
  const controlsRef = useRef<ThreeDragControls>();
  const dragStateRef = useRef<Map<THREE.Object3D, {
    initialDepth: number;
    startPosition: THREE.Vector3;
    targetPosition: THREE.Vector3;
    isDragging: boolean;
  }>>(new Map());

  useEffect(() => {
    if (!enabled) {
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = undefined;
      }
      dragStateRef.current.clear();
      return;
    }

    const draggableObjects: THREE.Object3D[] = [];
    
    // Add context objects from the object manager
    objects.forEach(obj => {
      const mesh = scene.getObjectByName(obj.id);
      if (mesh) {
        draggableObjects.push(mesh);
      }
    });

    // Add the main scene object
    const mainObject = scene.getObjectByName(MAIN_OBJECT_NAME);
    if (mainObject) {
      draggableObjects.push(mainObject);
    }

    if (draggableObjects.length === 0) return;

    const controls = new ThreeDragControls(draggableObjects, camera, gl.domElement);
    controlsRef.current = controls;

    // Disable auto-rotate and camera controls during drag
    controls.transformGroup = true;

    const handleDragStart = (event: any) => {
      const object = event.object as THREE.Object3D;
      object.userData.isBeingDragged = true;
      
      // Calculate initial depth in camera space for consistent movement
      const worldPosition = new THREE.Vector3();
      object.getWorldPosition(worldPosition);
      
      // Get distance from camera for maintaining depth
      const cameraDistance = camera.position.distanceTo(worldPosition);
      
      // Store drag state
      dragStateRef.current.set(object, {
        initialDepth: cameraDistance,
        startPosition: object.position.clone(),
        targetPosition: object.position.clone(),
        isDragging: true
      });

      if (object.userData?.objectId) {
        actions.selectObject(object.userData.objectId);
      }
      
      // Disable camera controls during drag
      gl.domElement.style.cursor = 'grabbing';
      onDragStart?.();
    };

    const handleDrag = (event: any) => {
      const object = event.object as THREE.Object3D;
      const dragState = dragStateRef.current.get(object);
      
      if (!dragState) return;

      // Get mouse position in normalized device coordinates
      const mouse = new THREE.Vector2();
      mouse.x = (event.pointer.x / gl.domElement.clientWidth) * 2 - 1;
      mouse.y = -(event.pointer.y / gl.domElement.clientHeight) * 2 + 1;

      // Create raycaster for depth-constrained movement
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Create a plane at the initial depth for movement constraint
      const cameraDirection = new THREE.Vector3();
      camera.getWorldDirection(cameraDirection);
      
      const planePosition = new THREE.Vector3();
      planePosition.copy(camera.position).add(cameraDirection.multiplyScalar(dragState.initialDepth));
      
      const plane = new THREE.Plane();
      plane.setFromNormalAndCoplanarPoint(cameraDirection.negate(), planePosition);

      // Find intersection with the depth plane
      const intersection = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      if (intersection) {
        // Convert world position to local position for the object
        const parent = object.parent;
        if (parent) {
          const localPosition = parent.worldToLocal(intersection.clone());
          
          // Smooth the movement with interpolation
          dragState.targetPosition.copy(localPosition);
          
          // Apply smooth interpolation for natural feel
          object.position.lerp(dragState.targetPosition, 0.3);
        } else {
          object.position.lerp(intersection, 0.3);
        }

        // Update object manager state
        if (object.userData?.objectId) {
          const position: [number, number, number] = [
            object.position.x,
            object.position.y,
            object.position.z
          ];
          actions.updateObject(object.userData.objectId, { position });
        }
      }
    };

    const handleDragEnd = (event: any) => {
      const object = event.object as THREE.Object3D;
      const dragState = dragStateRef.current.get(object);
      
      if (dragState) {
        dragState.isDragging = false;
        object.userData.isBeingDragged = false;
        
        // Clean up drag state
        dragStateRef.current.delete(object);
      }
      
      // Re-enable camera controls
      gl.domElement.style.cursor = 'grab';
      onDragEnd?.();
    };

    controls.addEventListener('dragstart', handleDragStart);
    controls.addEventListener('drag', handleDrag);
    controls.addEventListener('dragend', handleDragEnd);

    return () => {
      controls.removeEventListener('dragstart', handleDragStart);
      controls.removeEventListener('drag', handleDrag);
      controls.removeEventListener('dragend', handleDragEnd);
      controls.dispose();
      dragStateRef.current.clear();
    };
  }, [enabled, objects, camera, gl, scene, actions, onDragStart, onDragEnd]);

  return null;
};

export default DragControls;
