
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

interface InstructionSet {
  primary: string;
  secondary: string;
  tertiary: string;
  welcome?: string;
}

interface InfoTooltipProps {
  uiStyle: { color: string };
  blendedButtonClasses: string;
  showOnboardingPulse: boolean;
  isInfoTooltipOpen: boolean;
  setIsInfoTooltipOpen: (open: boolean) => void;
  setShowOnboardingPulse: (show: boolean) => void;
  isMobile: boolean;
  instructions: InstructionSet;
  theme: 'day' | 'night';
}

const InfoTooltip = ({
  uiStyle,
  blendedButtonClasses,
  showOnboardingPulse,
  isInfoTooltipOpen,
  setIsInfoTooltipOpen,
  setShowOnboardingPulse,
  isMobile,
  instructions,
  theme,
}: InfoTooltipProps) => {
  const handleInfoClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (setShowOnboardingPulse) {
      setShowOnboardingPulse(false);
    }
    
    if (isMobile && setIsInfoTooltipOpen) {
      setIsInfoTooltipOpen(!isInfoTooltipOpen);
    }
  }, [isMobile, isInfoTooltipOpen, setIsInfoTooltipOpen, setShowOnboardingPulse]);

  return (
    <Tooltip open={isMobile ? isInfoTooltipOpen : undefined}>
      <TooltipTrigger asChild>
        <Button
          style={uiStyle}
          onClick={handleInfoClick}
          className={`${blendedButtonClasses} transition-all duration-300 ${
            showOnboardingPulse ? 'animate-pulse ring-2 ring-blue-400/50' : ''
          } flex-shrink-0`}
          size="icon"
          aria-label="Information and Controls"
        >
          <Info className="w-4 h-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent 
        side="bottom" 
        className={`max-w-xs p-4 rounded-lg shadow-2xl border-0 ${
          theme === 'day' 
            ? 'bg-white/95 text-gray-800 backdrop-blur-md' 
            : 'bg-gray-900/95 text-gray-100 backdrop-blur-md'
        }`}
        sideOffset={8}
      >
        <div className="space-y-3">
          {instructions.welcome && (
            <div className="flex items-start gap-2 pb-2 border-b border-gray-200/20">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                theme === 'day' ? 'bg-blue-500' : 'bg-blue-400'
              }`} />
              <p className="text-sm font-semibold leading-relaxed">
                {instructions.welcome}
              </p>
            </div>
          )}
          
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              theme === 'day' ? 'bg-emerald-500' : 'bg-blue-400'
            }`} />
            <p className="text-sm font-medium leading-relaxed">
              {instructions.primary}
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              theme === 'day' ? 'bg-emerald-500' : 'bg-blue-400'
            }`} />
            <p className="text-sm leading-relaxed opacity-90">
              {instructions.secondary}
            </p>
          </div>
          
          <div className="flex items-start gap-2">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              theme === 'day' ? 'bg-emerald-500' : 'bg-blue-400'
            }`} />
            <p className="text-sm leading-relaxed opacity-90">
              {instructions.tertiary}
            </p>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default InfoTooltip;
