import { cn } from "@utils/utils";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-md px-3 py-2",
                    "bg-transparent",
                    "border border-black/[0.06] dark:border-white/[0.08]",
                    "text-sm text-black/[0.9] dark:text-white/[0.9]",
                    "placeholder:text-black/[0.3] dark:placeholder:text-white/[0.3]",
                    "transition-colors duration-200",
                    "focus:outline-none focus:border-black/[0.2] dark:focus:border-white/[0.2]",
                    "focus-visible:ring-1 focus-visible:ring-current focus-visible:ring-opacity-40",
                    "disabled:cursor-not-allowed disabled:opacity-30",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
