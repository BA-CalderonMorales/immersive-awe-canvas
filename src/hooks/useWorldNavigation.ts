
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

interface UseWorldNavigationProps {
  worlds: any[] | undefined;
  currentWorldIndex: number;
  changeWorld: (direction: 'next' | 'prev') => void;
  jumpToWorld: (index: number) => void;
}

export const useWorldNavigation = ({
  worlds,
  currentWorldIndex,
  changeWorld,
  jumpToWorld,
}: UseWorldNavigationProps) => {
  const navigate = useNavigate();

  const handleChangeWorld = useCallback((direction: 'next' | 'prev') => {
    if (!worlds || worlds.length === 0) return;
    
    const currentIndex = currentWorldIndex;
    const nextIndex = direction === 'next' 
      ? (currentIndex + 1) % worlds.length
      : (currentIndex - 1 + worlds.length) % worlds.length;
    
    const nextWorld = worlds[nextIndex];
    if (nextWorld && nextWorld.slug) {
      console.log('Navigating to world:', nextWorld.slug);
      navigate(`/experience/${nextWorld.slug}`);
    }
    
    changeWorld(direction);
  }, [worlds, currentWorldIndex, navigate, changeWorld]);

  const handleJumpToWorld = useCallback((index: number) => {
    if (!worlds || !worlds[index]) return;
    
    const world = worlds[index];
    if (world.slug) {
      console.log('Jumping to world:', world.slug);
      navigate(`/experience/${world.slug}`);
    }
    
    jumpToWorld(index);
  }, [worlds, navigate, jumpToWorld]);

  return {
    handleChangeWorld,
    handleJumpToWorld,
  };
};
