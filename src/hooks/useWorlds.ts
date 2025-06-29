
import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { DatabaseWorld, WorldData } from "@/types/scene";

type World = Database['public']['Tables']['worlds']['Row'];

const transformWorldData = (world: World): WorldData => ({
  id: world.id.toString(),
  slug: world.slug || '',
  name: world.name,
  sceneConfig: world.scene_config as any,
  scene_config: world.scene_config,
  cameraPosition: [0, 0, 8], // Default camera position
  ui_day_color: world.ui_day_color || '#ffffff',
  ui_night_color: world.ui_night_color || '#ffffff',
});

const fetchWorlds = async (): Promise<WorldData[]> => {
  console.log('Fetching worlds from Supabase...');
  
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .eq('is_featured', true)
    .order('id', { ascending: true });
  
  if (error) {
    console.error('Error fetching worlds:', error);
    throw new Error(error.message);
  }
  
  console.log('Fetched worlds:', data?.length || 0);
  return (data || []).map(transformWorldData);
};

const fetchWorldBySlug = async (slug: string): Promise<WorldData | null> => {
  console.log('Fetching world by slug:', slug);
  
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .eq('slug', slug)
    .eq('is_featured', true)
    .single();
  
  if (error) {
    console.error('Error fetching world by slug:', error);
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(error.message);
  }
  
  console.log('Fetched world by slug:', data?.name);
  return data ? transformWorldData(data) : null;
};

export const useWorlds = (initialSlug?: string) => {
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  console.log('useWorlds called with initialSlug:', initialSlug);

  const { data: worlds, isLoading: worldsLoading, isError: worldsError } = useQuery<WorldData[]>({
    queryKey: ['worlds'],
    queryFn: fetchWorlds,
  });

  const { data: initialWorld, isLoading: initialWorldLoading } = useQuery<WorldData | null>({
    queryKey: ['world', initialSlug],
    queryFn: () => initialSlug ? fetchWorldBySlug(initialSlug) : Promise.resolve(null),
    enabled: !!initialSlug,
  });

  const isLoading = worldsLoading || (initialSlug && initialWorldLoading);
  const isError = worldsError;

  // Set initial world index based on slug
  useEffect(() => {
    if (initialWorld && worlds) {
      const index = worlds.findIndex(w => w.slug === initialWorld.slug);
      if (index !== -1 && index !== currentWorldIndex) {
        console.log('Setting world index to:', index, 'for slug:', initialWorld.slug);
        setCurrentWorldIndex(index);
      }
    } else if (worlds && worlds.length > 0 && !initialSlug) {
      // If no initial slug provided, default to first world
      setCurrentWorldIndex(0);
    }
  }, [initialWorld, worlds, initialSlug, currentWorldIndex]);

  const worldData = useMemo(() => {
    if (!worlds || worlds.length === 0) {
      console.log('No worlds available');
      return null;
    }
    const world = worlds[currentWorldIndex];
    console.log('Current world:', world?.name, 'at index:', currentWorldIndex);
    return world;
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
        console.log('Changing world from index', prevIndex, 'to', newIndex);
        return newIndex;
      });
      
      setIsTransitioning(false);
    }, 1000);
  }, [isTransitioning, worlds]);

  const jumpToWorld = useCallback((index: number) => {
    if (isTransitioning || !worlds || worlds.length === 0 || index === currentWorldIndex) {
      return;
    }

    console.log('Jumping to world index:', index);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentWorldIndex(index);
      setIsTransitioning(false);
    }, 1000);
  }, [isTransitioning, worlds, currentWorldIndex]);

  const jumpToWorldBySlug = useCallback((slug: string) => {
    if (!worlds) return;
    
    const index = worlds.findIndex(w => w.slug === slug);
    
    if (index !== -1) {
      console.log('Jumping to world by slug:', slug, 'at index:', index);
      jumpToWorld(index);
    }
  }, [worlds, jumpToWorld]);

  return {
    worlds,
    isLoading,
    isError,
    worldData,
    currentWorldIndex,
    isTransitioning,
    changeWorld,
    jumpToWorld,
    jumpToWorldBySlug,
    initialWorld,
  };
};

export const useWorldBySlug = (slug: string) => {
  return useQuery<WorldData | null>({
    queryKey: ['world', slug],
    queryFn: () => fetchWorldBySlug(slug),
    enabled: !!slug,
  });
};
