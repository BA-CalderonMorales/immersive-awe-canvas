
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EyeOff, Sun, Moon } from "lucide-react";
import LikeDialog from "./LikeDialog";

interface TopBarActionsProps {
  uiStyle: { color: string; borderColor: string };
  blendedButtonClasses: string;
  onToggleUiHidden: () => void;
  onToggleTheme: () => void;
  theme: 'day' | 'night';
}

const TopBarActions = ({
  uiStyle,
  blendedButtonClasses,
  onToggleUiHidden,
  onToggleTheme,
  theme,
}: TopBarActionsProps) => {
  return (
    <div className="flex items-center gap-2 pointer-events-auto flex-shrink-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            aria-label="Hide UI"
            onClick={onToggleUiHidden}
            className={blendedButtonClasses}
            style={uiStyle}
          >
            <EyeOff className="w-6 h-6" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Hide UI (V)</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            style={uiStyle}
            onClick={onToggleTheme}
            className={blendedButtonClasses}
            size="icon"
            aria-label="Toggle Theme"
          >
            {theme === 'day' ? <Moon /> : <Sun />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Toggle Theme (Space)</p>
        </TooltipContent>
      </Tooltip>
      <LikeDialog 
        uiStyle={uiStyle}
        blendedButtonClasses={blendedButtonClasses}
      />
    </div>
  );
};

export default TopBarActions;
