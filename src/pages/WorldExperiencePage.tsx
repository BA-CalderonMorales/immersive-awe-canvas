
import { useParams, Navigate } from "react-router-dom";
import { ExperienceProvider } from "@/context/ExperienceContext";
import ExperienceContent from "@/components/experience/ExperienceContent";
import { useWorldBySlug } from "@/hooks/useWorlds";
import LoadingOverlay from "@/components/experience/LoadingOverlay";

const WorldExperiencePage = () => {
  const { worldSlug } = useParams<{ worldSlug: string }>();
  const { data: world, isLoading, isError } = useWorldBySlug(worldSlug || '');

  if (isLoading) {
    return <LoadingOverlay message="Loading world..." />;
  }

  if (isError || !world) {
    return <Navigate to="/experience" replace />;
  }

  return (
    <ExperienceProvider>
      <ExperienceContent initialWorldSlug={worldSlug} />
    </ExperienceProvider>
  );
};

export default WorldExperiencePage;
