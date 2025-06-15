import { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { appVersion } from "@/lib/version";
import { cn } from "@/lib/utils";
import IssueReportForm from "./IssueReportForm";

interface HelpDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const HelpDialog = ({ isOpen, onOpenChange }: HelpDialogProps) => {
  const [showIssueForm, setShowIssueForm] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowIssueForm(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={cn(
        "w-[95vw] h-[90svh] rounded-lg sm:max-w-[425px] sm:h-[85vh] max-h-[700px] flex flex-col",
        showIssueForm && "sm:max-w-2xl transition-all duration-300 ease-in-out"
      )}>
        {showIssueForm ? (
          <IssueReportForm onBack={() => setShowIssueForm(false)} appVersion={appVersion} />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Help & Information</DialogTitle>
              <DialogDescription>
                Here's how to interact with the experience and get help.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 -mx-6 px-6 pr-4">
              <Accordion type="multiple" defaultValue={['controls']} className="w-full">
                <AccordionItem value="controls">
                  <AccordionTrigger>
                    <span className="font-semibold flex items-center"><Move className="mr-2 h-4 w-4" />Controls</span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t-0 pt-4">
                    <ul className="list-disc list-inside space-y-2 pl-4 text-sm">
                      <li><b>Look around:</b> Click and drag with your mouse.</li>
                      <li><b>Zoom:</b> Scroll with mouse wheel or pinch on touchpads.</li>
                      <li><b>Freeze Scene:</b> Double-click the scene or press '.' (period).</li>
                      <li><b>Toggle Day/Night:</b> Press the SPACE key.</li>
                      <li><b>Cycle worlds:</b> Use arrow buttons or press 'N' for next and 'P' for previous.</li>
                      <li><b>Search worlds:</b> Press 'S' or Ctrl+K (or Cmd+K).</li>
                      <li><b>Show/Hide UI:</b> Press 'V'.</li>
                      <li><b>Toggle Settings:</b> Press 'E'.</li>
                      <li><b>Copy Scene Config:</b> Press 'C'.</li>
                      <li><b>Go Home:</b> Press 'G'.</li>
                      <li><b>This Help Dialog:</b> Press 'H'.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="features" className="border-b-0">
                  <AccordionTrigger>
                    <span className="font-semibold flex items-center"><LifeBuoy className="mr-2 h-4 w-4" />Features & Bugs</span>
                  </AccordionTrigger>
                  <AccordionContent className="border-t-0 pt-4">
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
            <DialogFooter className="pt-4 flex-col sm:flex-row sm:justify-between items-center border-t mt-4">
              <p className="text-xs text-muted-foreground mb-2 sm:mb-0">Version: {appVersion}</p>
              <Button onClick={() => setShowIssueForm(true)}>
                <Github className="mr-2 h-4 w-4" /> Report an Issue
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
