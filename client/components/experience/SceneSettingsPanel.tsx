import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Settings,
    Info,
    Shapes,
    ChevronsUpDown,
    Palette,
    Play,
    Pause,
    Save,
    Library,
    RotateCcw,
} from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SceneConfig } from "@/types/scene";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import SceneObjectsList from "../scene/controls/components/SceneObjectsList";
import ObjectAddPanel from "../scene/controls/components/ObjectAddPanel";
import ObjectGuiControls from "../scene/controls/components/ObjectGuiControls";
import MainObjectControls from "../scene/controls/MainObjectControls";
import SaveSceneDialog from "../scene/controls/components/SaveSceneDialog";
import UserScenesManager from "../scene/controls/components/UserScenesManager";
import { useState } from "react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useExperience } from "@/hooks/useExperience";
import { useDeviceType } from "@/hooks/use-mobile";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSettingsPanelViewModel } from "@/hooks/useSettingsPanelViewModel";

interface SceneSettingsPanelProps {
    sceneConfig: SceneConfig;
    onUpdate: (config: SceneConfig) => void;
    isMotionFrozen?: boolean;
    onToggleMotion?: () => void;
    onJumpToBackground?: (index: number) => void;
    onJumpToGeometry?: (index: number) => void;
}

const SceneSettingsPanel = ({
    sceneConfig,
    onUpdate,
    isMotionFrozen = false,
    onToggleMotion,
    onJumpToBackground,
    onJumpToGeometry,
}: SceneSettingsPanelProps) => {
    const { objects, selectedObjectId, actions } = useSceneObjectsContext();
    const selectedObject = objects.find(obj => obj.id === selectedObjectId);
    const [isAddingObject, setIsAddingObject] = useState(false);
    const [activeTab, setActiveTab] = useState("main");
    const { theme } = useExperience();
    const { isMobile, isTablet, isDesktop } = useDeviceType();

    // Use the new ViewModel
    const viewModel = useSettingsPanelViewModel({
        sceneConfig,
        onSceneUpdate: onUpdate,
        isMotionFrozen,
        onToggleMotion,
    });

    // Responsive settings - ensure no content cutoff
    const panelWidth = isMobile ? "w-full" : "w-full max-w-md";
    const headerPadding = isMobile ? "p-3" : "p-4";
    const contentPadding = isMobile ? "p-3" : "p-4";
    const spacingY = isMobile ? "space-y-4" : "space-y-6";

    // Enhanced color schemes for better integration with the experience
    const colorScheme = {
        day: {
            background: "bg-white/95 backdrop-blur-sm",
            border: "border-gray-200/60",
            headerBg: "bg-white/90 backdrop-blur-md",
            headerBorder: "border-gray-200/40",
            primaryText: "text-gray-900",
            secondaryText: "text-gray-600",
            accentText: "text-gray-800",
            accentHover: "hover:bg-gray-50/80 transition-all duration-200",
            separatorColor: "bg-gray-100/60",
            collapsibleHover:
                "hover:bg-gray-50/80 hover:shadow-sm transition-all duration-300 ease-out",
            infoIcon: "text-gray-500 hover:text-gray-700",
            cardBg: "bg-white/40 backdrop-blur-sm",
            buttonSecondary:
                "bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 border-gray-200/60",
        },
        night: {
            background: "bg-gray-950/95 backdrop-blur-sm",
            border: "border-gray-800/60",
            headerBg: "bg-gray-950/90 backdrop-blur-md",
            headerBorder: "border-gray-800/40",
            primaryText: "text-gray-100",
            secondaryText: "text-gray-400",
            accentText: "text-gray-200",
            accentHover: "hover:bg-gray-900/80 transition-all duration-200",
            separatorColor: "bg-gray-800/60",
            collapsibleHover:
                "hover:bg-gray-900/80 hover:shadow-lg hover:shadow-gray-900/20 transition-all duration-300 ease-out",
            infoIcon: "text-gray-500 hover:text-gray-300",
            cardBg: "bg-gray-900/40 backdrop-blur-sm",
            buttonSecondary:
                "bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 border-gray-700/60",
        },
    };

    const colors = colorScheme[theme];

    return (
        <div
            className={`h-full ${panelWidth} ${colors.background} ${colors.border} border-l z-40 relative flex flex-col shadow-2xl shadow-black/10`}
        >
            <div
                className={`${colors.headerBg} z-10 ${colors.headerBorder} border-b ${headerPadding} flex-shrink-0`}
            >
                <div className="flex items-center justify-between mb-2">
                    <h2
                        className={`${colors.primaryText} flex items-center gap-2 font-medium ${isMobile ? "text-base" : "text-lg"}`}
                    >
                        <Settings
                            className={`${isMobile ? "w-4 h-4" : "w-5 h-5"}`}
                        />
                        Scene Editor
                    </h2>
                    <div className="flex items-center gap-2">
                        {/* Scene Management Buttons */}
                        <SaveSceneDialog
                            sceneConfig={sceneConfig}
                            baseGeometryId={undefined}
                            baseGeometryName={undefined}
                            trigger={
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`p-1.5 h-auto ${colors.accentHover}`}
                                        >
                                            <Save className="w-4 h-4 text-blue-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        Save current scene
                                    </TooltipContent>
                                </Tooltip>
                            }
                        />

                        <UserScenesManager
                            onLoadScene={onUpdate}
                            trigger={
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`p-1.5 h-auto ${colors.accentHover}`}
                                        >
                                            <Library className="w-4 h-4 text-purple-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                        My saved scenes
                                    </TooltipContent>
                                </Tooltip>
                            }
                        />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={viewModel.toggleMotion}
                                    className={`p-1.5 h-auto ${colors.accentHover}`}
                                    data-testid="motion-toggle-button"
                                >
                                    {viewModel.isMotionFrozen ? (
                                        <Play
                                            className="w-4 h-4 text-emerald-500"
                                            data-testid="play-icon"
                                        />
                                    ) : (
                                        <Pause
                                            className="w-4 h-4 text-orange-500"
                                            data-testid="pause-icon"
                                        />
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                {viewModel.isMotionFrozen
                                    ? "Resume animation"
                                    : "Freeze animation"}
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={viewModel.resetScene}
                                    className={`p-1.5 h-auto ${colors.accentHover}`}
                                    data-testid="reset-scene-button"
                                >
                                    <RotateCcw className="w-4 h-4 text-red-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                Reset to default scene
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info
                                    className={`w-4 h-4 ${colors.infoIcon} cursor-help transition-colors`}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>All controls update objects in real-time.</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
                <p
                    className={`${colors.secondaryText} ${isMobile ? "text-xs" : "text-sm"}`}
                >
                    All scene controls in one view - no hidden content.
                </p>
            </div>

            {/* Single scrollable view - no tabs, no content cutoff */}
            <div className="flex-1 overflow-y-auto scene-editor-scrollbar">
                <div className={`${contentPadding} ${spacingY}`}>
                    {/* Scene Environment Section */}
                    <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`w-full justify-between ${colors.collapsibleHover} ${colors.primaryText} mb-3 h-auto py-3 px-4 rounded-xl border ${colors.border} group`}
                                aria-label="Toggle scene environment controls"
                            >
                                <div className="flex items-center gap-2">
                                    <Settings
                                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-indigo-600`}
                                    />
                                    <span
                                        className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Scene Environment
                                    </span>
                                </div>
                                <ChevronsUpDown
                                    className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${colors.secondaryText} group-hover:scale-110 transition-transform duration-200`}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div
                                className={`${colors.cardBg} rounded-xl ${isMobile ? "p-3" : "p-4"} border ${colors.border} mb-4 shadow-sm space-y-4`}
                            >
                                {/* Scene Type Selection */}
                                <div className="space-y-2">
                                    <Label
                                        className={`${colors.primaryText} font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Scene Type
                                    </Label>
                                    <div
                                        className={`${colors.buttonSecondary} p-2 rounded text-sm`}
                                    >
                                        Current: {sceneConfig.type}
                                    </div>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Main Object Section */}
                    <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`w-full justify-between ${colors.collapsibleHover} ${colors.primaryText} mb-3 h-auto py-3 px-4 rounded-xl border ${colors.border} group`}
                                aria-label="Toggle main object controls"
                            >
                                <div className="flex items-center gap-2">
                                    <Palette
                                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-blue-600`}
                                    />
                                    <span
                                        className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Main Object
                                    </span>
                                </div>
                                <ChevronsUpDown
                                    className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${colors.secondaryText} group-hover:scale-110 transition-transform duration-200`}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div
                                className={`${colors.cardBg} rounded-xl ${isMobile ? "p-3" : "p-4"} border ${colors.border} mb-4 shadow-sm space-y-4`}
                            >
                                {/* Main Object Color */}
                                <div className="space-y-2">
                                    <Label
                                        className={`${colors.primaryText} font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Object Color
                                    </Label>
                                    <Input
                                        type="text"
                                        value={viewModel.mainObjectColor}
                                        onChange={e =>
                                            viewModel.updateMainObjectColor(
                                                e.target.value
                                            )
                                        }
                                        placeholder="#ffffff"
                                        className={`${colors.buttonSecondary}`}
                                        data-testid="main-object-color-input"
                                    />
                                </div>

                                {/* Material Type */}
                                <div className="space-y-2">
                                    <Label
                                        className={`${colors.primaryText} font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Material Type
                                    </Label>
                                    <Select
                                        value={
                                            viewModel.materialConfig
                                                .materialType
                                        }
                                        onValueChange={
                                            viewModel.updateMaterialType
                                        }
                                    >
                                        <SelectTrigger
                                            className={`${colors.buttonSecondary}`}
                                            data-testid="material-type-select"
                                        >
                                            <SelectValue placeholder="Select material type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="standard">
                                                Standard
                                            </SelectItem>
                                            <SelectItem value="physical">
                                                Physical
                                            </SelectItem>
                                            <SelectItem value="basic">
                                                Basic
                                            </SelectItem>
                                            <SelectItem value="toon">
                                                Toon
                                            </SelectItem>
                                            <SelectItem value="lambert">
                                                Lambert
                                            </SelectItem>
                                            <SelectItem value="phong">
                                                Phong
                                            </SelectItem>
                                            <SelectItem value="normal">
                                                Normal
                                            </SelectItem>
                                            <SelectItem value="matcap">
                                                Matcap
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Material Metalness */}
                                <div className="space-y-2">
                                    <Label
                                        className={`${colors.primaryText} font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Metalness:{" "}
                                        {viewModel.materialConfig.metalness?.toFixed(
                                            2
                                        ) || "0.50"}
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={
                                            viewModel.materialConfig
                                                .metalness || 0.5
                                        }
                                        onChange={e =>
                                            viewModel.updateMaterialMetalness(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full"
                                        data-testid="material-metalness-slider"
                                    />
                                </div>

                                {/* Material Roughness */}
                                <div className="space-y-2">
                                    <Label
                                        className={`${colors.primaryText} font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Roughness:{" "}
                                        {viewModel.materialConfig.roughness?.toFixed(
                                            2
                                        ) || "0.50"}
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={
                                            viewModel.materialConfig
                                                .roughness || 0.5
                                        }
                                        onChange={e =>
                                            viewModel.updateMaterialRoughness(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full"
                                        data-testid="material-roughness-slider"
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Light Controls Section */}
                    <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`w-full justify-between ${colors.collapsibleHover} ${colors.primaryText} mb-3 h-auto py-3 px-4 rounded-xl border ${colors.border} group`}
                                aria-label="Toggle light controls"
                            >
                                <div className="flex items-center gap-2">
                                    <Settings
                                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-yellow-600`}
                                    />
                                    <span
                                        className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Lighting
                                    </span>
                                </div>
                                <ChevronsUpDown
                                    className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${colors.secondaryText} group-hover:scale-110 transition-transform duration-200`}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div
                                className={`${colors.cardBg} rounded-xl ${isMobile ? "p-3" : "p-4"} border ${colors.border} mb-4 shadow-sm space-y-4`}
                            >
                                {/* Ambient Light Intensity */}
                                <div className="space-y-2">
                                    <Label
                                        className={`${colors.primaryText} font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Ambient Light:{" "}
                                        {viewModel.ambientLightIntensity.toFixed(
                                            2
                                        )}
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="3"
                                        step="0.1"
                                        value={viewModel.ambientLightIntensity}
                                        onChange={e =>
                                            viewModel.updateAmbientLightIntensity(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full"
                                        data-testid="ambient-light-intensity-slider"
                                    />
                                </div>

                                {/* Directional Light Intensity */}
                                <div className="space-y-2">
                                    <Label
                                        className={`${colors.primaryText} font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Directional Light:{" "}
                                        {viewModel.directionalLightIntensity.toFixed(
                                            2
                                        )}
                                    </Label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="3"
                                        step="0.1"
                                        value={
                                            viewModel.directionalLightIntensity
                                        }
                                        onChange={e =>
                                            viewModel.updateDirectionalLightIntensity(
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className="w-full"
                                        data-testid="directional-light-intensity-slider"
                                    />
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Background Controls Section */}
                    <Collapsible defaultOpen={true}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`w-full justify-between ${colors.collapsibleHover} ${colors.primaryText} mb-3 h-auto py-3 px-4 rounded-xl border ${colors.border} group`}
                                aria-label="Toggle background controls"
                            >
                                <div className="flex items-center gap-2">
                                    <Settings
                                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-purple-600`}
                                    />
                                    <span
                                        className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Background
                                    </span>
                                </div>
                                <ChevronsUpDown
                                    className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${colors.secondaryText} group-hover:scale-110 transition-transform duration-200`}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div
                                className={`${colors.cardBg} rounded-xl ${isMobile ? "p-3" : "p-4"} border ${colors.border} mb-4 shadow-sm space-y-4`}
                            >
                                {/* Background Type */}
                                <div className="space-y-2">
                                    <Label
                                        className={`${colors.primaryText} font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Background Type
                                    </Label>
                                    <Select
                                        value={viewModel.backgroundConfig.type}
                                        onValueChange={
                                            viewModel.updateBackgroundType
                                        }
                                    >
                                        <SelectTrigger
                                            className={`${colors.buttonSecondary}`}
                                            data-testid="background-type-select"
                                        >
                                            <SelectValue placeholder="Select background type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="void">
                                                Void
                                            </SelectItem>
                                            <SelectItem value="stars">
                                                Stars
                                            </SelectItem>
                                            <SelectItem value="sky">
                                                Sky
                                            </SelectItem>
                                            <SelectItem value="gradient">
                                                Gradient
                                            </SelectItem>
                                            <SelectItem value="noise">
                                                Noise
                                            </SelectItem>
                                            <SelectItem value="plasma">
                                                Plasma
                                            </SelectItem>
                                            <SelectItem value="aurora">
                                                Aurora
                                            </SelectItem>
                                            <SelectItem value="sunset">
                                                Sunset
                                            </SelectItem>
                                            <SelectItem value="nebula">
                                                Nebula
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Add Objects Section */}
                    <Collapsible defaultOpen={false}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`w-full justify-between ${colors.collapsibleHover} ${colors.primaryText} mb-3 h-auto py-3 px-4 rounded-xl border ${colors.border} group`}
                                aria-label="Toggle add objects panel"
                            >
                                <div className="flex items-center gap-2">
                                    <Shapes
                                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-emerald-600`}
                                    />
                                    <span
                                        className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Add Objects
                                    </span>
                                </div>
                                <ChevronsUpDown
                                    className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${colors.secondaryText} group-hover:scale-110 transition-transform duration-200`}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div
                                className={`${colors.cardBg} rounded-xl ${isMobile ? "p-3" : "p-4"} border ${colors.border} mb-4 shadow-sm`}
                            >
                                <ObjectAddPanel
                                    isAddingObject={isAddingObject}
                                    onToggleAddMode={() =>
                                        setIsAddingObject(!isAddingObject)
                                    }
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Scene Objects List */}
                    <Collapsible defaultOpen={false}>
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`w-full justify-between ${colors.collapsibleHover} ${colors.primaryText} mb-3 h-auto py-3 px-4 rounded-xl border ${colors.border} group`}
                                aria-label={`Toggle scene objects list (${objects.length} objects)`}
                            >
                                <div className="flex items-center gap-2">
                                    <Shapes
                                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-purple-600`}
                                    />
                                    <span
                                        className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                    >
                                        Scene Objects ({objects.length})
                                    </span>
                                </div>
                                <ChevronsUpDown
                                    className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${colors.secondaryText} group-hover:scale-110 transition-transform duration-200`}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div
                                className={`${colors.cardBg} rounded-xl ${isMobile ? "p-3" : "p-4"} border ${colors.border} mb-4 shadow-sm`}
                            >
                                <SceneObjectsList
                                    objects={objects}
                                    selectedObjectId={selectedObjectId}
                                    onSelectObject={actions.selectObject}
                                />
                            </div>
                        </CollapsibleContent>
                    </Collapsible>

                    {/* Object Properties */}
                    {selectedObject && (
                        <Collapsible defaultOpen={false}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-between ${colors.collapsibleHover} ${colors.primaryText} mb-3 h-auto py-3 px-4 rounded-xl border ${colors.border} group`}
                                    aria-label={`Toggle properties for ${selectedObject.type} object`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Settings
                                            className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-orange-600`}
                                        />
                                        <span
                                            className={`font-medium ${isMobile ? "text-sm" : "text-base"}`}
                                        >
                                            {selectedObject.type
                                                .charAt(0)
                                                .toUpperCase() +
                                                selectedObject.type.slice(
                                                    1
                                                )}{" "}
                                            Properties
                                        </span>
                                    </div>
                                    <ChevronsUpDown
                                        className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} ${colors.secondaryText} group-hover:scale-110 transition-transform duration-200`}
                                    />
                                </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <div
                                    className={`${colors.cardBg} rounded-xl ${isMobile ? "p-3" : "p-4"} border ${colors.border} mb-4 shadow-sm`}
                                >
                                    <ObjectGuiControls
                                        object={selectedObject}
                                        onUpdate={updates =>
                                            actions.updateObject(
                                                selectedObject.id,
                                                updates
                                            )
                                        }
                                    />
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    )}

                    {!selectedObject && objects.length > 0 && (
                        <div
                            className={`text-center ${isMobile ? "text-xs" : "text-sm"} ${colors.secondaryText} py-6 ${colors.cardBg} rounded-lg border border-dashed ${colors.border}`}
                        >
                            <p>Select an object above to edit its properties</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SceneSettingsPanel;
