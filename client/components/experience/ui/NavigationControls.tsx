import { ArrowLeft, ArrowRight } from "lucide-react";
import GlassButton from "./GlassButton";

interface NavigationControlsProps {
    uiColor: string;
    onChangeBackground: (direction: "next" | "prev") => void;
    isTransitioning: boolean;
    theme: "day" | "night";
    backgroundName?: string;
}

const NavigationControls = ({
    uiColor,
    onChangeBackground,
    isTransitioning,
    theme,
    backgroundName,
}: NavigationControlsProps) => {
    if (isTransitioning) return null;

    return (
        <>
            <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 pointer-events-auto z-10">
                <GlassButton
                    icon={ArrowLeft}
                    label="Previous Background"
                    shortcut="P"
                    onClick={() => onChangeBackground("prev")}
                    theme={theme}
                    uiColor={uiColor}
                />
            </div>
            <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 pointer-events-auto z-10">
                <GlassButton
                    icon={ArrowRight}
                    label="Next Background"
                    shortcut="N"
                    onClick={() => onChangeBackground("next")}
                    theme={theme}
                    uiColor={uiColor}
                />
            </div>
        </>
    );
};

export default NavigationControls;
