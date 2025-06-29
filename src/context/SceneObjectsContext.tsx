import { createContext, useContext, ReactNode, useState, useRef } from 'react';
import { useSceneObjects } from '@/hooks/useSceneObjects';
import { ObjectManagerState, ObjectManagerActions, SceneObject } from '@/types/sceneObjects';
import * as THREE from 'three';

interface SceneObjectsContextType extends ObjectManagerState {
  actions: ObjectManagerActions;
  selectedObject: SceneObject | null;
  isDragEnabled: boolean;
  forceWireframe: boolean;
  setForceWireframe: (force: boolean) => void;
  objectRefs: React.MutableRefObject<Map<string, THREE.Object3D | null>>;
}

const SceneObjectsContext = createContext<SceneObjectsContextType | null>(null);

interface SceneObjectsProviderProps {
  children: ReactNode;
  mainObjectColor?: string;
  isDragEnabled?: boolean;
}

export const SceneObjectsProvider = ({ 
  children, 
  mainObjectColor = '#ffffff',
  isDragEnabled = false
}: SceneObjectsProviderProps) => {
  const sceneObjectsData = useSceneObjects(mainObjectColor);
  const [forceWireframe, setForceWireframe] = useState(false);
  const objectRefs = useRef<Map<string, THREE.Object3D | null>>(new Map());

  return (
    <SceneObjectsContext.Provider value={{
      ...sceneObjectsData,
      isDragEnabled,
      forceWireframe,
      setForceWireframe,
      objectRefs,
    }}>
      {children}
    </SceneObjectsContext.Provider>
  );
};

export const useSceneObjectsContext = () => {
  const context = useContext(SceneObjectsContext);
  if (!context) {
    throw new Error('useSceneObjectsContext must be used within a SceneObjectsProvider');
  }
  return context;
};