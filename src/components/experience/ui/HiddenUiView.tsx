
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HiddenUiViewProps {
  onToggleUiHidden: () => void;
  showUiHint?: boolean;
  uiColor: string;
  theme: 'day' | 'night';
}

const HiddenUiView = ({ onToggleUiHidden, showUiHint, uiColor, theme }: HiddenUiViewProps) => {
  const isMobile = useIsMobile();

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
          className={`fixed bottom-4 left-4 z-50 pointer-events-none text-xs space-y-1 font-mono p-3 rounded-md shadow-lg backdrop-blur-sm ${
            theme === 'day' ? 'bg-white/40 text-black' : 'bg-black/40 text-slate-200'
          }`}
        >
          <p className="font-semibold underline">Shortcuts</p>
          <p>N/P&nbsp;&nbsp;: Cycle World</p>
          <p>SPC&nbsp;&nbsp;: Theme</p>
          <p>.&nbsp;&nbsp;&nbsp;&nbsp;: Freeze</p>
          <p>V&nbsp;&nbsp;&nbsp;&nbsp;: Toggle UI</p>
          <p>E&nbsp;&nbsp;&nbsp;&nbsp;: Settings</p>
          <p>S&nbsp;&nbsp;&nbsp;&nbsp;: Search</p>
          <p>H&nbsp;&nbsp;&nbsp;&nbsp;: Help</p>
          <p>G&nbsp;&nbsp;&nbsp;&nbsp;: Home</p>
          <p>C&nbsp;&nbsp;&nbsp;&nbsp;: Copy</p>
        </div>
      )}
    </>
  );
};

export default HiddenUiView;
