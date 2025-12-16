'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "destructive" | "success" | "warning" | "info";
}

const Alert = React.forwardRef<
    HTMLDivElement,
    AlertProps
>(({ className, variant = "default", ...props }, ref) => {
    const variants = {
        default: "alert",
        destructive: "alert alert-danger",
        success: "alert alert-success",
        warning: "alert alert-warning",
        info: "alert alert-info"
    };

    return (
        <div
            ref={ref}
            role="alert"
            className={cn(variants[variant], className)}
            {...props}
        />
    );
})
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn("alert-heading", className)}
        {...props}
    />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("alert-description", className)}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
