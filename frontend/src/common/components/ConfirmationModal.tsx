"use client";

import { Button } from "./Button";
import CommonModal from "./CommonModal";

type ConfirmationModalProps = {
  isOpen: boolean;
  heading: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
};

export default function ConfirmationModal({
  isOpen,
  heading,
  description,
  loading,
  onCancel,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: ConfirmationModalProps) {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onCancel}
      title={heading}
      width="400px"
    >
      <div className="space-y-6">
        {description && <p className="text-gray-600 text-sm">{description}</p>}
        <div className="flex justify-end gap-3">
          <Button
            disabled={loading}
            onClick={onCancel}
            className="bg-gray-200 text-black hover:bg-gray-300"
          >
            {cancelText}
          </Button>
          <Button
            variant="none"
            disabled={loading}
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </CommonModal>
  );
}
