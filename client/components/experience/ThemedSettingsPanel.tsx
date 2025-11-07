import { cn } from "@utils/utils";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import { useExperience } from "@/hooks/useExperience";
import type { SceneConfig } from "@/types/scene";
import MainObjectControls from "../scene/controls/MainObjectControls";

interface ThemedSettingsPanelProps {
    sceneConfig: SceneConfig;
    onUpdate: (config: SceneConfig) => void;
    onClose?: () => void;
    uiColor: string;
}

const ThemedSettingsPanel = ({
    sceneConfig,
    onUpdate,
    onClose,
    uiColor,
}: ThemedSettingsPanelProps) => {
    const { objects, selectedObjectId } = useSceneObjectsContext();
    const selectedObject = objects.find(obj => obj.id === selectedObjectId);
    const { theme } = useExperience();
    const [expandedSection, setExpandedSection] = useState<string | null>(
        "main"
    );

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const isDayTheme = theme === "day";

    return (
        <div
            className={cn(
                "h-full flex flex-col",
                "border-l",
                // Match the site's glass aesthetic
                isDayTheme
                    ? "bg-white/[0.02] backdrop-blur-xl border-black/[0.04]"
                    : "bg-white/[0.01] backdrop-blur-xl border-white/[0.04]"
            )}
            style={{
                width: "340px",
                minWidth: "340px",
            }}
        >
            {/* Header - Minimal */}
            <div
                className={cn(
                    "flex items-center justify-between px-5 py-4",
                    "border-b",
                    isDayTheme ? "border-black/[0.04]" : "border-white/[0.04]"
                )}
            >
                <h2
                    className={cn(
                        "text-sm font-medium tracking-wide",
                        isDayTheme ? "text-gray-900" : "text-white"
                    )}
                >
                    Settings
                </h2>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={cn(
                            "h-8 w-8 rounded-md inline-flex items-center justify-center",
                            "transition-all duration-200",
                            isDayTheme
                                ? "hover:bg-white/[0.08] text-black/[0.7] hover:text-black/[0.9]"
                                : "hover:bg-white/[0.04] text-white/[0.7] hover:text-white/[0.95]"
                        )}
                    >
                        <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                )}
            </div>

            {/* Content - Scrollable with minimal custom scrollbar */}
            <div
                className={cn(
                    "flex-1 overflow-y-auto",
                    // Custom minimal scrollbar styling
                    "[&::-webkit-scrollbar]:w-1.5",
                    "[&::-webkit-scrollbar-track]:bg-transparent",
                    isDayTheme
                        ? "[&::-webkit-scrollbar-thumb]:bg-black/[0.08] hover:[&::-webkit-scrollbar-thumb]:bg-black/[0.12]"
                        : "[&::-webkit-scrollbar-thumb]:bg-white/[0.08] hover:[&::-webkit-scrollbar-thumb]:bg-white/[0.12]",
                    "[&::-webkit-scrollbar-thumb]:rounded-full",
                    "[&::-webkit-scrollbar-thumb]:transition-colors"
                )}
            >
                <div className="px-5 py-4 space-y-1">
                    {/* Main Object Section */}
                    <div className="space-y-1">
                        <button
                            onClick={() => toggleSection("main")}
                            className={cn(
                                "w-full flex items-center justify-between",
                                "py-2.5 px-3 rounded-md",
                                "transition-all duration-200",
                                isDayTheme
                                    ? "hover:bg-gray-100/80 text-gray-900"
                                    : "hover:bg-white/[0.08] text-white",
                                expandedSection === "main" && [
                                    isDayTheme
                                        ? "bg-gray-100/60"
                                        : "bg-white/[0.05]",
                                ]
                            )}
                        >
                            <span className="text-sm font-medium">
                                Main Object
                            </span>
                            <ChevronDown
                                className={cn(
                                    "w-4 h-4 transition-transform duration-200",
                                    isDayTheme
                                        ? "text-gray-600"
                                        : "text-gray-400",
                                    expandedSection === "main" && "rotate-180"
                                )}
                                strokeWidth={1.5}
                            />
                        </button>
                        {expandedSection === "main" && (
                            <div className="px-3 py-2">
                                <MainObjectControls
                                    sceneConfig={sceneConfig}
                                    onUpdate={onUpdate}
                                />
                            </div>
                        )}
                    </div>

                    {/* Separator */}
                    <div
                        className={cn(
                            "h-px my-3",
                            isDayTheme ? "bg-black/[0.04]" : "bg-white/[0.04]"
                        )}
                    />

                    {/* Selected Object Section */}
                    {selectedObject && (
                        <>
                            <div className="space-y-1">
                                <button
                                    onClick={() => toggleSection("selected")}
                                    className={cn(
                                        "w-full flex items-center justify-between",
                                        "py-2.5 px-3 rounded-md",
                                        "transition-all duration-200",
                                        isDayTheme
                                            ? "hover:bg-gray-100/80 text-gray-900"
                                            : "hover:bg-white/[0.08] text-white",
                                        expandedSection === "selected" && [
                                            isDayTheme
                                                ? "bg-gray-100/60"
                                                : "bg-white/[0.05]",
                                        ]
                                    )}
                                >
                                    <span className="text-sm font-medium">
                                        Selected Object
                                    </span>
                                    <ChevronDown
                                        className={cn(
                                            "w-4 h-4 transition-transform duration-200",
                                            isDayTheme
                                                ? "text-gray-600"
                                                : "text-gray-400",
                                            expandedSection === "selected" &&
                                                "rotate-180"
                                        )}
                                        strokeWidth={1.5}
                                    />
                                </button>
                                {expandedSection === "selected" && (
                                    <div className="px-3 py-2">
                                        <p
                                            className={cn(
                                                "text-xs",
                                                isDayTheme
                                                    ? "text-gray-600"
                                                    : "text-gray-400"
                                            )}
                                        >
                                            Object controls will appear here
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div
                                className={cn(
                                    "h-px my-3",
                                    isDayTheme
                                        ? "bg-black/[0.04]"
                                        : "bg-white/[0.04]"
                                )}
                            />
                        </>
                    )}

                    {/* Info Section */}
                    <div className="pt-2 space-y-1.5 px-3">
                        <div className="flex items-center justify-between">
                            <span
                                className={cn(
                                    "text-xs",
                                    isDayTheme
                                        ? "text-gray-600"
                                        : "text-gray-400"
                                )}
                            >
                                Type
                            </span>
                            <span
                                className={cn(
                                    "text-xs font-mono",
                                    isDayTheme ? "text-gray-900" : "text-white"
                                )}
                            >
                                {sceneConfig.type}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span
                                className={cn(
                                    "text-xs",
                                    isDayTheme
                                        ? "text-gray-600"
                                        : "text-gray-400"
                                )}
                            >
                                Theme
                            </span>
                            <span
                                className={cn(
                                    "text-xs font-mono",
                                    isDayTheme ? "text-gray-900" : "text-white"
                                )}
                            >
                                {theme === "day" ? "Day" : "Night"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer - Subtle branding */}
            <div
                className={cn(
                    "px-5 py-3 border-t",
                    isDayTheme ? "border-black/[0.04]" : "border-white/[0.04]"
                )}
            >
                <p
                    className={cn(
                        "text-xs text-center",
                        isDayTheme ? "text-gray-500" : "text-gray-500"
                    )}
                >
                    Immersive Awe Canvas
                </p>
            </div>
        </div>
    );
};

export default ThemedSettingsPanel;
