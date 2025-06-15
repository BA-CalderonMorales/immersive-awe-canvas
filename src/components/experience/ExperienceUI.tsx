
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import SceneControls from "@/components/scene/SceneControls";
import { SceneConfig } from "@/types/scene";
import { ArrowLeft, ArrowRight, Sun, Moon, Copy, Settings, HelpCircle, Home } from "lucide-react";

interface ExperienceUIProps {
  worldName: string;
  theme: 'day' | 'night';
  isTransitioning: boolean;
  editableSceneConfig: SceneConfig;
  onToggleTheme: () => void;
  onChangeWorld: (direction: 'next' | 'prev') => void;
  onCopyCode: () => void;
  onUpdateSceneConfig: (newConfig: SceneConfig) => void;
  onShowHelp: () => void;
  onGoHome: () => void;
}

const ExperienceUI = ({
  worldName,
  theme,
  isTransitioning,
  editableSceneConfig,
  onToggleTheme,
  onChangeWorld,
  onCopyCode,
  onUpdateSceneConfig,
  onShowHelp,
  onGoHome,
}: ExperienceUIProps) => {
  const themedButtonClasses = theme === 'day' 
    ? 'text-neutral-900 bg-black/5 hover:bg-black/10' 
    : 'text-white bg-white/20 hover:bg-white/40';

  const titleClasses = theme === 'day' ? 'text-neutral-900' : 'text-white';

  return (
    <>
      {/* UI Overlay */}
      <div className={`absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-center z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div key={worldName} className="animate-fade-in [animation-delay:0.5s]">
          <h2 className={`text-2xl sm:text-3xl font-bold ${titleClasses}`}>{worldName}</h2>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            onClick={onToggleTheme}
            className={`border-0 ${themedButtonClasses}`}
            size="icon"
            aria-label="Toggle Theme"
          >
            {theme === 'day' ? <Moon /> : <Sun />}
          </Button>
          <Button
            onClick={onGoHome}
            className={`border-0 ${themedButtonClasses}`}
            size="icon"
            aria-label="Go Home"
          >
            <Home />
          </Button>
        </div>
      </div>
      
      {/* Navigation */}
      <Button
        onClick={() => onChangeWorld('prev')}
        className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto z-10 transition-opacity duration-300 mix-blend-difference ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        size="icon"
        aria-label="Previous World"
        disabled={isTransitioning}
      >
        <ArrowLeft />
      </Button>
      <Button
        onClick={() => onChangeWorld('next')}
        className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto z-10 transition-opacity duration-300 mix-blend-difference ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        size="icon"
        aria-label="Next World"
        disabled={isTransitioning}
      >
        <ArrowRight />
      </Button>

      {/* Bottom Left Buttons */}
      <Button
        onClick={onCopyCode}
        className="absolute bottom-4 left-4 sm:left-8 text-white bg-white/20 hover:bg-white/40 border-0 pointer-events-auto z-10 transition-opacity duration-300 mix-blend-difference"
        size="icon"
        aria-label="Copy Scene Configuration"
      >
        <Copy />
      </Button>

      {/* Bottom Right Buttons & Drawer */}
      <div className="absolute bottom-4 right-4 sm:right-8 flex items-center gap-2 z-10">
        <Drawer shouldScaleBackground={false}>
          <DrawerTrigger asChild>
            <Button
              className={`border-0 pointer-events-auto ${themedButtonClasses}`}
              size="icon"
              aria-label="Scene Settings"
            >
              <Settings />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Customize Scene</DrawerTitle>
              <DrawerDescription>
                Tweak the live parameters of the scene. Your changes can be copied.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <SceneControls sceneConfig={editableSceneConfig} onUpdate={onUpdateSceneConfig} />
            </div>
          </DrawerContent>
        </Drawer>
        
        <Button
          className={`border-0 pointer-events-auto ${themedButtonClasses}`}
          size="icon"
          aria-label="Help"
          onClick={onShowHelp}
        >
          <HelpCircle />
        </Button>
      </div>

      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-white mix-blend-difference text-xs animate-fade-in [animation-delay:0.5s] transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          Press SPACE to change time of day
      </div>
    </>
  );
};

export default ExperienceUI;
