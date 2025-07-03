
import { useState, useCallback } from 'react';
import { SceneObject, ObjectManagerState, ObjectManagerActions } from '@/types/sceneObjects';
import { toast } from 'sonner';

const GEOMETRIES = [
  { type: 'box' as const, name: 'Box' },
  { type: 'sphere' as const, name: 'Sphere' },
  { type: 'cylinder' as const, name: 'Cylinder' },
  { type: 'cone' as const, name: 'Cone' },
  { type: 'torus' as const, name: 'Torus' },
];

export const useSceneObjects = (mainObjectColor: string = '#ffffff') => {
  const [state, setState] = useState<ObjectManagerState>({
    objects: [],
    selectedObjectId: null,
    isAddingObject: false,
    availableGeometries: GEOMETRIES,
  });

  const addObject = useCallback((type: SceneObject['type']) => {
    const newObject: SceneObject = {
      id: `obj_${Date.now()}`,
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

    setState(prev => ({
      ...prev,
      objects: [...prev.objects, newObject],
      selectedObjectId: newObject.id,
    }));

    toast.success(`${type} added`);
  }, [mainObjectColor]);

  const removeObject = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      objects: prev.objects.filter(obj => obj.id !== id),
      selectedObjectId: prev.selectedObjectId === id ? null : prev.selectedObjectId,
    }));
    toast.success('Object removed');
  }, []);

  const updateObject = useCallback((id: string, updates: Partial<SceneObject>) => {
    setState(prev => ({
      ...prev,
      objects: prev.objects.map(obj => 
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    }));
  }, []);

  const selectObject = useCallback((id: string | null) => {
    console.log('🔍 DEBUG: useSceneObjects.selectObject called', { id, previousId: state.selectedObjectId });
    setState(prev => ({ ...prev, selectedObjectId: id }));
  }, [state.selectedObjectId]);

  const clearObjects = useCallback(() => {
    setState(prev => ({ ...prev, objects: [], selectedObjectId: null }));
    toast.success('All objects cleared');
  }, []);

  const actions: ObjectManagerActions = {
    addObject,
    removeObject,
    updateObject,
    selectObject,
    clearObjects,
    toggleAddMode: () => {}, // Simplified - no longer needed
  };

  return {
    ...state,
    actions,
    selectedObject: state.objects.find(obj => obj.id === state.selectedObjectId) || null,
  };
};
