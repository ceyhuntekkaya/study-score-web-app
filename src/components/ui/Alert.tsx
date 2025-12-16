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
        default: "ui-alert ui-alert-default",
        destructive: "ui-alert ui-alert-destructive",
        success: "ui-alert ui-alert-default",
        warning: "ui-alert ui-alert-default",
        info: "ui-alert ui-alert-default"
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
        className={cn("ui-alert-title", className)}
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
        className={cn("ui-alert-description", className)}
        {...props}
    />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
