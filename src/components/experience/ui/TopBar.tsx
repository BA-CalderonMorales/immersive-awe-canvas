
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EyeOff, Sun, Moon, Home, Heart, Link, Coffee } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface TopBarProps {
  worldName: string;
  uiColor: string;
  onToggleUiHidden: () => void;
  onToggleTheme: () => void;
  theme: 'day' | 'night';
  onGoHome: () => void;
  isTransitioning: boolean;
}

const TopBar = ({ worldName, uiColor, onToggleUiHidden, onToggleTheme, theme, onGoHome, isTransitioning }: TopBarProps) => {
  const blendedButtonClasses = "border-0 bg-black/40 hover:bg-black/60 dark:bg-white/40 dark:hover:bg-white/60";
  const uiStyle = { color: uiColor };

  return (
    <div style={uiStyle} className={`absolute top-0 left-0 w-full p-4 sm:p-8 pointer-events-none flex justify-between items-start z-10 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <div key={worldName} className="animate-fade-in [animation-delay:0.5s] flex items-center gap-2 pointer-events-auto">
        <h2 className="text-2xl sm:text-3xl font-bold h-10 flex items-center">{worldName}</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              style={uiStyle}
              className={`transition-colors duration-300 ${blendedButtonClasses}`}
              size="icon"
              aria-label="Like this project"
            >
              <Heart className="fill-current" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Heart className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                  <AlertDialogTitle>Like this project?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This is a passion project by one developer. Features like saving and sharing worlds are on the roadmap. Your support helps bring them to life!
                  </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
                <AlertDialogAction asChild>
                    <a href="https://buymeacoffee.com/brandoncalderonmorales" target="_blank" rel="noopener noreferrer">
                        <Coffee className="mr-2" /> Buy me a coffee
                    </a>
                </AlertDialogAction>
                <AlertDialogAction asChild>
                    <a href="https://www.linkedin.com/in/bcalderonmorales-cmoe/" target="_blank" rel="noopener noreferrer">
                        <Link className="mr-2" /> Connect on LinkedIn
                    </a>
                </AlertDialogAction>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Maybe later</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex items-center gap-2 pointer-events-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              aria-label="Hide UI"
              onClick={onToggleUiHidden}
              className={blendedButtonClasses}
              style={uiStyle}
            >
              <EyeOff className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hide UI (V)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              onClick={onToggleTheme}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Toggle Theme"
            >
              {theme === 'day' ? <Moon /> : <Sun />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Theme (Space)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              onClick={onGoHome}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Go Home"
            >
              <Home />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go Home (G)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default TopBar;
