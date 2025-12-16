'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps {
    value: number;
    className?: string;
    variant?: "primary" | "success" | "warning" | "danger" | "info";
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ value, className = "", variant = "primary" }, ref) => {
        const clampedValue = Math.min(100, Math.max(0, value));

        const variantClasses = {
            primary: "bg-primary",
            success: "bg-success",
            warning: "bg-warning",
            danger: "bg-danger",
            info: "bg-info"
        };

        return (
            <div
                ref={ref}
                className={cn("progress", className)}
            >
                <div
                    className={cn("progress-bar", variantClasses[variant])}
                    role="progressbar"
                    style={{ width: `${clampedValue}%` }}
                    aria-valuenow={clampedValue}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    {clampedValue}%
                </div>
            </div>
        );
    }
);

Progress.displayName = "Progress";

export { Progress };
