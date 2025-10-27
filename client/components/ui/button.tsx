import { Slot } from "@radix-ui/react-slot";
import { cn } from "@utils/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current focus-visible:ring-opacity-40 disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-black/[0.9] dark:bg-white/[0.9] text-white dark:text-black hover:bg-black dark:hover:bg-white hover:scale-[1.02] active:scale-[0.98] border border-black/[0.1] dark:border-white/[0.1]",
                destructive:
                    "bg-red-500/[0.1] text-red-600 dark:text-red-400 hover:bg-red-500/[0.15] border border-red-500/[0.2] hover:scale-[1.02] active:scale-[0.98]",
                outline:
                    "border border-black/[0.06] dark:border-white/[0.08] bg-transparent hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:scale-[1.02] active:scale-[0.98]",
                secondary:
                    "bg-black/[0.04] dark:bg-white/[0.04] hover:bg-black/[0.08] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] hover:scale-[1.02] active:scale-[0.98]",
                ghost: "hover:bg-black/[0.04] dark:hover:bg-white/[0.04] hover:scale-[1.02] active:scale-[0.98]",
                link: "underline-offset-4 hover:underline",
                minimal: "bg-white/[0.08] dark:bg-white/[0.04] hover:bg-white/[0.12] dark:hover:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] hover:scale-[1.02] active:scale-[0.98]",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-11 px-6 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
