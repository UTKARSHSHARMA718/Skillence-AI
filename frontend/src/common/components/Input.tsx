"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FieldError } from "react-hook-form";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: FieldError;
}

export const Input: React.FC<InputProps> = ({
  label,
  type,
  error,
  ...rest
}) => {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label */}
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {/* Input wrapper */}
      <div className="relative">
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          {...rest}
          className={clsx(
            "w-full px-3 py-2.5 text-sm rounded-lg",
            "bg-white/90 backdrop-blur-sm",
            "border transition-all duration-200",
            "placeholder:text-gray-400",
            "shadow-sm",

            error
              ? "border-red-400 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              : "border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",

            "focus:outline-none pr-10",
          )}
        />

        {/* Password toggle */}
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
          </button>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
    </div>
  );
};
