'use client';

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ModalSize = "small" | "medium" | "large";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
    confirmText?: string | null;
    cancelText?: string | null;
    size?: ModalSize;
};

const sizeClasses: Record<ModalSize, string> = {
    small: "modal-sm",
    medium: "",
    large: "modal-xl",
};

const ModalPanel: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    onConfirm,
    onCancel,
    confirmText,
    cancelText,
    size = "small",
}) => {
    // ESC ile kapanma
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.classList.add('modal-open');
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.classList.remove('modal-open');
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-backdrop fade show" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1040, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={onClose}></div>
            <div className="modal fade show d-block" style={{ zIndex: 1050, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
                <div
                    className={cn("modal-dialog modal-dialog-centered modal-dialog-scrollable", sizeClasses[size])}
                    onClick={(e) => e.stopPropagation()}
                    style={{ zIndex: 1055, position: 'relative', maxHeight: '90vh', margin: '20px auto' }}
                >
                    <div className="modal-content" style={{ position: 'relative', zIndex: 1, maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        {title && (
                        <div className="modal-header" style={{ flexShrink: 0 }}>
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                                aria-label="Close"
                            ></button>
                        </div>
                    )}
                    <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0 }}>
                        {children}
                    </div>
                    {(confirmText || cancelText) && (
                        <div className="modal-footer" style={{ flexShrink: 0 }}>
                            {cancelText && onCancel && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={onCancel}
                                >
                                    {cancelText}
                                </button>
                            )}
                            {confirmText && onConfirm && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={onConfirm}
                                >
                                    {confirmText}
                                </button>
                            )}
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModalPanel;
