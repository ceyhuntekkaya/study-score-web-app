'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { cn } from "@/lib/utils";

export interface DropdownAction {
    text: string;
    icon?: React.ComponentType<{ className?: string; size?: number }>;
    onClick: () => void;
}

interface ActionButtonsProps {
    onAdd?: () => void;
    addButtonText?: string;
    dropdownActions?: DropdownAction[];
}

export function ActionButtons({
    onAdd,
    addButtonText = "Yeni Ekle",
    dropdownActions = []
}: ActionButtonsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const hasDropdownActions = dropdownActions.length > 0;

    return (
        <div className="d-flex align-items-center gap-2">
            {onAdd && (
                <Button onClick={onAdd}>
                    <i className="feather-plus me-2"></i>
                    {addButtonText}
                </Button>
            )}

            {hasDropdownActions && (
                <div className="dropdown" ref={dropdownRef}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsOpen(!isOpen)}
                        className="dropdown-toggle"
                    >
                        <i className="feather-more-vertical"></i>
                    </Button>

                    {isOpen && (
                        <div className="dropdown-menu show">
                            {dropdownActions.map((action, index) => {
                                const IconComponent = action.icon;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className="dropdown-item"
                                        onClick={() => {
                                            action.onClick();
                                            setIsOpen(false);
                                        }}
                                    >
                                        {IconComponent && <IconComponent className="me-2" size={16} />}
                                        {action.text}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
