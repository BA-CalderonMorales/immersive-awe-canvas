
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

    setState(prev => ({
      ...prev,
      objects: [...prev.objects, newObject],
      selectedObjectId: newObject.id,
      isAddingObject: false,
    }));

    toast.success(`✨ ${type} added to scene! Right-click for options.`, {
      duration: 3000,
    });
  }, [mainObjectColor]);

  const removeObject = useCallback((id: string) => {
    const objectToRemove = state.objects.find(obj => obj.id === id);
    
    setState(prev => ({
      ...prev,
      objects: prev.objects.filter(obj => obj.id !== id),
      selectedObjectId: prev.selectedObjectId === id ? null : prev.selectedObjectId,
    }));
    
    if (objectToRemove) {
      toast.success(`🗑️ ${objectToRemove.type} removed from scene`);
    }
  }, [state.objects]);

  const updateObject = useCallback((id: string, updates: Partial<SceneObject>) => {
    console.log('Updating object:', id, updates);
    
    setState(prev => ({
      ...prev,
      objects: prev.objects.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    }));
  }, []);

  const selectObject = useCallback((id: string | null) => {
    console.log('Selecting object:', id);
    setState(prev => ({ ...prev, selectedObjectId: id }));
  }, []);

  const clearObjects = useCallback(() => {
    setState(prev => ({
      ...prev,
      objects: [],
      selectedObjectId: null,
    }));
    toast.success('🧹 All objects cleared from scene');
  }, []);

  const toggleAddMode = useCallback(() => {
    setState(prev => ({ ...prev, isAddingObject: !prev.isAddingObject }));
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
