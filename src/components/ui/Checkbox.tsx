"use client";

import * as React from "react";
import { Label } from "./Label";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
  label?: string;
  labelClassName?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className = "", error, style, label, labelClassName = "", id, ...props },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const checkboxStyle: React.CSSProperties = {
      // Reset all inherited styles
      all: "unset" as React.CSSProperties["all"],
      boxSizing: "border-box",

      // Size
      width: "18px",
      height: "18px",
      minWidth: "18px",
      minHeight: "18px",

      // Background
      backgroundColor: props.checked ? "#2563eb" : "#FFFFFF",
      border: "0.125rem solid",
      borderColor: error ? "#ef4444" : (props.checked ? "#2563eb" : "#d1d5db"),
      borderRadius: "4px",

      // Cursor
      cursor: props.disabled ? "not-allowed" : "pointer",

      // Transition
      transition: "all 0.2s ease",

      // Appearance
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",

      // Position
      position: "relative",
      display: "inline-block",
      verticalAlign: "middle",
      flexShrink: 0,

      ...style,
    };

    const checkmarkStyle: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "10px",
      height: "10px",
      opacity: props.checked ? 1 : 0,
      transition: "opacity 0.2s ease",
      pointerEvents: "none",
    };

    const wrapperStyle: React.CSSProperties = {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    };

    const checkboxElement = (
      <div style={{ position: "relative", display: "inline-block" }}>
        <input
          type="checkbox"
          id={checkboxId}
          className={className}
          style={checkboxStyle}
          ref={ref}
          {...props}
        />
        {props.checked && (
          <svg
            style={checkmarkStyle}
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    );

    if (label) {
      return (
        <div style={wrapperStyle}>
          {checkboxElement}
          <Label
            htmlFor={checkboxId}
            className={`cursor-pointer mb--0 ${labelClassName}`}
          >
            {label}
          </Label>
        </div>
      );
    }

    return checkboxElement;
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
