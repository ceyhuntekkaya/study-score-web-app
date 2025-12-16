'use client';

import React from 'react';
import { cn } from "@/lib/utils";

interface SwitchProps {
    id?: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    disabled?: boolean;
    className?: string;
    label?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ id, checked, onCheckedChange, disabled = false, className = '', label }, ref) => {
        return (
            <div className="form-check form-switch">
                <input
                    className={cn("form-check-input", className)}
                    type="checkbox"
                    role="switch"
                    id={id}
                    checked={checked}
                    disabled={disabled}
                    onChange={(e) => !disabled && onCheckedChange(e.target.checked)}
                />
                {label && (
                    <label className="form-check-label" htmlFor={id}>
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Switch.displayName = 'Switch';

export { Switch };
