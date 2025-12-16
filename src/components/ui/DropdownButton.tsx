'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { DropdownButtonProps, DropdownItem } from '@/types/ui/dropdown';
import { Button } from './Button';
import { cn } from "@/lib/utils";

const DropdownButton: React.FC<DropdownButtonProps> = ({
    label,
    icon,
    items,
    size = 'md',
    variant = 'primary'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const itemVariants = {
        default: '',
        danger: 'text-danger',
        warning: 'text-warning'
    };

    const renderDropdownItem = (item: DropdownItem, index: number) => {
        const itemClass = cn(
            "dropdown-item",
            itemVariants[item.variant || 'default']
        );

        if (item.href) {
            return (
                <Link href={item.href} className={itemClass} key={index}>
                    {item.icon && <span className="me-2">{item.icon}</span>}
                    {item.label}
                </Link>
            );
        }

        return (
            <button
                type="button"
                className={cn("dropdown-item w-100 text-start", itemClass)}
                onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                }}
                key={index}
            >
                {item.icon && <span className="me-2">{item.icon}</span>}
                {item.label}
            </button>
        );
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <Button
                variant={variant}
                size={size}
                onClick={() => setIsOpen(!isOpen)}
                className="dropdown-toggle"
            >
                {icon && <span className="me-2">{icon}</span>}
                {label}
                <i className={cn("feather-chevron-down ms-2", isOpen && "rotate-180")}></i>
            </Button>

            {isOpen && (
                <div className="dropdown-menu show">
                    {items.map((item, index) => renderDropdownItem(item, index))}
                </div>
            )}
        </div>
    );
};

export default DropdownButton;
