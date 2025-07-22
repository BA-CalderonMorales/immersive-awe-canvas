import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideIcon } from "lucide-react";
import { cn } from "@utils/utils";

interface GlassButtonProps {
    icon: LucideIcon;
    label: string;
    shortcut?: string;
    onClick: () => void;
    theme: "day" | "night";
    uiColor: string;
    active?: boolean;
    className?: string;
}

const GlassButton = ({
    icon: Icon,
    label,
    shortcut,
    onClick,
    theme,
    uiColor,
    active = false,
    className,
}: GlassButtonProps) => {
    const isDayTheme = theme === "day";

    const buttonStyle = {
        backgroundColor: isDayTheme
            ? "rgb(var(--ui-glass-day))"
            : "rgb(var(--ui-glass-night))",
        borderColor: active
            ? uiColor
            : isDayTheme
              ? "rgb(var(--ui-border-day))"
              : "rgb(var(--ui-border-night))",
        color: isDayTheme ? "rgb(var(--ui-text-day))" : uiColor,
    };

    const hoverStyle = {
        "--tw-bg-opacity": "1",
        backgroundColor: isDayTheme
            ? "rgb(var(--ui-hover-day))"
            : "rgb(var(--ui-hover-night))",
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant={active ? "glass-active" : "glass"}
                    onClick={onClick}
                    style={buttonStyle}
                    className={cn(
                        "hover:scale-105 active:scale-95",
                        active && "ring-2 ring-offset-2",
                        className
                    )}
                    onMouseEnter={e => {
                        Object.assign(e.currentTarget.style, hoverStyle);
                    }}
                    onMouseLeave={e => {
                        Object.assign(e.currentTarget.style, buttonStyle);
                    }}
                >
                    <Icon className="w-4 h-4" />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    {label}
                    {shortcut && ` (${shortcut})`}
                </p>
            </TooltipContent>
        </Tooltip>
    );
};

export default GlassButton;
