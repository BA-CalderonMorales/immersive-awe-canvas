
import { Button } from "@/components/ui/button";
import { Heart, Coffee, Link } from "lucide-react";
import { useState, useEffect } from "react";
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

interface LikeDialogProps {
  uiStyle: { color: string };
  blendedButtonClasses: string;
}

const LikeDialog = ({ uiStyle, blendedButtonClasses }: LikeDialogProps) => {
  const [isStable, setIsStable] = useState(false);

  // Ensure component is stable before showing
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStable(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isStable) {
    return (
      <Button
        style={uiStyle}
        className={`transition-colors duration-300 ${blendedButtonClasses} flex-shrink-0`}
        size="icon"
        aria-label="Like this project"
        disabled
      >
        <Heart className="fill-current" />
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          style={uiStyle}
          className={`transition-colors duration-300 ${blendedButtonClasses} flex-shrink-0`}
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
  );
};

export default LikeDialog;
