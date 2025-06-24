
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

interface SceneSettingsPanelProps {
  sceneConfig: SceneConfig;
  onUpdate: (config: SceneConfig) => void;
}

const SceneSettingsPanel = ({
  sceneConfig,
  onUpdate,
}: SceneSettingsPanelProps) => {
  return (
    <div className="bg-background text-foreground h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Customize Scene</h2>
          <p className="text-sm text-muted-foreground">
            Live adjustments for the world.
          </p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="mb-2 flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7 text-muted-foreground hover:text-foreground">
                  <Info className="size-4" />
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
                    <span className="font-semibold text-foreground">Adjust Sliders:</span> Hover over a slider and use your trackpad's two-finger scroll to make precise adjustments.
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
