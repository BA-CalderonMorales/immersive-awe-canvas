
import TransitionSplash from "@/components/TransitionSplash";

interface LoadingOverlayProps {
  message?: string;
  theme?: "day" | "night";
}

const LoadingOverlay = ({ message, theme = "day" }: LoadingOverlayProps) => {
  return (
    <TransitionSplash show={true} theme={theme} type="loading">
      <div className="flex flex-col items-center space-y-4">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ 
            borderColor: theme === 'day' ? '#00000020' : '#ffffff20',
            borderTopColor: theme === 'day' ? '#000000' : '#ffffff'
          }}
        />
        {message && (
          <p className={`text-sm font-medium tracking-wide ${
            theme === 'day' ? 'text-slate-800' : 'text-blue-200'
          }`}>
            {message}
          </p>
        )}
      </div>
    </TransitionSplash>
  );
};

export default LoadingOverlay;
