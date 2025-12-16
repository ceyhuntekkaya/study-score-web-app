'use client';

import LoadingSpinner from './LoadingSpinner';
import React from "react";
import { Button, ButtonProps } from './Button';
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
    loadingText?: string;
    children: React.ReactNode;
}

export default function LoadingButton({
    isLoading = false,
    loadingText = 'Loading...',
    children,
    disabled,
    className = '',
    ...props
}: LoadingButtonProps) {
    return (
        <Button
            disabled={isLoading || disabled}
            className={cn("position-relative", className)}
            {...props}
        >
            {isLoading && (
                <span className="position-absolute start-0 ms-3">
                    <LoadingSpinner size="sm" color="white"/>
                </span>
            )}
            <span className={isLoading ? 'ms-3' : ''}>
                {isLoading ? loadingText : children}
            </span>
        </Button>
    );
}
