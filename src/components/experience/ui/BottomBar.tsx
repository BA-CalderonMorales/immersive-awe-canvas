
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
import { getContrastingTextColor } from "@/lib/utils";
import { SceneConfig } from "@/types/scene";
import { Copy, Settings, HelpCircle, Search } from "lucide-react";

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
}: BottomBarProps) => {
  const blendedButtonClasses = "border-0 bg-black/40 hover:bg-black/60 dark:bg-white/40 dark:hover:bg-white/60";
  
  // Use black text/icons in day mode and choose high-contrast color at night
  const textColor = theme === 'day' ? '#000000' : getContrastingTextColor(uiColor);
  const uiStyle = { color: textColor };

  return (
    <div className="absolute bottom-4 left-0 w-full flex items-center justify-between z-10 pointer-events-none px-4 sm:px-8">
      {/* Left side: Copy, Search */}
      <div className="flex gap-2 pointer-events-auto">
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
      </div>
      
      {/* Right side: Settings, Help */}
      <div className="flex gap-2 pointer-events-auto">
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
