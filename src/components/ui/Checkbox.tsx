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

        const sizeStyles: Record<string, React.CSSProperties> = {
            sm: { width: '1rem', height: '1rem' },
            md: { width: '1.25rem', height: '1.25rem' },
            lg: { width: '1.5rem', height: '1.5rem' }
        };

        const variantStyles = {
            default: { borderColor: '#d1d5db', accentColor: '#2563eb' },
            success: { borderColor: '#10b981', accentColor: '#10b981' },
            warning: { borderColor: '#f59e0b', accentColor: '#f59e0b' },
            error: { borderColor: '#ef4444', accentColor: '#ef4444' }
        };

        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        React.useEffect(() => {
            if (ref && typeof ref === 'object' && ref.current) {
                ref.current.indeterminate = indeterminate;
            }
        }, [indeterminate, ref]);

        return (
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        ref={ref}
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        defaultChecked={defaultChecked}
                        disabled={disabled}
                        name={name}
                        value={value}
                        className={cn("ui-checkbox", className)}
                        style={{
                            ...sizeStyles[size],
                            border: `2px solid ${variantStyles[variant].borderColor}`,
                            borderRadius: '0.25rem',
                            backgroundColor: 'white',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            opacity: disabled ? 0.5 : 1,
                            accentColor: variantStyles[variant].accentColor,
                        }}
                        onChange={handleChange}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        aria-label={ariaLabel}
                        aria-describedby={ariaDescribedby}
                        {...props}
                    />
                </div>
                {(label || description) && (
                    <div style={{ marginLeft: '0.75rem' }}>
                        {label && (
                            <label
                                htmlFor={checkboxId}
                                style={{
                                    fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
                                    fontWeight: 500,
                                    color: '#1f2937',
                                    cursor: disabled ? 'not-allowed' : 'pointer',
                                    opacity: disabled ? 0.5 : 1,
                                }}
                            >
                                {label}
                            </label>
                        )}
                        {description && (
                            <p style={{
                                fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem',
                                color: '#6b7280',
                                marginTop: '0.25rem',
                                marginBottom: 0,
                            }}>
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
