"use client";

import { GRADIENTS } from "@/common/config/constant";
import { useMemo } from "react";

interface Props {
  totalCost: number;
  avgCost: number;
  heading: string;
  subHeading1: string;
  subHeading2: string;
}

export const CallCostAnalytics: React.FC<Props> = ({
  totalCost,
  avgCost,
  heading,
  subHeading1,
  subHeading2,
}) => {
  const gradientClass = useMemo(() => {
    return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  }, []);

  return (
    <div className={`${gradientClass} border border-gray-200 rounded-xl p-5 shadow-sm`}>
      <h3 className="text-sm font-medium text-gray-700 mb-4">{heading}</h3>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-gray-500">{subHeading1}</p>
          <p className="text-lg font-semibold text-gray-900">
            ${totalCost.toFixed(2)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">{subHeading2}</p>
          <p className="text-lg font-semibold text-gray-900">
            ${avgCost.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
