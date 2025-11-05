import { ChevronDown, Sliders, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import { useExperience } from "@/hooks/useExperience";
import type { SceneConfig } from "@/types/scene";
import MainObjectControls from "../scene/controls/MainObjectControls";

interface MinimalSettingsPanelProps {
    sceneConfig: SceneConfig;
    onUpdate: (config: SceneConfig) => void;
    onClose?: () => void;
}

const MinimalSettingsPanel = ({
    sceneConfig,
    onUpdate,
    onClose,
}: MinimalSettingsPanelProps) => {
    const { objects, selectedObjectId } = useSceneObjectsContext();
    const selectedObject = objects.find(obj => obj.id === selectedObjectId);
    const { theme } = useExperience();
    const [expandedSection, setExpandedSection] = useState<string | null>("main");

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // Minimal color scheme
    const isDark = theme === "night";
    const panelBg = isDark ? "bg-black/80" : "bg-white/80";
    const textPrimary = isDark ? "text-white" : "text-gray-900";
    const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
    const border = isDark ? "border-white/10" : "border-gray-200/50";
    const hoverBg = isDark ? "hover:bg-white/5" : "hover:bg-gray-100/50";

    return (
        <div
            className={`h-full ${panelBg} backdrop-blur-xl border-l ${border} flex flex-col`}
            style={{
                width: "360px",
                minWidth: "360px",
            }}
        >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${border}`}>
                <div className="flex items-center gap-2">
                    <Sliders className={`w-4 h-4 ${textSecondary}`} />
                    <h2 className={`text-sm font-medium ${textPrimary}`}>Settings</h2>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className={`h-8 w-8 ${hoverBg}`}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-4 space-y-2">
                    {/* Main Object Section */}
                    <div className="space-y-2">
                        <button
                            onClick={() => toggleSection("main")}
                            className={`w-full flex items-center justify-between py-2 px-3 rounded-md ${hoverBg} transition-colors`}
                        >
                            <span className={`text-sm font-medium ${textPrimary}`}>
                                Main Object
                            </span>
                            <ChevronDown
                                className={`w-4 h-4 ${textSecondary} transition-transform ${
                                    expandedSection === "main" ? "rotate-180" : ""
                                }`}
                            />
                        </button>
                        {expandedSection === "main" && (
                            <div className="pl-3 pr-2 py-2 space-y-3">
                                <MainObjectControls
                                    sceneConfig={sceneConfig}
                                    onUpdate={onUpdate}
                                />
                            </div>
                        )}
                    </div>

                    <Separator className={`${border}`} />

                    {/* Selected Object Section */}
                    {selectedObject && (
                        <>
                            <div className="space-y-2">
                                <button
                                    onClick={() => toggleSection("selected")}
                                    className={`w-full flex items-center justify-between py-2 px-3 rounded-md ${hoverBg} transition-colors`}
                                >
                                    <span className={`text-sm font-medium ${textPrimary}`}>
                                        Selected Object
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 ${textSecondary} transition-transform ${
                                            expandedSection === "selected" ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                {expandedSection === "selected" && (
                                    <div className="pl-3 pr-2 py-2 space-y-3">
                                        <div className="space-y-2">
                                            <p className={`text-xs ${textSecondary}`}>
                                                Object controls will appear here
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Separator className={`${border}`} />
                        </>
                    )}

                    {/* Info Section */}
                    <div className={`pt-4 space-y-1`}>
                        <p className={`text-xs ${textSecondary}`}>
                            Type: {sceneConfig.type}
                        </p>
                        <p className={`text-xs ${textSecondary}`}>
                            Theme: {theme === "day" ? "Day" : "Night"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer - Subtle branding */}
            <div className={`px-6 py-3 border-t ${border}`}>
                <p className={`text-xs ${textSecondary} text-center`}>
                    Immersive Awe Canvas
                </p>
            </div>
        </div>
    );
};

export default MinimalSettingsPanel;
