import TransitionSplash from "@/components/TransitionSplash";
import { useExperience } from "@/hooks/useExperience";

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay = ({ message }: LoadingOverlayProps) => {
  // fallback for message
  const { theme } = useExperience?.() || { theme: "day" };
  return (
    <TransitionSplash show={true} theme={theme || "day"}>
      {/* You can show {message} if desired for debugging */}
    </TransitionSplash>
  );
};

export default LoadingOverlay;
