
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface HiddenUiViewProps {
  onToggleUiHidden: () => void;
  showUiHint?: boolean;
  uiColor: string;
  theme: 'day' | 'night';
}

const HiddenUiView = ({ onToggleUiHidden, showUiHint, uiColor, theme }: HiddenUiViewProps) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <Tooltip open={showUiHint}>
        <TooltipTrigger asChild>
          <div className="fixed top-4 right-4 z-50 pointer-events-auto">
            <Button
              size="icon"
              aria-label="Show UI"
              onClick={onToggleUiHidden}
              className="bg-black/30 hover:bg-black/50 text-white shadow-md"
              style={{ color: uiColor }}
            >
              <Eye className="w-6 h-6" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="pointer-events-none">
          <p>Show UI (Press V)</p>
        </TooltipContent>
      </Tooltip>
      
      {/* Only show shortcuts on desktop/tablet */}
      {!isMobile && (
        <div
          className={`fixed bottom-4 left-4 z-50 pointer-events-auto text-xs font-mono rounded-md shadow-lg backdrop-blur-sm min-w-[280px] ${
            theme === 'day' ? 'bg-white/40 text-black border border-gray-200/50' : 'bg-black/40 text-slate-200 border border-gray-700/50'
          }`}
        >
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <div className="flex items-center justify-between p-3 pb-2">
              <span className="font-semibold">Shortcuts</span>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 p-0 hover:bg-transparent"
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="px-3 pb-3">
              <div className="space-y-1.5">
                <p>Press <span className="font-bold">N</span> to navigate to the next world</p>
                <p>Press <span className="font-bold">P</span> to navigate to the previous world</p>
                <p>Press <span className="font-bold">Space</span> to switch between day and night</p>
                <p>Press <span className="font-bold">.</span> to freeze or unfreeze moving objects</p>
                <p>Press <span className="font-bold">V</span> to show or hide the interface</p>
                <p>Press <span className="font-bold">E</span> to open the settings panel</p>
                <p>Press <span className="font-bold">S</span> to search for worlds</p>
                <p>Press <span className="font-bold">H</span> to open the help guide</p>
                <p>Press <span className="font-bold">G</span> to return to the home page</p>
                <p>Press <span className="font-bold">C</span> to copy the scene configuration</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </>
  );
};

export default HiddenUiView;
