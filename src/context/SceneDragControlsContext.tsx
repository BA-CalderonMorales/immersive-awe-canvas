
import { createContext, useContext, ReactNode, useRef } from 'react';
import { Mesh } from 'three';

interface SceneDragControlsContextType {
  registerObject: (id: string, mesh: Mesh) => void;
  unregisterObject: (id: string) => void;
  objectRefs: React.MutableRefObject<Map<string, Mesh>>;
}

const SceneDragControlsContext = createContext<SceneDragControlsContextType | null>(null);

interface SceneDragControlsProviderProps {
  children: ReactNode;
}

export const SceneDragControlsProvider = ({ children }: SceneDragControlsProviderProps) => {
  const objectRefs = useRef<Map<string, Mesh>>(new Map());

  const registerObject = (id: string, mesh: Mesh) => {
    objectRefs.current.set(id, mesh);
  };

  const unregisterObject = (id: string) => {
    objectRefs.current.delete(id);
  };

  return (
    <SceneDragControlsContext.Provider value={{ registerObject, unregisterObject, objectRefs }}>
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
