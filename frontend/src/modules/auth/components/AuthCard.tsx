import clsx from "clsx";
import React from "react";

export const AuthCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={clsx(`bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/40`, className)}
    >
      {children}
    </div>
  );
};