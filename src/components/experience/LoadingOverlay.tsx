
import TransitionSplash from "@/components/TransitionSplash";

interface LoadingOverlayProps {
  message?: string;
  theme?: "day" | "night";
}

const LoadingOverlay = ({ message, theme = "day" }: LoadingOverlayProps) => {
  return (
    <TransitionSplash show={true} theme={theme}>
      {/* You can show {message} if desired for debugging */}
    </TransitionSplash>
  );
};

export default LoadingOverlay;
