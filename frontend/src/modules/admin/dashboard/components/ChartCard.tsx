"use client";

import { GRADIENTS } from "@/common/config/constant";
import { useMemo } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<Props> = ({ title, children }) => {
  const gradientClass = useMemo(() => {
    return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  }, []);

  return (
    <div
      className={`${gradientClass} border border-gray-200 rounded-xl p-5 shadow-sm`}
    >
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>

      <div className="w-full h-75">{children}</div>
    </div>
  );
};
