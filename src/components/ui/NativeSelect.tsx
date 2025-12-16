"use client";

import React from "react";

interface NativeSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className = "", error, style, children, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      // Reset all inherited styles
      all: "unset" as React.CSSProperties["all"],
      boxSizing: "border-box",

      // w-full - width: 100%
      width: "100%",
      display: "block",

      // Padding: 8px 16px
      paddingTop: "8px",
      paddingBottom: "8px",
      paddingLeft: "16px",
      paddingRight: "40px", // Extra space for dropdown arrow

      // Margin: 8px 0px 0px
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

      // color: #092e5e
      color: "#092e5e",

      // Background: #FFFFFF with dropdown arrow
      backgroundColor: "#FFFFFF",
      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      backgroundSize: "16px 12px",

      // border: .0625rem solid
      border: "0.0625rem solid",
      borderStyle: "solid",
      borderWidth: "0.0625rem",
      borderColor: error ? "#ef4444" : "#d1d5db",

      // rounded-md - border-radius: 6px
      borderRadius: "6px",

      // shadow-sm
      boxShadow: "0 2px 5px rgba(140, 152, 164, 0.2)",

      // Transition
      transition: "all 0.2s ease",

      // outline-none
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

      // cursor
      cursor: "pointer",

      ...style,
    };

    return (
      <select className={className} style={baseStyle} ref={ref} {...props}>
        {children}
      </select>
    );
  }
);

NativeSelect.displayName = "NativeSelect";

export { NativeSelect };
