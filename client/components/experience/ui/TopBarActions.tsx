import { EyeOff, Moon, Sun } from "lucide-react";
import GlassButton from "./GlassButton";
import LikeDialog from "./LikeDialog";

interface TopBarActionsProps {
    uiColor: string;
    theme: "day" | "night";
    onToggleUiHidden: () => void;
    onToggleTheme: () => void;
}

const TopBarActions = ({
    uiColor,
    theme,
    onToggleUiHidden,
    onToggleTheme,
}: TopBarActionsProps) => {
    return (
        <div className="flex items-center gap-2 pointer-events-auto flex-shrink-0">
            <GlassButton
                icon={EyeOff}
                label="Hide UI"
                shortcut="V"
                onClick={onToggleUiHidden}
                theme={theme}
                uiColor={uiColor}
            />
            <GlassButton
                icon={theme === "day" ? Moon : Sun}
                label="Toggle Theme"
                shortcut="Space"
                onClick={onToggleTheme}
                theme={theme}
                uiColor={uiColor}
            />
            <LikeDialog theme={theme} uiColor={uiColor} />
        </div>
    );
};

export default TopBarActions;
