
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
            The Void Awaits
          </h1>
          <p className="text-lg md:text-xl text-white mix-blend-difference mt-4 animate-fade-in [animation-delay:0.5s]">
            An interactive journey through unknown realms.
          </p>
          <div className="mt-8 animate-fade-in [animation-delay:1s]">
            <Button asChild size="lg" className="text-lg pointer-events-auto">
              <Link to="/experience">Enter The Void</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
