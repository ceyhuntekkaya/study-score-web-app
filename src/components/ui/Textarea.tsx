'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className = '', error, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "ui-textarea",
                    error && "error",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';

export { Textarea };
