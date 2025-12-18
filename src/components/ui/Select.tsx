"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type SelectValue = string | number;
export type SelectValues = SelectValue[];

interface SelectContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  onValueChange: (value: SelectValue) => void;
  value: SelectValue | SelectValues;
  multiple: boolean;
  disabled: boolean;
  searchable: boolean;
  searchQuery: string;
  onSearch: (query: string) => void;
  sortable: boolean;
  sortDirection: "asc" | "desc";
  toggleSort: () => void;
  getDisplayValue: (value: SelectValue) => React.ReactNode;
  registerOption: (value: SelectValue, label: React.ReactNode) => void;
  labelMap: Record<string, React.ReactNode>;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

interface SelectProps {
  children: ReactNode;
  onValueChange: (value: SelectValue | SelectValues) => void;
  value: SelectValue | SelectValues;
  multiple?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  sortable?: boolean;
  className?: string;
  onButtonEvent?: () => void;
  buttonText?: string;
}

interface SelectTriggerProps {
  className?: string;
  children: ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

interface SelectGroupProps {
  label?: string;
  children: ReactNode;
  className?: string;
}

interface SelectItemProps {
  value: SelectValue;
  children: ReactNode;
  className?: string;
}

const collectSelectItems = (
  children: ReactNode
): Record<string, React.ReactNode> => {
  const items: Record<string, React.ReactNode> = {};

  interface BasicProps {
    children?: ReactNode;
    [key: string]: unknown;
  }

  interface ItemProps extends BasicProps {
    value: SelectValue;
  }

  const processChild = (child: ReactNode) => {
    if (!React.isValidElement(child)) return;

    const childElement = child as React.ReactElement<BasicProps>;
    const childType = childElement.type;

    if (childType === SelectItem) {
      const props = childElement.props as ItemProps;
      items[String(props.value)] = props.children;
    } else if (childType === SelectGroup) {
      const props = childElement.props;
      if (props.children) {
        React.Children.forEach(props.children, processChild);
      }
    } else if (childElement.props && "children" in childElement.props) {
      React.Children.forEach(childElement.props.children, processChild);
    }
  };

  React.Children.forEach(children, processChild);
  return items;
};

const SelectContext = createContext<SelectContextType>({} as SelectContextType);

export const Select: React.FC<SelectProps> = ({
  children,
  onValueChange,
  value,
  multiple = false,
  disabled = false,
  searchable = true,
  sortable = true,
  className = "",
  onButtonEvent,
  buttonText = "+",
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValues, setSelectedValues] = useState<
    SelectValue | SelectValues
  >(
    multiple
      ? Array.isArray(value)
        ? value
        : []
      : value !== undefined && value !== null
        ? value
        : ""
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [optionsMap, setOptionsMap] = useState<Record<string, React.ReactNode>>(
    () => collectSelectItems(children)
  );
  const itemsRef = useRef<Record<string, React.ReactNode>>({});
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const newItems = collectSelectItems(children);
    itemsRef.current = newItems;
    setOptionsMap((prev) => {
      // Sadece değişiklik varsa güncelle
      const hasChanges = Object.keys(newItems).some(
        (key) => prev[key] !== newItems[key]
      );
      return hasChanges ? { ...prev, ...newItems } : prev;
    });
  }, [children]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(
        multiple
          ? Array.isArray(value)
            ? value
            : []
          : value !== null
            ? value
            : ""
      );
    }
  }, [value, multiple]);

  const handleValueChange = useCallback(
    (newValue: SelectValue) => {
      if (multiple) {
        const currentValues = selectedValues as SelectValues;
        const updatedValues = currentValues.includes(newValue)
          ? currentValues.filter((v) => v !== newValue)
          : [...currentValues, newValue];
        setSelectedValues(updatedValues);
        onValueChange(updatedValues);
      } else {
        setSelectedValues(newValue);
        onValueChange(newValue);
        setOpen(false);
      }
    },
    [multiple, selectedValues, onValueChange]
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const toggleSort = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  }, []);

  const registerOption = useCallback(
    (value: SelectValue, label: React.ReactNode) => {
      setOptionsMap((prev) => ({
        ...prev,
        [String(value)]: label,
      }));
    },
    []
  );

  const getDisplayValue = useCallback(
    (value: SelectValue): React.ReactNode => {
      return optionsMap[String(value)] || String(value);
    },
    [optionsMap]
  );

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onButtonEvent?.();
    },
    [onButtonEvent]
  );

  const addButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "38px",
    height: "auto",
    padding: "8px 12px",
    marginTop: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#092e5e",
    backgroundColor: "#FFFFFF",
    border: "0.0625rem solid #d1d5db",
    borderRadius: "6px",
    boxShadow: "0 2px 5px rgba(140, 152, 164, 0.2)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
  };

  return (
    <SelectContext.Provider
      value={{
        open,
        setOpen,
        onValueChange: handleValueChange,
        value: selectedValues,
        multiple,
        disabled,
        searchable,
        searchQuery,
        onSearch: handleSearch,
        sortable,
        sortDirection,
        toggleSort,
        getDisplayValue,
        registerOption,
        labelMap: optionsMap,
        triggerRef,
      }}
    >
      <div
        className={cn("", className)}
        style={{
          position: "relative",
          display: onButtonEvent ? "flex" : "block",
          gap: onButtonEvent ? "8px" : undefined,
        }}
      >
        <div
          style={{ flex: onButtonEvent ? 1 : undefined, position: "relative" }}
        >
          {children}
        </div>
        {onButtonEvent && (
          <button
            type="button"
            onClick={handleButtonClick}
            style={addButtonStyle}
            disabled={disabled}
          >
            {buttonText}
          </button>
        )}
      </div>
    </SelectContext.Provider>
  );
};

const selectTriggerStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  paddingTop: "8px",
  paddingBottom: "8px",
  paddingLeft: "16px",
  paddingRight: "16px",
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
  border: "0.0625rem solid",
  borderStyle: "solid",
  borderWidth: "0.0625rem",
  borderColor: "#d1d5db",
  borderRadius: "6px",
  boxShadow: "0 2px 5px rgba(140, 152, 164, 0.2)",
  transition: "all 0.2s ease",
  outline: "none",
  cursor: "pointer",
  WebkitFontSmoothing: "antialiased",
  textRendering: "optimizeLegibility",
  appearance: "none",
};

const selectTriggerDisabledStyle: React.CSSProperties = {
  ...selectTriggerStyle,
  backgroundColor: "#f3f4f6",
  color: "#9ca3af",
  cursor: "not-allowed",
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  className = "",
  children,
}) => {
  const { open, setOpen, disabled, triggerRef } = useContext(SelectContext);

  return (
    <button
      ref={triggerRef}
      type="button"
      className={cn("", className)}
      style={disabled ? selectTriggerDisabledStyle : selectTriggerStyle}
      onClick={() => !disabled && setOpen(!open)}
      disabled={disabled}
    >
      {children}
      <i
        className="feather-chevron-down"
        style={{
          marginLeft: "8px",
          transition: "transform 0.2s ease",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
        }}
      ></i>
    </button>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder = "Seçiniz...",
}) => {
  const { value, multiple, getDisplayValue, labelMap } =
    useContext(SelectContext);

  if (!value || (Array.isArray(value) && value.length === 0) || value === "") {
    return <span className="text-muted">{placeholder}</span>;
  }

  if (multiple) {
    return <span>{(value as SelectValues).length} öğe seçildi</span>;
  }

  const itemValue = value as SelectValue;
  const display = labelMap[String(itemValue)] || getDisplayValue(itemValue);

  return <span>{display}</span>;
};

const selectContentStyle: React.CSSProperties = {
  position: "absolute",
  top: "100%",
  left: 0,
  right: 0,
  zIndex: 99999,
  width: "100%",
  maxHeight: "240px",
  overflowY: "auto",
  marginTop: "4px",
  backgroundColor: "#FFFFFF",
  border: "0.0625rem solid #d1d5db",
  borderRadius: "6px",
  boxShadow:
    "0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(140, 152, 164, 0.25)",
  padding: "4px 0",
};

const selectSearchInputStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  flex: 1,
  paddingTop: "6px",
  paddingBottom: "6px",
  paddingLeft: "12px",
  paddingRight: "12px",
  fontSize: "12px",
  fontWeight: 500,
  fontFamily: "inherit",
  color: "#092e5e",
  backgroundColor: "#f9fafb",
  border: "0.0625rem solid #e5e7eb",
  borderRadius: "4px",
  outline: "none",
  transition: "all 0.2s ease",
};

const selectSortButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "6px 10px",
  fontSize: "12px",
  color: "#092e5e",
  backgroundColor: "#f9fafb",
  border: "0.0625rem solid #e5e7eb",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className = "",
}) => {
  const {
    open,
    setOpen,
    searchable,
    onSearch,
    sortable,
    sortDirection,
    toggleSort,
    triggerRef,
  } = useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        // Use getBoundingClientRect which gives viewport-relative position
        // For fixed positioning, we don't need to add scroll offsets
        setPosition({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      };
      
      updatePosition();
      // Update on scroll/resize
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [open, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        ref.current &&
        !ref.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen, triggerRef]);

  if (!open || !mounted) return null;

  const dropdownContent = (
    <div
      ref={ref}
      className={cn("", className)}
      style={{
        ...selectContentStyle,
        position: "fixed",
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        zIndex: 99999,
      }}
    >
      {(searchable || sortable) && (
        <div
          style={{
            padding: "8px 12px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            gap: "8px",
          }}
        >
          {searchable && (
            <input
              type="text"
              style={selectSearchInputStyle}
              placeholder="Ara..."
              onChange={(e) => onSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          {sortable && (
            <button
              type="button"
              style={selectSortButtonStyle}
              onClick={(e) => {
                e.stopPropagation();
                toggleSort();
              }}
            >
              <i
                className="feather-arrow-up-down"
                style={{
                  transition: "transform 0.2s ease",
                  transform:
                    sortDirection === "desc"
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                }}
              ></i>
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );

  return createPortal(dropdownContent, document.body);
};

export const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  children,
  className = "",
}) => {
  const { searchQuery, sortDirection } = useContext(SelectContext);

  interface SelectItemElement extends React.ReactElement {
    props: {
      children: ReactNode;
      value: SelectValue;
    };
  }

  const filteredAndSortedChildren = React.Children.toArray(children)
    .filter((child): child is SelectItemElement => {
      if (!searchQuery) return true;
      if (React.isValidElement(child)) {
        const item = child as SelectItemElement;
        const childText = item.props.children?.toString().toLowerCase() || "";
        return childText.includes(searchQuery.toLowerCase());
      }
      return false;
    })
    .sort((a, b) => {
      const itemA = a as SelectItemElement;
      const itemB = b as SelectItemElement;
      const textA = itemA.props.children?.toString() || "";
      const textB = itemB.props.children?.toString() || "";
      return sortDirection === "asc"
        ? textA.localeCompare(textB)
        : textB.localeCompare(textA);
    });

  if (filteredAndSortedChildren.length === 0) return null;

  return (
    <div className={cn("", className)}>
      {label && <h6 className="dropdown-header">{label}</h6>}
      {filteredAndSortedChildren}
    </div>
  );
};

const selectItemBaseStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 16px",
  fontSize: "12px",
  fontWeight: 500,
  fontFamily: "inherit",
  color: "#092e5e",
  backgroundColor: "transparent",
  border: "none",
  cursor: "pointer",
  textAlign: "left" as const,
  transition: "all 0.15s ease",
};

const selectItemSelectedStyle: React.CSSProperties = {
  ...selectItemBaseStyle,
  backgroundColor: "#e0f2fe",
  color: "#0369a1",
  fontWeight: 600,
};

export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  className = "",
}) => {
  const {
    onValueChange,
    value: selectedValue,
    multiple,
    registerOption,
  } = useContext(SelectContext);
  const isSelected = multiple
    ? (selectedValue as SelectValues).includes(value)
    : selectedValue === value;
  const [isHovered, setIsHovered] = React.useState(false);

  useEffect(() => {
    registerOption(value, children);
  }, [value, children, registerOption]);

  const itemStyle: React.CSSProperties = {
    ...(isSelected ? selectItemSelectedStyle : selectItemBaseStyle),
    backgroundColor:
      isHovered && !isSelected
        ? "#f3f4f6"
        : isSelected
          ? "#e0f2fe"
          : "transparent",
  };

  return (
    <button
      type="button"
      className={cn("", className)}
      style={itemStyle}
      onClick={() => onValueChange(value)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{children}</span>
      {isSelected && (
        <i
          className="feather-check"
          style={{
            fontSize: "14px",
            color: "#0369a1",
          }}
        ></i>
      )}
    </button>
  );
};
