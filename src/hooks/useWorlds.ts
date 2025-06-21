
import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { isWorldEnabled } from "@/lib/featureFlags";
import { useNavigate } from "react-router-dom";

type WorldRow = Database['public']['Tables']['worlds']['Row'];
export interface World extends WorldRow {
  slug: string;
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const fetchWorlds = async (): Promise<World[]> => {
  const { data, error } = await supabase.from('worlds').select('*').order('id', { ascending: true });
  if (error) throw new Error(error.message);
  const rows = (data || []) as WorldRow[];
  return rows
    .map((w) => ({ ...w, slug: slugify(w.name) }))
    .filter((w) => isWorldEnabled(w.slug));
};

export const useWorlds = (initialSlug?: string) => {
  const [currentWorldIndex, setCurrentWorldIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const { data: worlds, isLoading, isError } = useQuery<World[]>({
    queryKey: ['worlds'],
    queryFn: fetchWorlds,
  });

  const worldData = useMemo(() => {
    if (!worlds || worlds.length === 0) return null;
    return worlds[currentWorldIndex];
  }, [worlds, currentWorldIndex]);

  useEffect(() => {
    if (!worlds) return;
    if (initialSlug) {
      const idx = worlds.findIndex((w) => w.slug === initialSlug);
      if (idx >= 0) {
        setCurrentWorldIndex(idx);
      }
    }
  }, [initialSlug, worlds]);

  useEffect(() => {
    if (worlds && worlds[currentWorldIndex]) {
      navigate(`/experience/${worlds[currentWorldIndex].slug}`, { replace: true });
    }
  }, [worlds, currentWorldIndex, navigate]);

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
