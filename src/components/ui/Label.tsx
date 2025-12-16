'use client';

import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {
    error?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className = "", error, ...props }, ref) => {
        return (
            <label
                className={cn(
                    "ui-label",
                    error && "error",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Label.displayName = "Label";

export { Label };
