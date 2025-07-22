import { Button } from "@/components/ui/button";
import { Plus, Grid3x3 } from "lucide-react";
import { useSceneObjectsContext } from "@/context/SceneObjectsContext";
import { useDeviceType } from "@/hooks/use-mobile";

interface ObjectAddPanelProps {
    isAddingObject: boolean;
    onToggleAddMode: () => void;
}

const ObjectAddPanel = ({
    isAddingObject,
    onToggleAddMode,
}: ObjectAddPanelProps) => {
    const { availableGeometries, actions } = useSceneObjectsContext();
    const { isMobile, isTablet } = useDeviceType();

    // Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop
    const gridCols = isMobile
        ? "grid-cols-1"
        : isTablet
          ? "grid-cols-2"
          : "grid-cols-3";
    const buttonSize = isMobile ? "h-12" : "h-10";

    return (
        <>
            <Button
                size={isMobile ? "default" : "sm"}
                variant="outline"
                onClick={onToggleAddMode}
                className={`w-full ${buttonSize} bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 dark:bg-blue-950 dark:hover:bg-blue-900 dark:border-blue-800 dark:text-blue-300 transition-all duration-200`}
            >
                <Plus className={`${isMobile ? "w-5 h-5" : "w-4 h-4"} mr-2`} />
                Add New Object
            </Button>

            {isAddingObject && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg dark:bg-gray-900 dark:border-gray-700 space-y-3">
                    <div className="flex items-center gap-2">
                        <Grid3x3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Choose a geometry:
                        </p>
                    </div>
                    <div className={`grid ${gridCols} gap-3`}>
                        {availableGeometries.map(geometry => (
                            <Button
                                key={geometry.type}
                                size={isMobile ? "default" : "sm"}
                                variant="ghost"
                                onClick={() => {
                                    actions.addObject(geometry.type);
                                    onToggleAddMode();
                                }}
                                className={`${buttonSize} text-sm bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300 transition-all duration-200 justify-center`}
                            >
                                {geometry.name}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default ObjectAddPanel;
