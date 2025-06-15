
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BackgroundScene from "@/components/BackgroundScene";

const HomePage = () => {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 z-0">
        <BackgroundScene />
      </div>
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mix-blend-difference animate-fade-in">
            Echoes
          </h1>
          <div className="mt-8 animate-fade-in [animation-delay:0.5s]">
            <Button asChild size="lg" className="text-lg pointer-events-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.8)]">
              <Link to="/experience">Enter</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
