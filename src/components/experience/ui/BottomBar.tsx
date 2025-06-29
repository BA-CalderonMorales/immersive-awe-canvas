
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import SceneControls from "@/components/scene/SceneControls";
import { SceneConfig } from "@/types/scene";
import { Copy, Settings, HelpCircle, Search, Move } from "lucide-react";

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
  onShowObjectControls?: () => void;
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
  onShowObjectControls,
}: BottomBarProps) => {
  const blendedButtonClasses = "border bg-black/70 hover:bg-black/90 backdrop-blur-sm shadow-lg";
  
  // Use scene-specific UI colors for proper contrast
  const uiStyle = { color: uiColor, borderColor: uiColor };

  const handleObjectControls = () => {
    if (onShowObjectControls) {
      onShowObjectControls();
    } else {
      // Fallback behavior - open settings with object focus
      onToggleSettings(true);
    }
  };

  return (
    <div 
      className="fixed bottom-4 left-0 right-0 w-full flex items-center justify-between px-4 sm:px-8"
      style={{ 
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      {/* Left side: Copy, Search, Object Controls */}
      <div className="flex gap-2" style={{ pointerEvents: 'auto' }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              onClick={onCopyCode}
              className={`transition-opacity duration-300 ${blendedButtonClasses}`}
              size="icon"
              aria-label="Copy Scene Configuration"
            >
              <Copy />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Scene Config (C)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Search Worlds"
              onClick={onShowSearch}
            >
              <Search />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search Worlds (S or Ctrl+K)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Object Controls"
              onClick={handleObjectControls}
            >
              <Move />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Object Controls (O)</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Right side: Settings, Help */}
      <div className="flex gap-2" style={{ pointerEvents: 'auto' }}>
        {isMobile ? (
          <Sheet open={isSettingsOpen} onOpenChange={onToggleSettings}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <Button
                    style={uiStyle}
                    className={blendedButtonClasses}
                    size="icon"
                    aria-label="Scene Settings"
                  >
                    <Settings />
                  </Button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Scene Settings (Esc)</p>
              </TooltipContent>
            </Tooltip>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader className="text-left">
                <SheetTitle>Customize Scene</SheetTitle>
                <SheetDescription>
                  Tweak the live parameters of the scene. Your changes can be copied.
                </SheetDescription>
              </SheetHeader>
              <div className="mt-4 h-full overflow-y-auto">
                <SceneControls sceneConfig={editableSceneConfig} onUpdate={onUpdateSceneConfig} />
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                style={uiStyle}
                className={blendedButtonClasses}
                size="icon"
                aria-label="Scene Settings"
                onClick={() => onToggleSettings(!isSettingsOpen)}
              >
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Scene Settings (Esc)</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={uiStyle}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Help"
              onClick={onShowHelp}
            >
              <HelpCircle />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Help & Shortcuts (H)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default BottomBar;
