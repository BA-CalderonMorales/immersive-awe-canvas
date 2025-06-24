
import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cn } from "@/lib/utils"

interface EnhancedSliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  onValueChange?: (value: number[]) => void;
  step?: number;
  min?: number;
  max?: number;
  value?: number[];
}

const EnhancedSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  EnhancedSliderProps
>(({ className, onValueChange, step = 0.01, min = 0, max = 1, value, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(value || [0.5]);
  
  // Enhanced touch/mouse handling for better mobile experience
  const handleValueChange = React.useCallback((newValue: number[]) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  }, [onValueChange]);

  React.useEffect(() => {
    if (value) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center py-2",
        className
      )}
      value={internalValue}
      onValueChange={handleValueChange}
      step={step}
      min={min}
      max={max}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-muted/20 backdrop-blur-sm">
        <SliderPrimitive.Range className="absolute h-full bg-primary/80 rounded-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-primary/80 bg-background/90 backdrop-blur-sm shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 active:scale-95" />
    </SliderPrimitive.Root>
  )
})
EnhancedSlider.displayName = "EnhancedSlider"

export { EnhancedSlider }
