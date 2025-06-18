
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface KeyboardShortcutsOverlayProps {
  theme: 'day' | 'night';
  isVisible: boolean;
  onToggle: () => void;
}

const KeyboardShortcutsOverlay = ({ theme, isVisible, onToggle }: KeyboardShortcutsOverlayProps) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(true);

  // Don't render on mobile devices
  if (isMobile) return null;

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 left-4 z-50 pointer-events-auto text-xs font-mono rounded-md shadow-lg backdrop-blur-sm min-w-[280px] ${
        theme === 'day' ? 'bg-white/90 text-black border border-gray-200' : 'bg-black/90 text-slate-200 border border-gray-700'
      }`}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className="flex items-center justify-between p-3 pb-2">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto font-semibold hover:bg-transparent flex items-center gap-2"
            >
              Keyboard Shortcuts
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </Button>
          </CollapsibleTrigger>
          <Button
            variant="ghost"
            size="icon"
            className="w-4 h-4 p-0 hover:bg-transparent"
            onClick={onToggle}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <CollapsibleContent className="px-3 pb-3">
          <div className="space-y-1.5">
            <p>Press <span className="font-bold">N</span> to go to the Next World</p>
            <p>Press <span className="font-bold">P</span> to go to the Previous World</p>
            <p>Press <span className="font-bold">Space</span> to change the time of day</p>
            <p>Press <span className="font-bold">.</span> to freeze/unfreeze objects</p>
            <p>Press <span className="font-bold">V</span> to toggle UI visibility</p>
            <p>Press <span className="font-bold">E</span> to open Settings panel</p>
            <p>Press <span className="font-bold">S</span> to open Search worlds</p>
            <p>Press <span className="font-bold">H</span> to open Help dialog</p>
            <p>Press <span className="font-bold">G</span> to go back to Home</p>
            <p>Press <span className="font-bold">C</span> to copy scene code</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default KeyboardShortcutsOverlay;
