
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
import { ArrowLeft, ArrowRight, Sun, Moon, Copy, Settings, HelpCircle, Home, Search } from "lucide-react";

interface ExperienceUIProps {
  worldName: string;
  theme: 'day' | 'night';
  isTransitioning: boolean;
  editableSceneConfig: SceneConfig;
  uiColor: string;
  onToggleTheme: () => void;
  onChangeWorld: (direction: 'next' | 'prev') => void;
  onCopyCode: () => void;
  onUpdateSceneConfig: (newConfig: SceneConfig) => void;
  onShowHelp: () => void;
  onGoHome: () => void;
  onShowSearch: () => void;
}

const ExperienceUI = ({
  worldName,
  theme,
  isTransitioning,
  editableSceneConfig,
  uiColor,
  onToggleTheme,
  onChangeWorld,
  onCopyCode,
  onUpdateSceneConfig,
  onShowHelp,
  onGoHome,
  onShowSearch,
}: ExperienceUIProps) => {
  const blendedButtonClasses = "border-0 bg-black/20 hover:bg-black/40";
  const uiStyle = { color: uiColor };

  return (
    <>
      {/* UI Overlay now uses uiColor for high contrast */}
      <div style={uiStyle} className={`absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-center z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div key={worldName} className="animate-fade-in [animation-delay:0.5s]">
          <h2 className="text-2xl sm:text-3xl font-bold">{worldName}</h2>
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <Button
            style={uiStyle}
            onClick={onToggleTheme}
            className={blendedButtonClasses}
            size="icon"
            aria-label="Toggle Theme"
          >
            {theme === 'day' ? <Moon /> : <Sun />}
          </Button>
          <Button
            style={uiStyle}
            onClick={onGoHome}
            className={blendedButtonClasses}
            size="icon"
            aria-label="Go Home"
          >
            <Home />
          </Button>
        </div>
      </div>
      
      {/* Navigation */}
      <Button
        style={uiStyle}
        onClick={() => onChangeWorld('prev')}
        className={`absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 pointer-events-auto z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${blendedButtonClasses}`}
        size="icon"
        aria-label="Previous World"
        disabled={isTransitioning}
      >
        <ArrowLeft />
      </Button>
      <Button
        style={uiStyle}
        onClick={() => onChangeWorld('next')}
        className={`absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 pointer-events-auto z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'} ${blendedButtonClasses}`}
        size="icon"
        aria-label="Next World"
        disabled={isTransitioning}
      >
        <ArrowRight />
      </Button>

      {/* Bottom Left Buttons */}
      <Button
        style={uiStyle}
        onClick={onCopyCode}
        className={`absolute bottom-4 left-4 sm:left-8 pointer-events-auto z-10 transition-opacity duration-300 ${blendedButtonClasses}`}
        size="icon"
        aria-label="Copy Scene Configuration"
      >
        <Copy />
      </Button>

      {/* Bottom Right Buttons & Drawer */}
      <div style={uiStyle} className={`absolute bottom-4 right-4 sm:right-8 flex items-center gap-2 z-10`}>
        <Button
          style={uiStyle}
          className={`pointer-events-auto ${blendedButtonClasses}`}
          size="icon"
          aria-label="Search Worlds"
          onClick={onShowSearch}
        >
          <Search />
        </Button>
        <Drawer shouldScaleBackground={false}>
          <DrawerTrigger asChild>
            <Button
              style={uiStyle}
              className={`pointer-events-auto ${blendedButtonClasses}`}
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
          style={uiStyle}
          className={`pointer-events-auto ${blendedButtonClasses}`}
          size="icon"
          aria-label="Help"
          onClick={onShowHelp}
        >
          <HelpCircle />
        </Button>
      </div>

      <div style={uiStyle} className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs animate-fade-in [animation-delay:0.5s] transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
          Press SPACE to change time of day
      </div>
    </>
  );
};

export default ExperienceUI;
