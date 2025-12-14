"use client";

import React, { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
}) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (closeOnEsc && event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-gray-900/30 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`
          relative bg-white rounded-3xl shadow-xl max-h-[90vh] overflow-y-auto
          transform transition-all duration-300 scale-100
          ${sizeClasses[size]} w-full
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            <div className="flex-1"></div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-auto text-gray-400 hover:text-gray-600 transition-colors duration-200 flex-shrink-0 cursor-pointer"
                aria-label="Kapat"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
