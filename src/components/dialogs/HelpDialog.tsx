
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Github, LifeBuoy, Move } from "lucide-react";

interface HelpDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const HelpDialog = ({ isOpen, onOpenChange }: HelpDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Help & Information</DialogTitle>
          <DialogDescription>
            Here's how to interact with the experience and get help.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h3 className="font-semibold flex items-center"><Move className="mr-2 h-4 w-4" />Controls</h3>
          <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
            <li><b>Look around:</b> Click and drag with your mouse.</li>
            <li><b>Pan camera:</b> Use the Arrow keys or WASD keys.</li>
            <li><b>Toggle Day/Night:</b> Press the SPACE key.</li>
            <li><b>Cycle worlds:</b> Use the arrow buttons on the sides of the screen.</li>
          </ul>

          <h3 className="font-semibold flex items-center"><LifeBuoy className="mr-2 h-4 w-4" />Features & Bugs</h3>
          <p className="text-sm text-muted-foreground">
            This is an experimental project. If you find a bug or have a feature request, please open an issue on GitHub.
          </p>
          
        </div>
        <DialogFooter>
          <a href="https://github.com/lovable-labs/av-dx/issues" target="_blank" rel="noopener noreferrer">
            <Button>
              <Github className="mr-2 h-4 w-4" /> Report an Issue
            </Button>
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
