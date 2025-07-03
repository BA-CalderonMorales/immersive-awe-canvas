import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type DefaultGeometry = Database['public']['Tables']['default_geometries']['Row'];

const fetchDefaultGeometries = async (): Promise<DefaultGeometry[]> => {
  const { data, error } = await supabase
    .from('default_geometries')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw new Error(error.message);
  
  return data || [];
};

export const useDefaultGeometries = () => {
  const [currentGeometryIndex, setCurrentGeometryIndex] = useState(0);

  const { data: geometries, isLoading, isError } = useQuery<DefaultGeometry[]>({
    queryKey: ['default_geometries'],
    queryFn: fetchDefaultGeometries,
  });

  const currentGeometry = useMemo(() => {
    if (!geometries || geometries.length === 0) return null;
    return geometries[currentGeometryIndex];
  }, [geometries, currentGeometryIndex]);

  const changeGeometry = useCallback((direction: 'next' | 'prev') => {
    if (!geometries || geometries.length === 0) return;

    setCurrentGeometryIndex((prevIndex) => {
      const newIndex = direction === 'next'
        ? (prevIndex + 1) % geometries.length
        : (prevIndex - 1 + geometries.length) % geometries.length;
      console.log('Changing geometry from index', prevIndex, 'to', newIndex);
      return newIndex;
    });
  }, [geometries]);

  const jumpToGeometry = useCallback((index: number) => {
    if (!geometries || geometries.length === 0 || index === currentGeometryIndex) {
      return;
    }

    console.log('Jumping to geometry index:', index);
    setCurrentGeometryIndex(index);
  }, [geometries, currentGeometryIndex]);

  return {
    geometries,
    isLoading,
    isError,
    currentGeometry,
    currentGeometryIndex,
    changeGeometry,
    jumpToGeometry,
  };
};