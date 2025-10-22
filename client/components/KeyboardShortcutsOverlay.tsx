import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useKeyboardShortcuts } from "@/context/KeyboardShortcutsContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface KeyboardShortcutsOverlayProps {
    theme: "day" | "night";
}

const KeyboardShortcutsOverlay = ({ theme }: KeyboardShortcutsOverlayProps) => {
    const isMobile = useIsMobile();
    const { isExpanded, toggleExpanded, isVisible } = useKeyboardShortcuts();

    // Don't render on mobile devices
    if (isMobile) return null;

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-4 left-4 z-50 pointer-events-auto text-xs font-mono rounded-md shadow-lg backdrop-blur-sm min-w-[280px] ${
                theme === "day"
                    ? "bg-white/90 text-black border border-gray-200"
                    : "bg-black/90 text-slate-200 border border-gray-700"
            }`}
        >
            <Collapsible open={isExpanded} onOpenChange={toggleExpanded}>
                <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-3 pb-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors w-full">
                        <span className="font-semibold flex items-center gap-2">
                            <span>🎹</span>
                            <span>Keyboard Shortcuts</span>
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] opacity-50">Press M to toggle</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="w-4 h-4 p-0 hover:bg-transparent"
                            >
                                {isExpanded ? (
                                    <ChevronUp className="w-3 h-3" />
                                ) : (
                                    <ChevronDown className="w-3 h-3" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="px-3 pb-3">
                    <div className="space-y-1.5">
                        <div className="text-[10px] opacity-60 mb-2 font-semibold">
                            🎮 World Navigation
                        </div>
                        <p>
                            <span className="font-bold">N</span> - Next World
                            <span className="text-[10px] opacity-50"> (discover more!)</span>
                        </p>
                        <p>
                            <span className="font-bold">P</span> - Previous World
                            <span className="text-[10px] opacity-50"> (go back)</span>
                        </p>
                        <p>
                            <span className="font-bold">Space</span> - Day/Night Toggle
                            <span className="text-[10px] opacity-50"> (change time)</span>
                        </p>
                        
                        <div className="text-[10px] opacity-60 mb-2 font-semibold mt-3">
                            ⚙️ Object Controls
                        </div>
                        <p>
                            <span className="font-bold">.</span> - Freeze/Unfreeze
                            <span className="text-[10px] opacity-50"> (pause motion)</span>
                        </p>
                        <p>
                            <span className="font-bold">E</span> - Scene Settings
                            <span className="text-[10px] opacity-50"> (customize!)</span>
                        </p>
                        
                        <div className="text-[10px] opacity-60 mb-2 font-semibold mt-3">
                            🔧 Interface
                        </div>
                        <p>
                            <span className="font-bold">V</span> - Hide/Show UI
                            <span className="text-[10px] opacity-50"> (clean view)</span>
                        </p>
                        <p>
                            <span className="font-bold">S</span> - Search Worlds
                            <span className="text-[10px] opacity-50"> (find shapes)</span>
                        </p>
                        <p>
                            <span className="font-bold">H</span> - Help Guide
                            <span className="text-[10px] opacity-50"> (learn more)</span>
                        </p>
                        <p>
                            <span className="font-bold">C</span> - Copy Config
                            <span className="text-[10px] opacity-50"> (save setup)</span>
                        </p>
                        <p>
                            <span className="font-bold">G</span> - Go Home
                            <span className="text-[10px] opacity-50"> (main menu)</span>
                        </p>
                        
                        <div className="text-[9px] opacity-40 mt-3 italic">
                            💡 Tip: Use your mouse to rotate and zoom!
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default KeyboardShortcutsOverlay;
