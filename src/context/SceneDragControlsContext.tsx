
import { createContext, useContext, ReactNode } from 'react';
import { useSceneDragControls } from '@/components/scene/hooks/useSceneDragControls';
import { Mesh } from 'three';

interface SceneDragControlsContextType {
  registerObject: (id: string, mesh: Mesh) => void;
  unregisterObject: (id: string) => void;
}

const SceneDragControlsContext = createContext<SceneDragControlsContextType | null>(null);

interface SceneDragControlsProviderProps {
  children: ReactNode;
}

export const SceneDragControlsProvider = ({ children }: SceneDragControlsProviderProps) => {
  const { registerObject, unregisterObject } = useSceneDragControls();

  return (
    <SceneDragControlsContext.Provider value={{ registerObject, unregisterObject }}>
      {children}
    </SceneDragControlsContext.Provider>
  );
};

export const useSceneDragControlsContext = () => {
  const context = useContext(SceneDragControlsContext);
  if (!context) {
    throw new Error('useSceneDragControlsContext must be used within a SceneDragControlsProvider');
  }
  return context;
};
