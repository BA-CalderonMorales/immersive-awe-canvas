
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Github, LifeBuoy, Move } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { appVersion } from "@/lib/version";

interface HelpDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const HelpDialog = ({ isOpen, onOpenChange }: HelpDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] flex flex-col h-[85vh] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>Help & Information</DialogTitle>
          <DialogDescription>
            Here's how to interact with the experience and get help.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 -mx-6 px-6 pr-4">
          <Accordion type="multiple" defaultValue={['controls']} className="w-full">
            <AccordionItem value="controls" className="border-b-0">
              <AccordionTrigger>
                <span className="font-semibold flex items-center"><Move className="mr-2 h-4 w-4" />Controls</span>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
                  <li><b>Look around:</b> Click and drag with your mouse.</li>
                  <li><b>Pan camera:</b> Use the Arrow keys or WASD keys.</li>
                  <li><b>Go Home:</b> Press 'H'.</li>
                  <li><b>Toggle Day/Night:</b> Press the SPACE key.</li>
                  <li><b>Cycle worlds:</b> Use the arrow buttons on the sides or press 'N' for next and 'P' for previous.</li>
                  <li><b>Search worlds:</b> Press 'S' or Ctrl+K (or Cmd+K) to open the search palette.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="features" className="border-b-0">
               <AccordionTrigger>
                <span className="font-semibold flex items-center"><LifeBuoy className="mr-2 h-4 w-4" />Features & Bugs</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-muted-foreground space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Recent Features</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Dynamic 3D scenes with react-three-fiber</li>
                      <li>World switching (including keyboard navigation)</li>
                      <li>Day/Night theme toggling with per-world UI colors</li>
                      <li>Live scene customization panel</li>
                      <li>Copyable scene configuration</li>
                      <li>Searchable world list with keyboard shortcut</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Fixed Bugs</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>UI visibility issues on various world backgrounds</li>
                      <li>Corrected broken theme in toast notifications</li>
                      <li>Adjusted "Echoing Void" night theme for better visibility</li>
                    </ul>
                  </div>
                   <p>
                    This is an experimental project. If you find a bug or have a feature request, please open an issue on GitHub.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        <ScrollBar />
        <DialogFooter className="pt-4 flex-col sm:flex-row sm:justify-between items-center border-t mt-4">
          <p className="text-xs text-muted-foreground mb-2 sm:mb-0">Version: {appVersion}</p>
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
