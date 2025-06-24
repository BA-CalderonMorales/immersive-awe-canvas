
import { ScrollArea } from "@/components/ui/scroll-area";
import SceneControls from "@/components/scene/SceneControls";
import { SceneConfig } from "@/types/scene";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SceneSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const SceneSettingsPanel = ({
  sceneConfig,
  onUpdate,
}: SceneSettingsPanelProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-background/95 backdrop-blur-md text-foreground h-full flex flex-col border border-border/50 rounded-lg">
      {/* Hide header on mobile to save space */}
      {!isMobile && (
        <div className="p-4 border-b border-border/50">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Customize Scene</h2>
            <p className="text-sm text-muted-foreground">
              Live adjustments for the world.
            </p>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1">
        <div className={`${isMobile ? 'p-2' : 'p-4'}`}>
          {/* Info dialog - positioned differently on mobile */}
          <div className={`${isMobile ? 'mb-1' : 'mb-2'} flex justify-end`}>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`${isMobile ? 'size-6' : 'size-7'} text-muted-foreground hover:text-foreground`}
                >
                  <Info className={`${isMobile ? 'size-3' : 'size-4'}`} />
                  <span className="sr-only">View editor tips</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Editor Tips</DialogTitle>
                </DialogHeader>
                <div className="mt-2 space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Exit Editor:</span> Press the <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Esc</kbd> key to close this panel.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Precision Control:</span> Click anywhere on a slider track to jump to that value. Drag the handle for fine adjustments.
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">Mobile Tip:</span> Use two-finger scroll over sliders for precise control.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <SceneControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default SceneSettingsPanel;
