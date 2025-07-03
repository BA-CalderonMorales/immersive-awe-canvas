import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Background = Database['public']['Tables']['backgrounds']['Row'];

const fetchBackgrounds = async (): Promise<Background[]> => {
  const { data, error } = await supabase
    .from('backgrounds')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw new Error(error.message);
  
  return data || [];
};

export const useBackgrounds = () => {
  const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: backgrounds, isLoading, isError } = useQuery<Background[]>({
    queryKey: ['backgrounds'],
    queryFn: fetchBackgrounds,
  });

  const currentBackground = useMemo(() => {
    if (!backgrounds || backgrounds.length === 0) return null;
    return backgrounds[currentBackgroundIndex];
  }, [backgrounds, currentBackgroundIndex]);

  const changeBackground = useCallback((direction: 'next' | 'prev') => {
    if (isTransitioning || !backgrounds || backgrounds.length === 0) return;

    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentBackgroundIndex((prevIndex) => {
        if (!backgrounds) return 0;
        const newIndex = direction === 'next'
          ? (prevIndex + 1) % backgrounds.length
          : (prevIndex - 1 + backgrounds.length) % backgrounds.length;
        console.log('Changing background from index', prevIndex, 'to', newIndex);
        return newIndex;
      });
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 200);
  }, [isTransitioning, backgrounds]);

  const jumpToBackground = useCallback((index: number) => {
    if (isTransitioning || !backgrounds || backgrounds.length === 0 || index === currentBackgroundIndex) {
      return;
    }

    console.log('Jumping to background index:', index);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentBackgroundIndex(index);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 200);
  }, [isTransitioning, backgrounds, currentBackgroundIndex]);

  return {
    backgrounds,
    isLoading,
    isError,
    currentBackground,
    currentBackgroundIndex,
    isTransitioning,
    changeBackground,
    jumpToBackground,
  };
};