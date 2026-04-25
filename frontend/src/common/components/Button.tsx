"use client";

import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "none";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  loading,
  className,
  variant = "primary",
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={clsx(
        "cursor-pointer w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200",
        "disabled:opacity-60 disabled:cursor-not-allowed",

        // Variants
        variant === "primary" &&
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 active:scale-[0.98] shadow-sm",

        variant === "secondary" &&
          "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",

        className,
      )}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {loading ? "Please wait..." : children}
    </button>
  );
};
