
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay = ({ message }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black text-white transition-opacity duration-500">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-lg animate-pulse">{message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
