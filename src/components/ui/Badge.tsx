'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "ui-badge ui-badge-default",
        secondary: "ui-badge ui-badge-secondary",
        destructive: "ui-badge ui-badge-destructive",
        outline: "ui-badge ui-badge-outline",
        success: "ui-badge ui-badge-default", // Using default for success
        warning: "ui-badge ui-badge-default" // Using default for warning
    };

    return (
        <div className={cn(variants[variant], className)} {...props} />
    );
}

export { Badge };
