import { Coffee, Heart, Link, Star } from "lucide-react";
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
import GlassButton from "./GlassButton";

interface LikeDialogProps {
    theme: "day" | "night";
    uiColor: string;
}

const LikeDialog = ({ theme, uiColor }: LikeDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div>
                    <GlassButton
                        icon={Heart}
                        label="Like this project"
                        onClick={() => {}}
                        theme={theme}
                        uiColor={uiColor}
                    />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md mx-auto p-0 overflow-hidden">
                <AlertDialogHeader className="p-6 pb-4 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
                        <Heart className="h-8 w-8 text-primary fill-primary/20" />
                    </div>
                    <AlertDialogTitle className="text-xl font-semibold">
                        Like this project?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                        This is a passion project by one developer. Your support
                        helps bring new features like saving and sharing worlds
                        to life!
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="px-6 pb-4 space-y-3">
                    <AlertDialogAction asChild className="w-full">
                        <a
                            href="https://buymeacoffee.com/brandoncalderonmorales"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white border-0"
                        >
                            <Coffee className="h-4 w-4" />
                            Buy me a coffee
                        </a>
                    </AlertDialogAction>

                    <AlertDialogAction asChild className="w-full">
                        <a
                            href="https://www.linkedin.com/in/bcalderonmorales-cmoe/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
                        >
                            <Link className="h-4 w-4" />
                            Connect on LinkedIn
                        </a>
                    </AlertDialogAction>

                    <AlertDialogAction asChild className="w-full">
                        <a
                            href="https://github.com/BA-CalderonMorales/immersive-awe-canvas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white border-0"
                        >
                            <Star className="h-4 w-4" />
                            Star on GitHub
                        </a>
                    </AlertDialogAction>
                </div>

                <AlertDialogFooter className="px-6 pb-6 pt-2">
                    <AlertDialogCancel className="w-full">
                        Maybe later
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default LikeDialog;
