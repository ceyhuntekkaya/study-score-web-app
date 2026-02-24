import React from "react";

export type IconProps = {
    className?: string;
    size?: number | string;
};

export interface Column<T> {
    key: keyof T | 'actions';
    header: string;
    sortable?: boolean;
    render?: (value: T[keyof T], item: T) => React.ReactNode;
    actions?: Array<{
        icon?: React.ComponentType<IconProps>;
        label?: React.ReactNode;
        onClick: (item: T) => void;
        className?: string;
        /** Sadece ikon gösterir; border/padding olmadan yan yana dizilir */
        iconOnly?: boolean;
        /** İkon buton için tooltip (erişilebilirlik) */
        title?: string;
    }>;
}

// RecordType - Orval'dan gelen tiplerle uyumlu olması için esnek yapıldı
// Orval tipleri zaten object olduğu için, index signature'ı optional yapıyoruz
// Bu sayede Brand, Campus, Institution gibi Orval tipleriyle uyumlu çalışır
export type RecordType = {
    id?: string | number;
} & {
    [key: string]: any; // Index signature - Orval tipleriyle uyumlu
};
