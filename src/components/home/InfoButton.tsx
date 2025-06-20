
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface InfoButtonProps {
  theme: 'day' | 'night';
  blendedButtonClasses: string;
}

const InfoButton = ({ theme, blendedButtonClasses }: InfoButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center opacity-70 hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={`${
              isMobile 
                ? 'w-12 h-12 p-0 rounded-full' // Larger touch target on mobile
                : 'w-8 h-8 p-0 rounded-md' // Smaller on desktop
            } ${blendedButtonClasses} transition-all duration-300 ${
              theme === 'day' ? 'text-emerald-600 hover:text-emerald-800' : 'text-blue-300 hover:text-blue-100'
            } ${isMobile ? 'cursor-pointer active:scale-95' : 'cursor-pointer hover:bg-white/10'}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isMobile) {
                // On desktop, clicking shows the tooltip longer or could trigger other actions
                // For now, we'll just prevent the click from bubbling up
              }
            }}
            aria-label="Information"
          >
            <Info className={`${isMobile ? 'w-6 h-6' : 'w-4 h-4'}`} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm space-y-1">
            <p>Click anywhere or press Enter to begin your journey</p>
            <p>Press Space to toggle between day and night themes</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default InfoButton;
