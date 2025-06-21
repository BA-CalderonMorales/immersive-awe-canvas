
import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type World = Database['public']['Tables']['worlds']['Row'];

const fetchWorlds = async (): Promise<World[]> => {
  
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .eq('is_featured', true)
    .order('id', { ascending: true });
  
  if (error) throw new Error(error.message);
  
  return data || [];

};

const fetchWorldBySlug = async (slug: string): Promise<World | null> => {
  
  const { data, error } = await supabase
    .from('worlds')
    .select('*')
    .eq('slug', slug)
    .eq('is_featured', true)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw new Error(error.message);
  }
  
  return data;

};

export const useWorlds = (initialSlug?: string) => {

  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: worlds, isLoading, isError } = useQuery<World[]>({
    queryKey: ['worlds'],
    queryFn: fetchWorlds,
  });

  const { data: initialWorld } = useQuery<World | null>({
    queryKey: ['world', initialSlug],
    queryFn: () => initialSlug ? fetchWorldBySlug(initialSlug) : Promise.resolve(null),
    enabled: !!initialSlug,
  });

  // Set initial world index based on slug
  useEffect(() => {
  
    if (initialWorld && worlds) {
  
      const index = worlds.findIndex(w => w.slug === initialWorld.slug);
      if (index !== -1) {
        setCurrentWorldIndex(index);
      }
    
    }
  
  }, [initialWorld, worlds]);

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
    }, 1000);
  
  }, [isTransitioning, worlds]);

  const jumpToWorld = useCallback((index: number) => {
  
    if (isTransitioning || !worlds || worlds.length === 0 || index === currentWorldIndex) {
      return;
    }

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

  return useQuery<World | null>({
    queryKey: ['world', slug],
    queryFn: () => fetchWorldBySlug(slug),
    enabled: !!slug,
  });

};
