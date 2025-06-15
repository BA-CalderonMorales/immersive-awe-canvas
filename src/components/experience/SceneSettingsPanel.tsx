
import { ScrollArea } from "@/components/ui/scroll-area";
import SceneControls from "@/components/scene/SceneControls";
import { SceneConfig } from "@/types/scene";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

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
          <div className="mb-2">
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger>
                  <Info className="size-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Tip: Hover a slider and use two-finger scroll to adjust.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <SceneControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default SceneSettingsPanel;
