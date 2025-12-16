"use client";

import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  error?: boolean;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = "", style, ...props }, ref) => {
    const baseStyle: React.CSSProperties = {
      // Reset all inherited styles
      all: "unset" as React.CSSProperties["all"],
      boxSizing: "border-box",

      // block - display: block
      display: "block",

      // Görseldeki değerler: Font: 12px Montserrat
      fontSize: "12px",
      lineHeight: "16px",

      // font-bold - font-weight: 700
      fontWeight: 700,

      // text-gray-900 - color: #111827 !important
      color: "#111827",

      // Görseldeki margin: 5px 5px 4px
      marginTop: "5px",
      marginRight: "5px",
      marginBottom: "4px",
      marginLeft: "5px",

      // font-family: Montserrat
      fontFamily:
        'Montserrat, "Monospace Fallback", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

      // cursor: pointer
      cursor: "pointer",

      // Text rendering
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
      textRendering: "optimizeLegibility",

      ...style,
    };

    return (
      <label className={className} style={baseStyle} ref={ref} {...props} />
    );
  }
);

Label.displayName = "Label";

export { Label };
