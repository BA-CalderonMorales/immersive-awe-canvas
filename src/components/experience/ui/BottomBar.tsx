
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SceneConfig } from "@/types/scene";
import { Copy, Settings, HelpCircle, Search, Move } from "lucide-react";
import SceneSettingsPanel from "../SceneSettingsPanel";
import GlassButton from "./GlassButton";

interface BottomBarProps {
  uiColor: string;
  onCopyCode: () => void;
  onShowSearch: () => void;
  isMobile: boolean;
  isSettingsOpen: boolean;
  onToggleSettings: (isOpen: boolean) => void;
  editableSceneConfig: SceneConfig;
  onUpdateSceneConfig: (newConfig: SceneConfig) => void;
  onShowHelp: () => void;
  theme: 'day' | 'night';
  isDragEnabled: boolean;
  onToggleDrag: () => void;
}

const BottomBar = ({
  uiColor,
  onCopyCode,
  onShowSearch,
  isMobile,
  isSettingsOpen,
  onToggleSettings,
  editableSceneConfig,
  onUpdateSceneConfig,
  onShowHelp,
  theme,
  isDragEnabled,
  onToggleDrag,
}: BottomBarProps) => {
  return (
    <div 
      className="fixed bottom-4 left-0 right-0 w-full flex items-center justify-between px-4 sm:px-8 z-30 pointer-events-none"
    >
      {/* Left side: Copy, Search, Drag Toggle */}
      <div className="flex gap-2 pointer-events-auto">
        <GlassButton
          icon={Copy}
          label="Copy Scene Config"
          shortcut="C"
          onClick={onCopyCode}
          theme={theme}
          uiColor={uiColor}
        />
        <GlassButton
          icon={Search}
          label="Search Worlds"
          shortcut="S or Ctrl+K"
          onClick={onShowSearch}
          theme={theme}
          uiColor={uiColor}
        />
        <GlassButton
          icon={Move}
          label="Toggle Drag Controls"
          shortcut="Z"
          onClick={onToggleDrag}
          theme={theme}
          uiColor={uiColor}
          active={isDragEnabled}
        />
      </div>
      
      {/* Right side: Settings, Help */}
      <div className="flex gap-2 pointer-events-auto">
        {isMobile ? (
          <Sheet open={isSettingsOpen} onOpenChange={onToggleSettings}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <div>
                    <GlassButton
                      icon={Settings}
                      label="Scene Settings"
                      shortcut="E"
                      onClick={() => {}}
                      theme={theme}
                      uiColor={uiColor}
                      active={isSettingsOpen}
                    />
                  </div>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Scene Settings (E)</p>
              </TooltipContent>
            </Tooltip>
            <SheetContent side="bottom" className="h-[75vh] bg-black/95 border-t border-cyan-500/30 p-0">
              <SceneSettingsPanel sceneConfig={editableSceneConfig} onUpdate={onUpdateSceneConfig} />
            </SheetContent>
          </Sheet>
        ) : (
          <GlassButton
            icon={Settings}
            label="Scene Settings"
            shortcut="E"
            onClick={() => onToggleSettings(!isSettingsOpen)}
            theme={theme}
            uiColor={uiColor}
            active={isSettingsOpen}
          />
        )}
        <GlassButton
          icon={HelpCircle}
          label="Help & Shortcuts"
          shortcut="H"
          onClick={onShowHelp}
          theme={theme}
          uiColor={uiColor}
        />
      </div>
    </div>
  );
};

export default BottomBar;
