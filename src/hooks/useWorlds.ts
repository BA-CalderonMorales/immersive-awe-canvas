
import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { World } from "@/types/world";
import { slugify } from "@/lib/slugify";
import { FEATURE_WORLD_SLUGS, PUBLIC_WORLD_LIMIT } from "@/config/featureFlags";


const fetchWorlds = async (): Promise<World[]> => {
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw new Error(error.message);
  const withSlugs = (data || []).map((w) => ({ ...w, slug: slugify(w.name) }));
  const filtered = withSlugs.filter((w) => FEATURE_WORLD_SLUGS.includes(w.slug));
  return filtered.slice(0, PUBLIC_WORLD_LIMIT);
};

export const useWorlds = (initialSlug?: string) => {
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: worlds, isLoading, isError } = useQuery<World[]>({
    queryKey: ['worlds'],
    queryFn: fetchWorlds,
  });

  // Sync current index with slug from route when worlds load
  useEffect(() => {
    if (!initialSlug || !worlds) return;
    const idx = worlds.findIndex((w) => w.slug === initialSlug);
    if (idx !== -1) {
      setCurrentWorldIndex(idx);
    }
  }, [initialSlug, worlds]);

  const worldData = useMemo(() => {
    if (!worlds || worlds.length === 0) return null;
    return worlds[currentWorldIndex];
  }, [worlds, currentWorldIndex]);

  const changeWorld = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning || !worlds || worlds.length === 0) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentWorldIndex((prevIndex) => {
        if (!worlds) return 0;
        const newIndex = direction === 'next'
          ? (prevIndex + 1) % worlds.length
          : (prevIndex - 1 + worlds.length) % worlds.length;
        return newIndex;
      });
      setIsTransitioning(false);
    }, 1000); // Transition time
  }, [isTransitioning, worlds]);

  const jumpToWorld = useCallback((index: number) => {
    if (isTransitioning || !worlds || worlds.length === 0 || index === currentWorldIndex) {
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentWorldIndex(index);
      setIsTransitioning(false);
    }, 1000); // Transition time
  }, [isTransitioning, worlds, currentWorldIndex]);

  return {
    worlds,
    isLoading,
    isError,
    worldData,
    currentWorldIndex,
    isTransitioning,
    changeWorld,
    jumpToWorld,
  };
};
