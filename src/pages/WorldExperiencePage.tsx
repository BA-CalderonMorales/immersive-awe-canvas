import { useParams, Navigate } from "@tanstack/react-router";
import { ExperienceProvider } from "@/context/ExperienceContext";
import ExperienceContent from "@/components/experience/ExperienceContent";
import { useWorldBySlug } from "@/hooks/useWorlds";
import LoadingOverlay from "@/components/experience/LoadingOverlay";

const WorldExperiencePage = () => {

  const { worldSlug } = useParams<{ worldSlug: string }>();
  
  const { data: world, isLoading, isError } = useWorldBySlug(worldSlug || '');

  if (isLoading) {
    return <LoadingOverlay message="Loading world..." theme="night" />;
  }

  if (isError || !world) {
    return <Navigate to="/" replace />;
  }

  return (

    <ExperienceProvider>
      <ExperienceContent key={world.slug} initialWorldSlug={world.slug} />
    </ExperienceProvider>
  
  );

};

export default WorldExperiencePage;
