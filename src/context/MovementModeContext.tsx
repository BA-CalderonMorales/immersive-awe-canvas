
import { createContext, useContext, ReactNode, useState } from 'react';

type MovementMode = 'none' | 'x-axis' | 'y-axis' | 'z-axis' | 'freehand';

interface MovementModeContextType {
  movementMode: MovementMode;
  setMovementMode: (mode: MovementMode) => void;
}

const MovementModeContext = createContext<MovementModeContextType | null>(null);

interface MovementModeProviderProps {
  children: ReactNode;
}

export const MovementModeProvider = ({ children }: MovementModeProviderProps) => {
  const [movementMode, setMovementMode] = useState<MovementMode>('freehand');

  return (
    <MovementModeContext.Provider value={{ movementMode, setMovementMode }}>
      {children}
    </MovementModeContext.Provider>
  );
};

export const useMovementMode = () => {
  const context = useContext(MovementModeContext);
  if (!context) {
    throw new Error('useMovementMode must be used within a MovementModeProvider');
  }
  return context;
};
