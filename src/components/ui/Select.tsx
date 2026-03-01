"use client";

import * as React from "react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
}

/** Input ile birebir aynı stil (font, yükseklik, border, gölge) - tek fark sağda ok için padding */
const getSelectBaseStyle = (
  error?: boolean,
  icon?: string,
  iconPosition?: "left" | "right"
): React.CSSProperties => ({
  all: "unset" as React.CSSProperties["all"],
  boxSizing: "border-box",
  width: "100%",
  display: "block",
  paddingTop: "8px",
  paddingBottom: "8px",
  paddingLeft: icon && iconPosition === "left" ? "40px" : "16px",
  paddingRight: "32px",
  marginTop: "8px",
  marginRight: "0",
  marginBottom: "0",
  marginLeft: "0",
  fontSize: "12px",
  lineHeight: "16px",
  fontWeight: 700,
  fontFamily: "inherit",
  color: "#092e5e",
  backgroundColor: "#FFFFFF",
  borderStyle: "solid",
  borderWidth: "0.0625rem",
  borderColor: error ? "#ef4444" : "#d1d5db",
  borderRadius: "6px",
  boxShadow: "0 2px 5px rgba(140, 152, 164, 0.2)",
  transition: "all 0.2s ease",
  outline: "none",
  outlineWidth: "0",
  outlineStyle: "none",
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale",
  textRendering: "optimizeLegibility",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  backgroundImage: "none",
  cursor: "pointer",
});

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className = "",
      error,
      style,
      icon,
      iconPosition = "left",
      children,
      ...props
    },
    ref
  ) => {
    const isMultiple = props.multiple;
    const baseStyle = getSelectBaseStyle(error, icon, iconPosition);

    const wrapperStyle: React.CSSProperties = {
      position: "relative",
      width: "100%",
      display: "block",
      minHeight: "32px",
    };

    const arrowStyle: React.CSSProperties = {
      position: "absolute",
      top: "0",
      right: "10px",
      bottom: "0",
      left: "auto",
      width: "12px",
      margin: "auto 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#9ca3af",
      pointerEvents: "none",
    };

    const selectElement = (
      <>
        <select
          className={className}
          style={{ ...baseStyle, ...style }}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {!isMultiple && (
          <span style={arrowStyle} aria-hidden>
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6l4 4 4-4" />
            </svg>
          </span>
        )}
      </>
    );

    if (icon) {
      return (
        <div style={wrapperStyle}>
          <span
            className={icon}
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "12px",
              color: "#9ca3af",
              pointerEvents: "none",
              zIndex: 1,
            }}
            aria-hidden
          />
          {selectElement}
        </div>
      );
    }

    return <div style={wrapperStyle}>{selectElement}</div>;
  }
);

Select.displayName = "Select";

export { Select };
