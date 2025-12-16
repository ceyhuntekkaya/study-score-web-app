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
            primary: "bg-blue-500",
            success: "bg-green-500",
            warning: "bg-yellow-500",
            danger: "bg-red-500",
            info: "bg-cyan-500"
        };

        return (
            <div
                ref={ref}
                className={cn("ui-progress", className)}
            >
                <div
                    className="ui-progress-bar"
                    role="progressbar"
                    style={{ 
                        width: `${clampedValue}%`,
                        backgroundColor: variant === 'primary' ? '#3b82f6' : 
                                        variant === 'success' ? '#10b981' :
                                        variant === 'warning' ? '#f59e0b' :
                                        variant === 'danger' ? '#ef4444' :
                                        '#06b6d4'
                    }}
                    aria-valuenow={clampedValue}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        );
    }
);

Progress.displayName = "Progress";

export { Progress };
