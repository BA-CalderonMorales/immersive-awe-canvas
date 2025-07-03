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
                      <li><b>Look around:</b> Click and drag with your mouse to rotate camera.</li>
                      <li><b>Zoom:</b> Scroll with mouse wheel or pinch on touchpads.</li>
                      <li><b>Select Objects:</b> Click on any geometry to select and show gizmo controls.</li>
                      <li><b>Move Objects:</b> Press 'Z' to toggle drag mode, then drag gizmo handles for precise movement.</li>
                      <li><b>Freeze Scene:</b> Double-click the scene or press '.' (period).</li>
                      <li><b>Toggle Day/Night:</b> Press SPACE key.</li>
                      <li><b>Navigate Worlds:</b> Use arrow buttons or press 'N' for next and 'P' for previous.</li>
                      <li><b>Search Worlds:</b> Press 'S' or Ctrl+K (Cmd+K on Mac).</li>
                      <li><b>Show/Hide UI:</b> Press 'V'.</li>
                      <li><b>Toggle Settings Panel:</b> Press 'E' to open scene editor.</li>
                      <li><b>Copy Scene Config:</b> Press 'C' to copy current scene configuration.</li>
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
                        <h4 className="font-semibold text-foreground mb-1">Current Features</h4>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                          <li>Multiple 3D scene types with optimized animations</li>
                          <li>Blender-style gizmo controls for precise object manipulation</li>
                          <li>Professional scene editor with real-time property adjustment</li>
                          <li>Dynamic object management (add, remove, select, modify)</li>
                          <li>Smooth drag controls with interpolation</li>
                          <li>Day/night theme toggling with world-specific UI colors</li>
                          <li>Comprehensive keyboard shortcuts for efficient navigation</li>
                          <li>Responsive design optimized for desktop and mobile</li>
                          <li>Exportable scene configurations</li>
                          <li>Semantic versioning with automated GitHub releases</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">Technical Improvements</h4>
                        <ul className="list-disc list-inside space-y-1 pl-4">
                          <li>Fixed animation conflicts during object manipulation</li>
                          <li>Resolved gizmo interference with natural animations</li>
                          <li>Eliminated glitchy behavior in geometry rendering</li>
                          <li>Improved main scene object selection and control</li>
                          <li>Enhanced settings panel contrast for better accessibility</li>
                        </ul>
                      </div>
                      <p>
                        This project follows semantic versioning and conventional commits. Report issues or contribute on GitHub.
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
