"use client";

import React, { ReactNode, forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = `
    inline-flex items-center justify-center gap-2 font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
    ${fullWidth ? "w-full" : ""}
  `;

    const variantClasses = {
      primary: `
      bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500
      shadow-sm hover:shadow-md border-0
    `,
      secondary: `
      bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500
      shadow-sm hover:shadow-md
    `,
      outline: `
      border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500
      shadow-sm hover:shadow-md
    `,
      ghost: `
      text-gray-700 hover:bg-gray-100 focus:ring-gray-500
    `,
      danger: `
      bg-red-600 text-white hover:bg-red-700 focus:ring-red-500
      shadow-sm hover:shadow-md
    `,
    };

    const sizeClasses = {
      sm: "px-4 py-2 text-sm rounded-full",
      md: "px-6 py-3 text-sm rounded-full",
      lg: "px-8 py-4 text-base rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Yükleniyor...
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
