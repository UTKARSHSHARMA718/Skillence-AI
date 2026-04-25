"use client";

import React from "react";

type Variant = "default" | "success" | "error" | "warning" | "info";
type Size = "sm" | "md";

interface ChipProps {
  label: string;
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
};

const Chip: React.FC<ChipProps> = ({
  label,
  variant = "default",
  size = "md",
  icon,
  onClose,
  className = "",
}) => {
  return (
    <div
      className={`
        inline-flex items-center gap-1.5
        rounded-full font-medium
        max-w-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {/* Icon */}
      {icon && <span className="flex-shrink-0">{icon}</span>}

      {/* Label */}
      <span className="truncate">{label}</span>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="ml-1 flex-shrink-0 hover:opacity-70"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Chip;