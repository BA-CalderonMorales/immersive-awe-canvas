
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { SceneConfig } from "@/types/scene";
import { Copy, Settings, HelpCircle, Search, Move, Grid3X3 } from "lucide-react";
import SceneSettingsPanel from "../SceneSettingsPanel";

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
  forceWireframe: boolean;
  onToggleWireframe: () => void;
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
  forceWireframe,
  onToggleWireframe,
}: BottomBarProps) => {
  const blendedButtonClasses = theme === 'day' 
    ? "border border-gray-300 bg-white/90 hover:bg-white backdrop-blur-sm shadow-lg"
    : "border bg-black/70 hover:bg-black/90 backdrop-blur-sm shadow-lg";
  
  const uiStyle = { borderColor: uiColor };
  const textStyle = theme === 'day' ? { color: '#1f2937' } : { color: uiColor };
  const buttonStyle = { ...uiStyle, ...textStyle };

  return (
    <div 
      className={`fixed bottom-4 left-0 right-0 w-full flex items-center justify-between px-4 sm:px-8 z-30`}
      style={{ 
        pointerEvents: 'none'
      }}
    >
      {/* Left side: Copy, Search, Drag Toggle, Wireframe Toggle */}
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
              style={buttonStyle}
              className={`${blendedButtonClasses} ${isDragEnabled ? 'bg-blue-500/20 text-blue-400' : ''}`}
              size="icon"
              aria-label="Toggle Drag Controls"
              onClick={onToggleDrag}
            >
              <Move className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Drag Controls (Z)</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              style={buttonStyle}
              className={`${blendedButtonClasses} ${forceWireframe ? 'bg-green-500/20 text-green-400' : ''}`}
              size="icon"
              aria-label="Toggle Wireframe"
              onClick={onToggleWireframe}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle Wireframe (W)</p>
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
            <SheetContent side="bottom" className="h-[75vh] bg-black/95 border-t border-cyan-500/30 p-0">
              <SceneSettingsPanel sceneConfig={editableSceneConfig} onUpdate={onUpdateSceneConfig} />
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
