
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface KeyboardShortcutsOverlayProps {
  theme: 'day' | 'night';
  isVisible: boolean;
  onToggle: () => void;
}

const KeyboardShortcutsOverlay = ({ theme, isVisible, onToggle }: KeyboardShortcutsOverlayProps) => {
  const isMobile = useIsMobile();

  // Don't render on mobile devices
  if (isMobile) return null;

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 left-4 z-50 pointer-events-auto text-xs space-y-1 font-mono p-4 rounded-md shadow-lg backdrop-blur-sm min-w-[200px] ${
        theme === 'day' ? 'bg-white/90 text-black border border-gray-200' : 'bg-black/90 text-slate-200 border border-gray-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold underline">Keyboard Shortcuts</p>
        <Button
          variant="ghost"
          size="icon"
          className="w-4 h-4 p-0 hover:bg-transparent"
          onClick={onToggle}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
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
  );
};

export default KeyboardShortcutsOverlay;
