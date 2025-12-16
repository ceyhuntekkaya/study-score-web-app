'use client';

import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils";

export interface CheckboxProps {
    id?: string;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    label?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'error';
    className?: string;
    onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    'aria-label'?: string;
    'aria-describedby'?: string;
    name?: string;
    value?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({
         id,
         checked,
         defaultChecked,
         disabled = false,
         indeterminate = false,
         label,
         description,
         size = 'md',
         variant = 'default',
         className = '',
         onChange,
         onFocus,
         onBlur,
         'aria-label': ariaLabel,
         'aria-describedby': ariaDescribedby,
         name,
         value,
         ...props
     }, ref) => {
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
                onChange(event.target.checked, event);
            }
        };

        const sizeClasses = {
            sm: 'form-check-input-sm',
            md: '',
            lg: 'form-check-input-lg'
        };

        const variantClasses = {
            default: '',
            success: 'is-valid',
            warning: 'is-warning',
            error: 'is-invalid'
        };

        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        React.useEffect(() => {
            if (ref && typeof ref === 'object' && ref.current) {
                ref.current.indeterminate = indeterminate;
            }
        }, [indeterminate, ref]);

        return (
            <div className="form-check">
                <input
                    ref={ref}
                    id={checkboxId}
                    type="checkbox"
                    checked={checked}
                    defaultChecked={defaultChecked}
                    disabled={disabled}
                    name={name}
                    value={value}
                    className={cn(
                        "form-check-input",
                        sizeClasses[size],
                        variantClasses[variant],
                        className
                    )}
                    onChange={handleChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    aria-label={ariaLabel}
                    aria-describedby={ariaDescribedby}
                    {...props}
                />
                {(label || description) && (
                    <div className="form-check-label-wrapper">
                        {label && (
                            <label
                                htmlFor={checkboxId}
                                className="form-check-label"
                            >
                                {label}
                            </label>
                        )}
                        {description && (
                            <p className="form-text text-muted">
                                {description}
                            </p>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
