'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "badge bg-primary",
        secondary: "badge bg-secondary",
        destructive: "badge bg-danger",
        outline: "badge bg-outline",
        success: "badge bg-success",
        warning: "badge bg-warning"
    };

    return (
        <div className={cn(variants[variant], className)} {...props} />
    );
}

export { Badge };
