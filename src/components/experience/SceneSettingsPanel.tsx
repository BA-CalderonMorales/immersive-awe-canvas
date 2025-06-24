
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
    <div className="bg-background/98 backdrop-blur-xl text-foreground h-full flex flex-col border-2 border-border/30 rounded-2xl shadow-2xl">
      {/* Desktop Header Block - Hidden on Mobile for Space Optimization */}
      {!isMobile && (
        <div className="p-6 border-b border-border/30">
          <div className="space-y-2">
            <h2 className="text-xl font-bold tracking-tight">Customize Scene</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Live adjustments for the world. Changes are instantly visible.
            </p>
          </div>
        </div>
      )}
      
      {/* Scrollable Content Area Block */}
      <ScrollArea className="flex-1">
        <div className={`${isMobile ? 'p-3' : 'p-6'}`}>
          {/* Help Dialog Block - Compact Mobile Layout */}
          <div className={`${isMobile ? 'mb-2' : 'mb-4'} flex justify-end`}>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`${isMobile ? 'size-8' : 'size-9'} text-muted-foreground hover:text-foreground hover:bg-accent/10 rounded-full border border-border/20`}
                >
                  <Info className={`${isMobile ? 'size-4' : 'size-5'}`} />
                  <span className="sr-only">View editor tips</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold">Editor Tips & Shortcuts</DialogTitle>
                </DialogHeader>
                
                {/* Enhanced Help Content Block */}
                <div className="mt-4 space-y-5 text-sm">
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Exit Editor:</span> Press the <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Esc</kbd> key to close this panel.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Precision Control:</span> All sliders now support smooth dragging for continuous adjustments. Click anywhere on the track to jump to specific values instantly.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Mobile Optimization:</span> Interface uses 50% screen height for better visibility. Touch targets are sized for comfortable finger interaction.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      <span className="font-semibold text-foreground">Performance:</span> All materials use optimized unlit shading for better performance across devices. Settings are organized into logical groups for easier navigation.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Main Scene Controls Block */}
          <SceneControls sceneConfig={sceneConfig} onUpdate={onUpdate} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default SceneSettingsPanel;
