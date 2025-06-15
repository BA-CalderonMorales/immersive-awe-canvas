
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { World1, World2, World3 } from "@/worlds";
import WorldContainer from "@/components/WorldContainer";

const worlds = [
  { component: World1, name: "Genesis Torus" },
  { component: World2, name: "Wobble Cube" },
  { component: World3, name: "Distortion Sphere" },
];

const ExperiencePage = () => {
  return (
    <div className="w-full h-full">
      <Carousel className="w-full h-full" opts={{ loop: true }}>
        <CarouselContent className="h-full">
          {worlds.map((world, index) => {
            const WorldComponent = world.component;
            return (
              <CarouselItem key={index} className="p-0">
                <div className="w-full h-full relative">
                  <WorldContainer>
                    <WorldComponent />
                  </WorldContainer>
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-none">
                    <h2 className="text-2xl font-bold text-white mix-blend-difference">{world.name}</h2>
                    <p className="text-center text-sm text-white mix-blend-difference">World {index + 1}</p>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="left-8 text-white bg-white/20 hover:bg-white/40 border-0" />
        <CarouselNext className="right-8 text-white bg-white/20 hover:bg-white/40 border-0" />
      </Carousel>
    </div>
  );
};

export default ExperiencePage;
