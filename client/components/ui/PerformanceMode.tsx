import { Zap, ZapOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface PerformanceModeProps {
    onToggle: (enabled: boolean) => void;
    theme?: "day" | "night";
}

/**
 * Performance mode toggle for lower-end devices
 * Makes the experience accessible for all students
 */
const PerformanceMode = ({ onToggle, theme = "night" }: PerformanceModeProps) => {
    const [isPerformanceMode, setIsPerformanceMode] = useState(false);

    // Auto-detect if device might need performance mode
    useEffect(() => {
        const isLowEndDevice = () => {
            // Check for mobile devices
            const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
            
            // Check for hardware concurrency (CPU cores)
            const cores = navigator.hardwareConcurrency || 4;
            
            // Check for device memory (if available)
            const memory = (navigator as { deviceMemory?: number }).deviceMemory || 4;
            
            return isMobile || cores < 4 || memory < 4;
        };

        if (isLowEndDevice() && !sessionStorage.getItem('performance-mode-dismissed')) {
            setIsPerformanceMode(true);
            onToggle(true);
        }
    }, [onToggle]);

    const handleToggle = () => {
        const newValue = !isPerformanceMode;
        setIsPerformanceMode(newValue);
        onToggle(newValue);
        sessionStorage.setItem('performance-mode-dismissed', 'true');
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant={isPerformanceMode ? "default" : "outline"}
                        size="icon"
                        onClick={handleToggle}
                        className={isPerformanceMode ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                        {isPerformanceMode ? (
                            <Zap className="w-4 h-4" />
                        ) : (
                            <ZapOff className="w-4 h-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <div className="space-y-1">
                        <p className="font-semibold">
                            {isPerformanceMode ? "Performance Mode ON" : "Performance Mode OFF"}
                        </p>
                        <p className="text-xs">
                            {isPerformanceMode 
                                ? "Lower quality for smooth experience on older devices"
                                : "Full quality - may be slower on older devices"
                            }
                        </p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default PerformanceMode;
