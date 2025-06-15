
interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay = ({ message }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-opacity duration-500">
      <div className="relative flex items-center justify-center w-24 h-24">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full border-2 rounded-full border-cyan-400 animate-summon-pulse"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </div>
      <p className="mt-8 text-lg animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
