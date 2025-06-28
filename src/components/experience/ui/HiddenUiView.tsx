
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, ChevronDown, ChevronUp, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useKeyboardShortcuts } from "@/context/KeyboardShortcutsContext";
import { getContrastingTextColor } from "@/lib/utils";

interface HiddenUiViewProps {
  onToggleUiHidden: () => void;
  showUiHint?: boolean;
  uiColor: string;
  theme: 'day' | 'night';
}

const HiddenUiView = ({ onToggleUiHidden, showUiHint, uiColor, theme }: HiddenUiViewProps) => {
  const isMobile = useIsMobile();
  const { isExpanded, toggleExpanded, isVisible } = useKeyboardShortcuts();

  // Use consistent button styling matching the main UI
  const blendedButtonClasses = "border-0 bg-black/40 hover:bg-black/60 dark:bg-white/40 dark:hover:bg-white/60 shadow-lg backdrop-blur-sm";
  const textColor = theme === 'day' ? '#000000' : getContrastingTextColor(uiColor);
  const uiStyle = { color: textColor };

  console.log('HiddenUiView rendering - showUiHint:', showUiHint, 'isVisible:', isVisible, 'isMobile:', isMobile);

  const handleToggleUi = () => {
    console.log('HiddenUiView - handleToggleUi called');
    onToggleUiHidden();
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('HiddenUiView - handleInfoClick called');
    toggleExpanded();
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Show UI Button - Top Right - ALWAYS VISIBLE */}
      <div className="absolute top-4 right-4 pointer-events-auto">
        <Tooltip open={showUiHint}>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              aria-label="Show UI"
              onClick={handleToggleUi}
              className={`${blendedButtonClasses} cursor-pointer`}
              style={uiStyle}
            >
              <Eye className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="pointer-events-none">
            <p>Show UI (Press V)</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Info icon/button - Bottom Left - ALWAYS VISIBLE ON DESKTOP */}
      {!isMobile && (
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`w-8 h-8 p-0 ${blendedButtonClasses} rounded-md transition-colors cursor-pointer`}
                style={uiStyle}
                onClick={handleInfoClick}
              >
                <Info className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to show keyboard shortcuts or press M</p>
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      
      {/* Keyboard shortcuts panel - Only show on desktop/tablet when visible */}
      {!isMobile && isVisible && (
        <div
          className={`absolute bottom-4 left-4 pointer-events-auto text-xs font-mono rounded-md shadow-lg backdrop-blur-sm min-w-[280px] ${
            theme === 'day' ? 'bg-white/40 text-black border border-gray-200/50' : 'bg-black/40 text-slate-200 border border-gray-700/50'
          }`}
        >
          <Collapsible open={isExpanded} onOpenChange={toggleExpanded}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between p-3 pb-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <span className="font-semibold">Shortcuts (use the letter "M" to hide this menu)</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-4 h-4 p-0 hover:bg-transparent"
                >
                  {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </Button>
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="px-3 pb-3">
              <div className="space-y-1.5">
                <p>Press <span className="font-bold">N</span> to go to the next world</p>
                <p>Press <span className="font-bold">P</span> to go to the previous world</p>
                <p>Press <span className="font-bold">Space</span> to change the time of day</p>
                <p>Press <span className="font-bold">.</span> to freeze or unfreeze objects</p>
                <p>Press <span className="font-bold">V</span> to show or hide the interface</p>
                <p>Press <span className="font-bold">Esc</span> to open scene settings</p>
                <p>Press <span className="font-bold">S</span> to search for worlds</p>
                <p>Press <span className="font-bold">H</span> to open the help guide</p>
                <p>Press <span className="font-bold">G</span> to return to the home page</p>
                <p>Press <span className="font-bold">C</span> to copy scene configuration</p>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
};

export default HiddenUiView;
