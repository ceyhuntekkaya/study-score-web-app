import React from 'react';

export interface DropdownItem {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: 'default' | 'danger' | 'warning';
}

export interface DropdownButtonProps {
    label: string;
    icon?: React.ReactNode;
    items: DropdownItem[];
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
}
