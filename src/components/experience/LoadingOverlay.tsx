
interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay = ({ message }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white transition-opacity duration-500">
      <div className="relative flex items-center justify-center w-28 h-28">
        <div className="absolute w-full h-full border-4 rounded-full border-cyan-400/20" />
        <div
          className="absolute w-full h-full border-t-4 border-b-4 rounded-full border-cyan-400 animate-spin"
          style={{ animationDuration: '3s' }}
        />
        <div className="absolute w-2/3 h-2/3 border-b-4 rounded-full border-cyan-400/80 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
        <div className="absolute w-1/3 h-1/3 border-t-2 border-r-2 rounded-full border-cyan-300 animate-ping" />
      </div>
      <p className="mt-8 text-lg animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
