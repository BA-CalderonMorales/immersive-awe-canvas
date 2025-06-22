
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface UseWorldNavigationProps {
  worlds: any[] | undefined;
  currentWorldIndex: number;
  jumpToWorld: (index: number) => void;
}

export const useWorldNavigation = ({
  worlds,
  currentWorldIndex,
  jumpToWorld,
}: UseWorldNavigationProps) => {
  const navigate = useNavigate();

  const handleChangeWorld = useCallback((direction: 'next' | 'prev') => {
    if (!worlds || worlds.length === 0) return;
    
    const nextIndex = direction === 'next' 
      ? (currentWorldIndex + 1) % worlds.length
      : (currentWorldIndex - 1 + worlds.length) % worlds.length;
    
    const nextWorld = worlds[nextIndex];
    if (nextWorld && nextWorld.slug) {
      console.log('Navigating to world:', nextWorld.slug);
      navigate(`/experience/${nextWorld.slug}`);
    }
  }, [worlds, currentWorldIndex, navigate]);

  const handleJumpToWorld = useCallback((index: number) => {
    if (!worlds || !worlds[index]) return;
    
    const world = worlds[index];
    if (world.slug) {
      console.log('Jumping to world:', world.slug);
      navigate(`/experience/${world.slug}`);
    }
  }, [worlds, navigate]);

  return {
    handleChangeWorld,
    handleJumpToWorld,
  };
};
