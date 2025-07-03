
import { ArrowLeft, ArrowRight } from "lucide-react";
import GlassButton from "./GlassButton";

interface NavigationControlsProps {
  uiColor: string;
  onChangeWorld: (direction: 'next' | 'prev') => void;
  isTransitioning: boolean;
  theme: 'day' | 'night';
}

const NavigationControls = ({ uiColor, onChangeWorld, isTransitioning, theme }: NavigationControlsProps) => {
  if (isTransitioning) return null;

  return (
    <>
      <div className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 pointer-events-auto z-10">
        <GlassButton
          icon={ArrowLeft}
          label="Previous World"
          shortcut="P"
          onClick={() => onChangeWorld('prev')}
          theme={theme}
          uiColor={uiColor}
        />
      </div>
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 pointer-events-auto z-10">
        <GlassButton
          icon={ArrowRight}
          label="Next World"
          shortcut="N"
          onClick={() => onChangeWorld('next')}
          theme={theme}
          uiColor={uiColor}
        />
      </div>
    </>
  );
};

export default NavigationControls;
