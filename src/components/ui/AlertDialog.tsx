'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface AlertDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

interface AlertDialogContentProps {
    className?: string;
    children: React.ReactNode;
}

interface AlertDialogHeaderProps {
    className?: string;
    children: React.ReactNode;
}

interface AlertDialogFooterProps {
    className?: string;
    children: React.ReactNode;
}

interface AlertDialogTitleProps {
    className?: string;
    children: React.ReactNode;
}

interface AlertDialogDescriptionProps {
    className?: string;
    children: React.ReactNode;
}

interface AlertDialogActionProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

interface AlertDialogCancelProps {
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
}

const AlertDialogContext = React.createContext<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
}>({
    open: false,
    onOpenChange: () => {}
});

const AlertDialog: React.FC<AlertDialogProps> = ({
    open = false,
    onOpenChange = () => {},
    children
}) => {
    return (
        <AlertDialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </AlertDialogContext.Provider>
    );
};

const AlertDialogTrigger: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { onOpenChange } = React.useContext(AlertDialogContext);

    return (
        <div onClick={() => onOpenChange(true)}>
            {children}
        </div>
    );
};

const AlertDialogContent: React.FC<AlertDialogContentProps> = ({
    className,
    children
}) => {
    const { open, onOpenChange } = React.useContext(AlertDialogContext);

    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange(false);
            }
        };

        if (open) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="modal fade show d-block" style={{ zIndex: 1050 }}>
            <div className="modal-backdrop fade show" onClick={() => onOpenChange(false)}></div>
            <div
                className={cn("modal-dialog modal-dialog-centered", className)}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AlertDialogHeader: React.FC<AlertDialogHeaderProps> = ({
    className,
    children
}) => (
    <div className={cn("modal-header", className)}>
        {children}
    </div>
);

const AlertDialogFooter: React.FC<AlertDialogFooterProps> = ({
    className,
    children
}) => (
    <div className={cn("modal-footer", className)}>
        {children}
    </div>
);

const AlertDialogTitle: React.FC<AlertDialogTitleProps> = ({
    className,
    children
}) => (
    <h5 className={cn("modal-title", className)}>
        {children}
    </h5>
);

const AlertDialogDescription: React.FC<AlertDialogDescriptionProps> = ({
    className,
    children
}) => (
    <div className={cn("modal-body", className)}>
        {children}
    </div>
);

const AlertDialogAction: React.FC<AlertDialogActionProps> = ({
    className,
    children,
    onClick,
    disabled = false
}) => {
    const { onOpenChange } = React.useContext(AlertDialogContext);

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        onOpenChange(false);
    };

    return (
        <Button
            onClick={handleClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </Button>
    );
};

const AlertDialogCancel: React.FC<AlertDialogCancelProps> = ({
    className,
    children,
    onClick,
    disabled = false
}) => {
    const { onOpenChange } = React.useContext(AlertDialogContext);

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        onOpenChange(false);
    };

    return (
        <Button
            variant="outline"
            onClick={handleClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </Button>
    );
};

export {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
};
