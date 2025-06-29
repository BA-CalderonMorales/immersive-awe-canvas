
import { createContext, useContext, ReactNode } from 'react';
import { useSceneObjects } from '@/hooks/useSceneObjects';
import { ObjectManagerState, ObjectManagerActions, SceneObject } from '@/types/sceneObjects';
import { MovementModeProvider } from './MovementModeContext';
import { SceneDragControlsProvider } from './SceneDragControlsContext';

interface SceneObjectsContextType extends ObjectManagerState {
  actions: ObjectManagerActions;
  selectedObject: SceneObject | null;
}

const SceneObjectsContext = createContext<SceneObjectsContextType | null>(null);

interface SceneObjectsProviderProps {
  children: ReactNode;
  mainObjectColor: string;
}

export const SceneObjectsProvider = ({ children, mainObjectColor }: SceneObjectsProviderProps) => {
  const sceneObjectsData = useSceneObjects(mainObjectColor);

  return (
    <MovementModeProvider>
      <SceneDragControlsProvider>
        <SceneObjectsContext.Provider value={sceneObjectsData}>
          {children}
        </SceneObjectsContext.Provider>
      </SceneDragControlsProvider>
    </MovementModeProvider>
  );
};

export const useSceneObjectsContext = () => {
  const context = useContext(SceneObjectsContext);
  if (!context) {
    throw new Error('useSceneObjectsContext must be used within a SceneObjectsProvider');
  }
  return context;
};
