"use client";

interface Props {
  title: string;
  value: number | string;
  subtitle?: string;
}

import { GRADIENTS } from "@/common/config/constant";
import { useMemo } from "react";

export const StatsCard: React.FC<Props> = ({ title, value, subtitle }) => {
  const gradient = useMemo(() => {
    return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  }, []);

  return (
    <div className={`${gradient} text-black rounded-xl p-5 shadow-sm`}>
      <p className="text-sm opacity-80">{title}</p>

      <h2 className="text-2xl font-semibold mt-1">{value}</h2>

      {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
    </div>
  );
};
