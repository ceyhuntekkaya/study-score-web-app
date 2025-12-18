"use client";

import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "", error, style, icon, iconPosition = "left", ...props },
    ref
  ) => {
    const baseStyle: React.CSSProperties = {
      // Reset all inherited styles
      all: "unset" as React.CSSProperties["all"],
      boxSizing: "border-box",

      // w-full - width: 100%
      width: "100%",
      display: "block",

      // Görseldeki padding: 8px 16px
      paddingTop: "8px",
      paddingBottom: "8px",
      paddingLeft: icon && iconPosition === "left" ? "40px" : "16px",
      paddingRight: icon && iconPosition === "right" ? "40px" : "16px",

      // Görseldeki margin: 8px 0px 0px
      marginTop: "8px",
      marginRight: "0",
      marginBottom: "0",
      marginLeft: "0",

      // text-xs - font-size: 12px
      fontSize: "12px",
      lineHeight: "16px",

      // font-bold - font-weight: 700
      fontWeight: 700,

      // font-family: inherit
      fontFamily: "inherit",

      // color: #092e5e (input text color)
      color: "#092e5e",

      // Background: #FFFFFF
      backgroundColor: "#FFFFFF",

      // border: .0625rem solid #e5e7eb (1px solid #e5e7eb)
      // border-gray-300 - border-color: #d1d5db
      border: "0.0625rem solid",
      borderStyle: "solid",
      borderWidth: "0.0625rem",
      borderColor: error ? "#ef4444" : "#d1d5db", // border-gray-300: #d1d5db, error: red

      // rounded-md - border-radius: 6px
      borderRadius: "6px",

      // shadow-sm: box-shadow: 0 2px 5px rgba(140, 152, 164, .2)
      boxShadow: "0 2px 5px rgba(140, 152, 164, 0.2)",

      // Transition - all .2s ease
      transition: "all 0.2s ease",

      // focus:outline-none
      outline: "none",
      outlineWidth: "0",
      outlineStyle: "none",

      // Text rendering
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textRendering: "optimizeLegibility",

      // Appearance
      appearance: "none",
      WebkitAppearance: "none",
      MozAppearance: "none",

      ...style,
    };

    const wrapperStyle: React.CSSProperties = {
      position: "relative",
      width: "100%",
      display: "block",
    };

    const iconStyle: React.CSSProperties = {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
      pointerEvents: "none",
      ...(iconPosition === "left" ? { left: "12px" } : { right: "12px" }),
    };

    if (icon) {
      return (
        <div style={wrapperStyle}>
          <i className={icon} style={iconStyle}></i>
          <input className={className} style={baseStyle} ref={ref} {...props} />
        </div>
      );
    }

    return (
      <input className={className} style={baseStyle} ref={ref} {...props} />
    );
  }
);

Input.displayName = "Input";

export { Input };
