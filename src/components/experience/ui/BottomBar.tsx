
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
  onToggleObjectMoveMode: () => void;
  isObjectMoveMode: boolean;
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
  onToggleObjectMoveMode,
  isObjectMoveMode,
}: BottomBarProps) => {
  // Improved button classes with better contrast
  const blendedButtonClasses = theme === 'day' 
    ? "border border-gray-300 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
    : "border bg-black/70 hover:bg-black/90 backdrop-blur-sm shadow-lg";
  
  // Use scene-specific UI colors for border only
  const uiStyle = { borderColor: uiColor };
  
  // For light theme, use dark text; for dark theme, use the ui color
  const textStyle = theme === 'day' ? { color: '#1f2937' } : { color: uiColor };

  const buttonStyle = { ...uiStyle, ...textStyle };

  // Special styling for active object move mode
  const objectMoveButtonStyle = isObjectMoveMode 
    ? { 
        borderColor: uiColor, 
        backgroundColor: theme === 'day' ? `${uiColor}20` : `${uiColor}30`,
        color: theme === 'day' ? '#1f2937' : uiColor 
      }
    : buttonStyle;

  return (
    <div 
      className={`fixed bottom-4 left-0 right-0 w-full flex items-center justify-between px-4 sm:px-8 ${
        isSettingsOpen ? 'z-10' : 'z-50'
      }`}
      style={{ 
        pointerEvents: 'none'
      }}
    >
      {/* Left side: Copy, Search, Object Controls */}
      <div className="flex gap-2" style={{ pointerEvents: 'auto' }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={buttonStyle}
              onClick={onCopyCode}
              className={`transition-opacity duration-300 ${blendedButtonClasses}`}
              size="icon"
              aria-label="Copy Scene Configuration"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Copy Scene Config (C)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={buttonStyle}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Search Worlds"
              onClick={onShowSearch}
            >
              <Search className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search Worlds (S or Ctrl+K)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={objectMoveButtonStyle}
              className={`${blendedButtonClasses} ${isObjectMoveMode ? 'ring-2 ring-opacity-50' : ''}`}
              size="icon"
              aria-label="Object Move Mode"
              onClick={onToggleObjectMoveMode}
            >
              <Move className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">
                {isObjectMoveMode ? 'Deactivate Object Move (O)' : 'Activate Object Move (O)'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isObjectMoveMode 
                  ? 'Click to disable object movement' 
                  : isMobile 
                    ? 'Long press then drag objects'
                    : 'Ctrl+drag to move objects'
                }
              </p>
            </div>
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
                    style={buttonStyle}
                    className={blendedButtonClasses}
                    size="icon"
                    aria-label="Scene Settings"
                  >
                    <Settings className="w-4 h-4" />
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
                style={buttonStyle}
                className={blendedButtonClasses}
                size="icon"
                aria-label="Scene Settings"
                onClick={() => onToggleSettings(!isSettingsOpen)}
              >
                <Settings className="w-4 h-4" />
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
              style={buttonStyle}
              className={blendedButtonClasses}
              size="icon"
              aria-label="Help"
              onClick={onShowHelp}
            >
              <HelpCircle className="w-4 h-4" />
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
