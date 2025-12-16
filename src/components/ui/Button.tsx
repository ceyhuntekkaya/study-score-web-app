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
        // Tailwind CSS design matching styles
        const variants = {
            primary: "ui-button ui-button-primary",
            secondary: "ui-button ui-button-secondary",
            outline: "ui-button ui-button-outline",
            ghost: "ui-button ui-button-ghost",
            destructive: "ui-button ui-button-destructive"
        };

        const sizes = {
            sm: "ui-button-sm",
            md: "ui-button-md",
            lg: "ui-button-lg"
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
