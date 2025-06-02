"use client";

import { useState, useCallback } from "react";
import ConfirmModal from "@/components/ConfirmModal";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  variant?: "danger" | "info" | "warning";
}

type ConfirmResult = Promise<boolean>;

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "Confirm",
    message: "",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    variant: "danger",
  });
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(
    null
  );

  const confirm = useCallback(
    (confirmOptions: ConfirmOptions): ConfirmResult => {
      setOptions({
        ...options,
        ...confirmOptions,
      });
      setIsOpen(true);

      return new Promise<boolean>((resolve) => {
        setResolveRef(() => resolve);
      });
    },
    [options]
  );

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(false);
  }, [resolveRef]);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    resolveRef?.(true);
  }, [resolveRef]);

  const ConfirmComponent = useCallback(
    () => (
      <ConfirmModal
        isOpen={isOpen}
        title={options.title || "Confirm"}
        message={options.message}
        confirmButtonText={options.confirmButtonText}
        cancelButtonText={options.cancelButtonText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        variant={options.variant}
      />
    ),
    [
      isOpen,
      options.title,
      options.message,
      options.confirmButtonText,
      options.cancelButtonText,
      options.variant,
      handleConfirm,
      handleCancel,
    ]
  );

  return { confirm, ConfirmComponent };
};

export default useConfirm; 