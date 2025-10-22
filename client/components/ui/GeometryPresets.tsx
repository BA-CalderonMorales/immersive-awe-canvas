import { Atom, Flower2, Hexagon, Orbit, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SceneConfig } from "@/types/scene";

interface GeometryPresetsProps {
    onSelectPreset: (type: SceneConfig["type"]) => void;
    theme?: "day" | "night";
}

const presets = [
    {
        type: "TorusKnot" as const,
        icon: Orbit,
        name: "Torus Knot",
        description: "A twisted ring shape that loops around itself",
        difficulty: "Beginner",
        educational: "Learn about topology and knot theory!",
    },
    {
        type: "FibonacciSphere" as const,
        icon: Sparkles,
        name: "Fibonacci Sphere",
        description: "Points arranged using nature's golden ratio",
        difficulty: "Intermediate",
        educational: "See the golden ratio in 3D - just like sunflower seeds!",
    },
    {
        type: "SacredGeometry" as const,
        icon: Hexagon,
        name: "Sacred Geometry",
        description: "Ancient shapes nested in perfect harmony",
        difficulty: "Intermediate",
        educational: "Explore Platonic solids - the building blocks of nature!",
    },
    {
        type: "MandalaFlower" as const,
        icon: Flower2,
        name: "Mandala Flower",
        description: "A beautiful flower with spiraling petals",
        difficulty: "Beginner",
        educational: "Discover how flowers use math to grow!",
    },
    {
        type: "MorphingIcosahedron" as const,
        icon: Atom,
        name: "Morphing Crystal",
        description: "A 20-sided shape that breathes and transforms",
        difficulty: "Beginner",
        educational: "Icosahedrons appear in viruses and crystals!",
    },
    {
        type: "WavyGrid" as const,
        icon: Waves,
        name: "Wave Grid",
        description: "A flat plane that ripples like water",
        difficulty: "Beginner",
        educational: "Understand sine waves and oscillation!",
    },
];

const GeometryPresets = ({ onSelectPreset, theme = "night" }: GeometryPresetsProps) => {
    return (
        <TooltipProvider>
            <div className="space-y-3">
                <h3 className="text-sm font-semibold opacity-70">Quick Start Shapes</h3>
                <div className="grid grid-cols-2 gap-2">
                    {presets.map(preset => {
                        const Icon = preset.icon;
                        return (
                            <Tooltip key={preset.type} delayDuration={300}>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={`h-auto flex flex-col items-center gap-2 p-3 hover:scale-105 transition-transform ${
                                            theme === "day"
                                                ? "hover:bg-gray-100"
                                                : "hover:bg-gray-800"
                                        }`}
                                        onClick={() => onSelectPreset(preset.type)}
                                    >
                                        <Icon className="w-6 h-6" />
                                        <div className="text-center">
                                            <div className="text-xs font-semibold">
                                                {preset.name}
                                            </div>
                                            <div className="text-[10px] opacity-60">
                                                {preset.difficulty}
                                            </div>
                                        </div>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent
                                    side="right"
                                    className="max-w-[250px] p-3"
                                >
                                    <div className="space-y-2">
                                        <p className="font-semibold">{preset.name}</p>
                                        <p className="text-xs opacity-80">
                                            {preset.description}
                                        </p>
                                        <p className="text-xs font-medium text-blue-400">
                                            💡 {preset.educational}
                                        </p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </div>
            </div>
        </TooltipProvider>
    );
};

export default GeometryPresets;
