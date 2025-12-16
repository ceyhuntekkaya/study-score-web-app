'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
    className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({
         className = "",
         variant = "primary",
         size = "md",
         ...props
     }, ref) => {
        // Bootstrap/template button styles
        const variants = {
            primary: "rbt-btn btn-gradient radius-round",
            secondary: "rbt-btn btn-secondary radius-round",
            outline: "rbt-btn btn-border-gradient radius-round",
            ghost: "rbt-btn btn-ghost radius-round",
            destructive: "rbt-btn btn-danger radius-round"
        };

        const sizes = {
            sm: "btn-sm",
            md: "btn-md",
            lg: "btn-lg"
        };

        return (
            <button
                className={cn(
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Button.displayName = "Button";

export { Button };
