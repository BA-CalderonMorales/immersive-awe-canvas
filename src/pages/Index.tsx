
import Scene from '@/components/Scene';

const Index = () => {
  return (
    <div className="relative w-full h-full">
      <Scene />
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mix-blend-difference animate-fade-in">
            A Web Experience
          </h1>
          <p className="text-lg md:text-xl text-white mix-blend-difference mt-4 animate-fade-in [animation-delay:0.5s]">
            Drag to explore.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
