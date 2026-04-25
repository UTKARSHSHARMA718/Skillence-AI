"use client";

import Modal from "react-modal";
import { ReactNode } from "react";

type CommonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: string;
  isHideCloseButton?: boolean;
};

Modal.setAppElement("body");

export default function CommonModal({
  isOpen,
  onClose,
  title,
  children,
  width = "500px",
  isHideCloseButton = false,
}: CommonModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      className="bg-white rounded-lg shadow-lg outline-none p-6"
      style={{
        content: {
          width,
          maxWidth: "90%",
          margin: "auto",
        },
      }}
    >
      <div className="flex justify-between items-center mb-4">
        {title && <h2 className="text-lg font-semibold">{title}</h2>}

        {!isHideCloseButton && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-lg"
          >
            ✕
          </button>
        )}
      </div>

      <div>{children}</div>
    </Modal>
  );
}
