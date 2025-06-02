"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "info" | "warning";
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onCancel]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onCancel();
      }
    },
    [onCancel]
  );

  const getButtonStyles = useCallback(() => {
    switch (variant) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 focus:ring-red-300";
      case "warning":
        return "bg-amber-500 hover:bg-amber-600 focus:ring-amber-300";
      case "info":
        return "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300";
      default:
        return "bg-primary hover:bg-primary/90 focus:ring-primary/30";
    }
  }, [variant]);

  const modalContent = isOpen ? (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-all"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
      data-testid="confirm-modal"
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-xl transform transition-all duration-300 ease-in-out overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>

          {/* Content */}
          <div className="py-2">
            <p className="text-gray-700">{message}</p>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              aria-label={cancelButtonText}
              tabIndex={0}
            >
              {cancelButtonText}
            </button>
            <button
              type="button"
              className={`btn text-white ${getButtonStyles()}`}
              onClick={onConfirm}
              aria-label={confirmButtonText}
              tabIndex={0}
            >
              {confirmButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};

export default ConfirmModal; 