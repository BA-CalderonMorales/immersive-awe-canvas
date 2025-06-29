
import { useState, useCallback } from 'react';
import { SceneObject, ObjectManagerState, ObjectManagerActions } from '@/types/sceneObjects';
import { toast } from 'sonner';

const DEFAULT_GEOMETRIES = [
  { type: 'box' as const, name: 'Box', defaultArgs: [1, 1, 1] },
  { type: 'sphere' as const, name: 'Sphere', defaultArgs: [0.5, 32, 32] },
  { type: 'cylinder' as const, name: 'Cylinder', defaultArgs: [0.5, 0.5, 1, 32] },
  { type: 'cone' as const, name: 'Cone', defaultArgs: [0.5, 1, 32] },
  { type: 'torus' as const, name: 'Torus', defaultArgs: [0.4, 0.1, 16, 100] },
  { type: 'dodecahedron' as const, name: 'Dodecahedron', defaultArgs: [0.5, 0] },
  { type: 'icosahedron' as const, name: 'Icosahedron', defaultArgs: [0.5, 0] },
  { type: 'octahedron' as const, name: 'Octahedron', defaultArgs: [0.5, 0] },
  { type: 'tetrahedron' as const, name: 'Tetrahedron', defaultArgs: [0.5, 0] },
  { type: 'plane' as const, name: 'Plane', defaultArgs: [1, 1] },
  { type: 'ring' as const, name: 'Ring', defaultArgs: [0.2, 0.5, 32] },
  { type: 'torusKnot' as const, name: 'Torus Knot', defaultArgs: [0.4, 0.15, 128, 16] },
];

export const useSceneObjects = (mainObjectColor: string = '#ffffff') => {
  const [state, setState] = useState<ObjectManagerState>({
    objects: [],
    selectedObjectId: null,
    isAddingObject: false,
    availableGeometries: DEFAULT_GEOMETRIES,
  });

  const generateId = () => `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const addObject = useCallback((type: SceneObject['type']) => {
    const newObject: SceneObject = {
      id: generateId(),
      type,
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: mainObjectColor,
      material: {
        type: 'standard',
        metalness: 0.1,
        roughness: 0.4,
        wireframe: false,
        transparent: false,
        opacity: 1,
      },
    };

    console.log('Adding new object:', newObject);

    setState(prev => {
      const newState = {
        ...prev,
        objects: [...prev.objects, newObject],
        selectedObjectId: newObject.id,
        isAddingObject: false,
      };
      console.log('New state after adding object:', newState);
      return newState;
    });

    toast.success(`✨ ${type} added to scene!`, {
      description: "Right-click or long-press for more options",
      duration: 3000,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  }, [mainObjectColor]);

  const removeObject = useCallback((id: string) => {
    console.log('Removing object with id:', id);
    
    setState(prev => {
      const objectToRemove = prev.objects.find(obj => obj.id === id);
      
      if (!objectToRemove) {
        console.warn('Object not found for removal:', id);
        return prev;
      }
      
      const newState = {
        ...prev,
        objects: prev.objects.filter(obj => obj.id !== id),
        selectedObjectId: prev.selectedObjectId === id ? null : prev.selectedObjectId,
      };
      
      console.log('Object removed:', objectToRemove);
      console.log('New state after removal:', newState);
      return newState;
    });
  }, []);

  const updateObject = useCallback((id: string, updates: Partial<SceneObject>) => {
    console.log('Updating object:', id, updates);
    
    setState(prev => {
      const objectIndex = prev.objects.findIndex(obj => obj.id === id);
      
      if (objectIndex === -1) {
        console.warn('Object not found for update:', id);
        return prev;
      }
      
      const updatedObjects = [...prev.objects];
      updatedObjects[objectIndex] = { ...updatedObjects[objectIndex], ...updates };
      
      const newState = {
        ...prev,
        objects: updatedObjects,
      };
      
      console.log('Object updated:', updatedObjects[objectIndex]);
      return newState;
    });
  }, []);

  const selectObject = useCallback((id: string | null) => {
    console.log('Selecting object:', id);
    setState(prev => {
      if (prev.selectedObjectId === id) {
        return prev; // No change needed
      }
      
      const newState = { ...prev, selectedObjectId: id };
      console.log('Selection changed to:', id);
      return newState;
    });
  }, []);

  const clearObjects = useCallback(() => {
    console.log('Clearing all objects');
    setState(prev => ({
      ...prev,
      objects: [],
      selectedObjectId: null,
    }));
    
    toast.success('🧹 All objects cleared', {
      description: "Scene reset to default state",
      duration: 2500,
      style: {
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#fff',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        backdropFilter: 'blur(8px)',
      },
    });
  }, []);

  const toggleAddMode = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isAddingObject: !prev.isAddingObject };
      console.log('Add mode toggled:', newState.isAddingObject);
      return newState;
    });
  }, []);

  const actions: ObjectManagerActions = {
    addObject,
    removeObject,
    updateObject,
    selectObject,
    clearObjects,
    toggleAddMode,
  };

  return {
    ...state,
    actions,
    selectedObject: state.objects.find(obj => obj.id === state.selectedObjectId) || null,
  };
};
