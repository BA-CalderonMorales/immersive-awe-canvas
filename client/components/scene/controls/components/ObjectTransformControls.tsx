import { Button } from "@/components/ui/button";
import { RotateCcw, Scale, Palette, Trash2 } from "lucide-react";
import { SceneObject } from "@/types/sceneObjects";

interface ObjectTransformControlsProps {
    selectedObject: SceneObject;
    onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
    onRemoveObject: (id: string) => void;
}

const ObjectTransformControls = ({
    selectedObject,
    onUpdateObject,
    onRemoveObject,
}: ObjectTransformControlsProps) => {
    const handleMoveObject = (axis: "x" | "y" | "z", direction: number) => {
        const moveAmount = 0.5 * direction;
        const newPosition: [number, number, number] = [
            ...selectedObject.position,
        ];

        switch (axis) {
            case "x":
                newPosition[0] += moveAmount;
                break;
            case "y":
                newPosition[1] += moveAmount;
                break;
            case "z":
                newPosition[2] += moveAmount;
                break;
        }

        onUpdateObject(selectedObject.id, { position: newPosition });
    };

    const handleScaleObject = (factor: number) => {
        const newScale: [number, number, number] = [
            Math.max(0.1, selectedObject.scale[0] * factor),
            Math.max(0.1, selectedObject.scale[1] * factor),
            Math.max(0.1, selectedObject.scale[2] * factor),
        ];

        onUpdateObject(selectedObject.id, { scale: newScale });
    };

    const handleResetTransform = () => {
        onUpdateObject(selectedObject.id, {
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
        });
    };

    const handleRandomizeColor = () => {
        const colors = [
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#ff00ff",
            "#00ffff",
        ];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        onUpdateObject(selectedObject.id, { color: randomColor });
    };

    return (
        <div className="space-y-3 pt-3 border-t border-cyan-500/30">
            <h4 className="text-sm font-medium text-cyan-400">
                Selected: {selectedObject.type}
            </h4>

            <div className="text-xs text-gray-300 bg-gray-900/50 p-2 rounded">
                <p>
                    Position: [
                    {selectedObject.position.map(n => n.toFixed(1)).join(", ")}]
                </p>
                <p>
                    Scale: [
                    {selectedObject.scale.map(n => n.toFixed(1)).join(", ")}]
                </p>
            </div>

            <div className="space-y-2">
                <h5 className="text-xs font-medium text-cyan-300">Movement</h5>
                <div className="grid grid-cols-3 gap-1">
                    {(["x", "y", "z"] as const).map(axis => (
                        <div key={axis} className="text-center">
                            <p className="text-xs text-gray-400 mb-1">
                                {axis.toUpperCase()}
                            </p>
                            <div className="flex gap-1">
                                <Button
                                    onClick={() => handleMoveObject(axis, -1)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 text-xs"
                                >
                                    -
                                </Button>
                                <Button
                                    onClick={() => handleMoveObject(axis, 1)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 border-cyan-500/50 hover:bg-cyan-500/10 text-cyan-400 text-xs"
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={() => handleScaleObject(1.2)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-green-500/50 hover:bg-green-500/10 text-green-400"
                >
                    <Scale className="w-3 h-3 mr-1" />+
                </Button>
                <Button
                    onClick={() => handleScaleObject(0.8)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-orange-500/50 hover:bg-orange-500/10 text-orange-400"
                >
                    <Scale className="w-3 h-3 mr-1" />-
                </Button>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={handleResetTransform}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-blue-500/50 hover:bg-blue-500/10 text-blue-400"
                >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                </Button>
                <Button
                    onClick={handleRandomizeColor}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
                >
                    <Palette className="w-3 h-3 mr-1" />
                    Color
                </Button>
                <Button
                    onClick={() => onRemoveObject(selectedObject.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 hover:bg-red-500/10 text-red-400"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
};

export default ObjectTransformControls;
