import { Baby, GraduationCap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface BeginnerModeToggleProps {
    onToggle: (enabled: boolean) => void;
    theme?: "day" | "night";
}

/**
 * Beginner Mode simplifies the interface for kids and first-time users
 * - Shows helpful labels
 * - Limits advanced options
 * - Provides encouraging feedback
 */
const BeginnerModeToggle = ({ onToggle, theme = "night" }: BeginnerModeToggleProps) => {
    const [isBeginnerMode, setIsBeginnerMode] = useState(() => {
        // Check if this is likely a first-time visitor
        const visited = localStorage.getItem('visited-before');
        return !visited;
    });

    const handleToggle = () => {
        const newValue = !isBeginnerMode;
        setIsBeginnerMode(newValue);
        onToggle(newValue);
        
        if (!newValue) {
            localStorage.setItem('visited-before', 'true');
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={isBeginnerMode ? "default" : "outline"}
                        size="sm"
                        onClick={handleToggle}
                        className={`gap-2 ${
                            isBeginnerMode 
                                ? "bg-purple-600 hover:bg-purple-700" 
                                : ""
                        }`}
                    >
                        {isBeginnerMode ? (
                            <>
                                <Baby className="w-4 h-4" />
                                <span className="hidden sm:inline">Beginner Mode</span>
                            </>
                        ) : (
                            <>
                                <GraduationCap className="w-4 h-4" />
                                <span className="hidden sm:inline">Advanced Mode</span>
                            </>
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <div className="space-y-1">
                        <p className="font-semibold">
                            {isBeginnerMode ? "Beginner Mode Active" : "Advanced Mode Active"}
                        </p>
                        <p className="text-xs">
                            {isBeginnerMode 
                                ? "Simplified interface with helpful tips and labels"
                                : "Full control with all advanced settings"
                            }
                        </p>
                        <p className="text-[10px] opacity-70">
                            {isBeginnerMode 
                                ? "Perfect for learning! Click to unlock advanced features."
                                : "You're a pro! Click to simplify the interface."
                            }
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default BeginnerModeToggle;
