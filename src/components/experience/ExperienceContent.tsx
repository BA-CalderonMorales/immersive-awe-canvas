
import { useParams, Navigate } from "react-router-dom";
import { KeyboardShortcutsProvider } from "@/context/KeyboardShortcutsContext";
import { useWorldBySlug } from "@/hooks/useWorlds";
import LoadingOverlay from "./LoadingOverlay";
import ExperienceLogic from "./ExperienceLogic";

const ExperienceContent = () => {
  const { worldSlug } = useParams<{ worldSlug: string }>();
  
  // Validate the world exists before rendering
  const { data: world, isLoading, isError } = useWorldBySlug(worldSlug || '');

  if (isLoading) {
    return <LoadingOverlay message="Loading world..." theme="night" />;
  }

  if (isError || !world) {
    return <Navigate to="/experience/genesis-torus" replace />;
  }

  return (
    <KeyboardShortcutsProvider>
      <ExperienceLogic key={world.slug} initialWorldSlug={world.slug} />
    </KeyboardShortcutsProvider>
  );
};

export default ExperienceContent;
