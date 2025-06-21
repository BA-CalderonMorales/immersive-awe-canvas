
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LoadingOverlay from "@/components/experience/LoadingOverlay";

const fetchFirstFeaturedWorld = async () => {
  const { data, error } = await supabase
    .from('worlds')
    .select('slug')
    .eq('is_featured', true)
    .order('id', { ascending: true })
    .limit(1)
    .single();
  
  if (error) throw new Error(error.message);
  return data;
};

const ExperiencePage = () => {
  const { data: firstWorld, isLoading, isError } = useQuery({
    queryKey: ['firstWorld'],
    queryFn: fetchFirstFeaturedWorld,
  });

  if (isLoading) {
    return <LoadingOverlay message="Finding your starting world..." />;
  }

  if (isError || !firstWorld) {
    return <LoadingOverlay message="Could not load worlds." />;
  }

  return <Navigate to={`/experience/${firstWorld.slug}`} replace />;
};

export default ExperiencePage;
