'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from 'react';
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
    sortDirection: 'asc' | 'desc';
    toggleSort: () => void;
    getDisplayValue: (value: SelectValue) => React.ReactNode;
    registerOption: (value: SelectValue, label: React.ReactNode) => void;
    labelMap: Record<string, React.ReactNode>;
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

const collectSelectItems = (children: ReactNode): Record<string, React.ReactNode> => {
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
        }
        else if (childType === SelectGroup) {
            const props = childElement.props;
            if (props.children) {
                React.Children.forEach(props.children, processChild);
            }
        }
        else if (childElement.props && 'children' in childElement.props) {
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
    className = '',
    onButtonEvent,
    buttonText = '+',
}) => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedValues, setSelectedValues] = useState<SelectValue | SelectValues>(
        multiple ? (Array.isArray(value) ? value : []) : (value !== undefined && value !== null ? value : '')
    );
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [optionsMap, setOptionsMap] = useState<Record<string, React.ReactNode>>({});
    const itemsRef = useRef<Record<string, React.ReactNode>>({});

    useEffect(() => {
        itemsRef.current = collectSelectItems(children);
        setOptionsMap(itemsRef.current);
    }, [children]);

    useEffect(() => {
        if (value !== undefined) {
            setSelectedValues(
                multiple ? (Array.isArray(value) ? value : []) : (value !== null ? value : '')
            );
        }
    }, [value, multiple]);

    const handleValueChange = useCallback((newValue: SelectValue) => {
        if (multiple) {
            const currentValues = selectedValues as SelectValues;
            const updatedValues = currentValues.includes(newValue)
                ? currentValues.filter(v => v !== newValue)
                : [...currentValues, newValue];
            setSelectedValues(updatedValues);
            onValueChange(updatedValues);
        } else {
            setSelectedValues(newValue);
            onValueChange(newValue);
            setOpen(false);
        }
    }, [multiple, selectedValues, onValueChange]);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const toggleSort = useCallback(() => {
        setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    }, []);

    const registerOption = useCallback((value: SelectValue, label: React.ReactNode) => {
        setOptionsMap(prev => ({
            ...prev,
            [String(value)]: label
        }));
    }, []);

    const getDisplayValue = useCallback((value: SelectValue): React.ReactNode => {
        return optionsMap[String(value)] || String(value);
    }, [optionsMap]);

    const handleButtonClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onButtonEvent?.();
    }, [onButtonEvent]);

    return (
        <SelectContext.Provider value={{
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
            labelMap: optionsMap
        }}>
            <div className={cn("dropdown", onButtonEvent && "d-flex gap-2", className)}>
                <div className={cn(onButtonEvent && "flex-fill")}>
                    {children}
                </div>
                {onButtonEvent && (
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="btn btn-outline-secondary"
                        style={{ minWidth: '38px' }}
                        disabled={disabled}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </SelectContext.Provider>
    );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ className = '', children }) => {
    const { open, setOpen, disabled } = useContext(SelectContext);

    return (
        <button
            type="button"
            className={cn("btn btn-outline-secondary dropdown-toggle w-100 d-flex justify-content-between align-items-center", className)}
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
        >
            {children}
            <i className={cn("feather-chevron-down ms-2", open && "rotate-180")}></i>
        </button>
    );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder = 'Seçiniz...' }) => {
    const { value, multiple, getDisplayValue, labelMap } = useContext(SelectContext);

    if (!value || (Array.isArray(value) && value.length === 0) || value === '') {
        return <span className="text-muted">{placeholder}</span>;
    }

    if (multiple) {
        return <span>{(value as SelectValues).length} öğe seçildi</span>;
    }

    const itemValue = value as SelectValue;
    const display = labelMap[String(itemValue)] || getDisplayValue(itemValue);

    return <span>{display}</span>;
};

export const SelectContent: React.FC<SelectContentProps> = ({ children, className = '' }) => {
    const {
        open,
        setOpen,
        searchable,
        onSearch,
        sortable,
        sortDirection,
        toggleSort
    } = useContext(SelectContext);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setOpen]);

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={cn("dropdown-menu show w-100", className)}
            style={{ maxHeight: '240px', overflowY: 'auto' }}
        >
            {(searchable || sortable) && (
                <div className="p-2 border-bottom d-flex gap-2">
                    {searchable && (
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Ara..."
                            onChange={(e) => onSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    )}
                    {sortable && (
                        <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleSort();
                            }}
                        >
                            <i className={cn("feather-arrow-up-down", sortDirection === 'desc' && "rotate-180")}></i>
                        </button>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export const SelectGroup: React.FC<SelectGroupProps> = ({ label, children, className = '' }) => {
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
                const childText = item.props.children?.toString().toLowerCase() || '';
                return childText.includes(searchQuery.toLowerCase());
            }
            return false;
        })
        .sort((a, b) => {
            const itemA = a as SelectItemElement;
            const itemB = b as SelectItemElement;
            const textA = itemA.props.children?.toString() || '';
            const textB = itemB.props.children?.toString() || '';
            return sortDirection === 'asc'
                ? textA.localeCompare(textB)
                : textB.localeCompare(textA);
        });

    if (filteredAndSortedChildren.length === 0) return null;

    return (
        <div className={cn("", className)}>
            {label && (
                <h6 className="dropdown-header">{label}</h6>
            )}
            {filteredAndSortedChildren}
        </div>
    );
};

export const SelectItem: React.FC<SelectItemProps> = ({ value, children, className = '' }) => {
    const { onValueChange, value: selectedValue, multiple, registerOption } = useContext(SelectContext);
    const isSelected = multiple
        ? (selectedValue as SelectValues).includes(value)
        : selectedValue === value;

    useEffect(() => {
        registerOption(value, children);
    }, [value, children, registerOption]);

    return (
        <button
            type="button"
            className={cn(
                "dropdown-item",
                isSelected && "active",
                className
            )}
            onClick={() => onValueChange(value)}
        >
            <span className="me-2">{children}</span>
            {isSelected && <i className="feather-check float-end"></i>}
        </button>
    );
};
