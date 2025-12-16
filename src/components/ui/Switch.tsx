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
            <div className="d-flex align-items-center gap-2">
                <button
                    type="button"
                    role="switch"
                    id={id}
                    ref={ref}
                    aria-checked={checked}
                    disabled={disabled}
                    onClick={() => !disabled && onCheckedChange(!checked)}
                    className={cn(
                        "ui-switch",
                        disabled && "disabled",
                        className
                    )}
                >
                    <span
                        aria-hidden="true"
                        className="ui-switch-thumb"
                    />
                    <span className="visually-hidden">
                        {checked ? 'Açık' : 'Kapalı'}
                    </span>
                </button>
                {label && (
                    <label htmlFor={id} className="mb-0">
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Switch.displayName = 'Switch';

export { Switch };
