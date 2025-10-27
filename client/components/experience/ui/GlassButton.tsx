import { cn } from "@utils/utils";
import type { LucideIcon } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

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

    return (
        <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
                <button
                    type="button"
                    onClick={onClick}
                    className={cn(
                        // Base minimal styling
                        "relative h-10 w-10 rounded-md",
                        "inline-flex items-center justify-center",
                        "transition-all duration-200",
                        "outline-none",

                        // Minimal background
                        isDayTheme
                            ? "bg-white/[0.08] hover:bg-white/[0.12] active:bg-white/[0.16]"
                            : "bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.12]",

                        // Subtle border
                        isDayTheme
                            ? "border border-black/[0.06]"
                            : "border border-white/[0.08]",

                        // Text color
                        isDayTheme
                            ? "text-black/[0.9]"
                            : "text-white/[0.95]",

                        // Active state
                        active && [
                            isDayTheme
                                ? "bg-white/[0.16] border-black/[0.12]"
                                : "bg-white/[0.12] border-white/[0.16]"
                        ],

                        // Focus ring - minimal accent
                        "focus-visible:outline-none focus-visible:ring-1",
                        active ? "" : "focus-visible:ring-current focus-visible:ring-opacity-40",

                        // Micro-interactions
                        "hover:scale-[1.02] active:scale-[0.98]",

                        // Disabled state
                        "disabled:opacity-30 disabled:pointer-events-none",

                        className
                    )}
                    style={{
                        ...(active && {
                            borderColor: `${uiColor}40`, // 25% opacity
                            color: uiColor,
                        }),
                    }}
                >
                    <Icon
                        className="w-4 h-4"
                        strokeWidth={1.5}
                    />
                </button>
            </TooltipTrigger>
            <TooltipContent
                side="bottom"
                className={cn(
                    "px-3 py-2 text-xs font-medium",
                    isDayTheme
                        ? "bg-black/[0.9] text-white border-black/[0.2]"
                        : "bg-white/[0.9] text-black border-white/[0.2]"
                )}
            >
                <div className="flex items-center gap-2">
                    <span>{label}</span>
                    {shortcut && (
                        <kbd className={cn(
                            "px-1.5 py-0.5 rounded text-[10px] font-mono",
                            isDayTheme
                                ? "bg-white/[0.15] text-white/[0.7]"
                                : "bg-black/[0.15] text-black/[0.7]"
                        )}>
                            {shortcut}
                        </kbd>
                    )}
                </div>
            </TooltipContent>
        </Tooltip>
    );
};

export default GlassButton;
