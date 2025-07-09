
import { useState, useEffect, useCallback } from 'react';
import { logEvent } from '@/lib/logger';

const LIKES_STORAGE_KEY = 'world-likes';

const getLikesFromStorage = (): Set<number> => {
  try {
    const storedLikes = localStorage.getItem(LIKES_STORAGE_KEY);
    if (storedLikes) {
      const parsed = JSON.parse(storedLikes);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
    }
  } catch (error) {
    console.error('Error reading likes from localStorage', error);
  }
  return new Set();
};

export const useLikes = () => {
  const [likedWorlds, setLikedWorlds] = useState<Set<number>>(new Set());

  useEffect(() => {
    setLikedWorlds(getLikesFromStorage());
  }, []);

  const isLiked = useCallback(
    (worldId: number) => {
      return likedWorlds.has(worldId);
    },
    [likedWorlds]
  );

  const toggleLike = useCallback((worldId: number, worldName: string) => {
    const newLikedWorlds = new Set(likedWorlds);
    let liked;
    if (newLikedWorlds.has(worldId)) {
      newLikedWorlds.delete(worldId);
      liked = false;
    } else {
      newLikedWorlds.add(worldId);
      liked = true;
    }
    setLikedWorlds(newLikedWorlds);
    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(newLikedWorlds)));
    logEvent({
        eventType: 'world_like_toggled',
        eventSource: 'useLikes',
        metadata: { worldId, worldName, liked }
    });
  }, [likedWorlds]);

  return { isLiked, toggleLike };
};
