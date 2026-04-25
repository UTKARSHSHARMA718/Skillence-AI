"use client";

import clsx from "clsx";
import { Button } from "@/common/components/Button";

interface ActionCardProps {
  title: string;
  description: string;
  actionLabel: string;
  onClick?: () => void;
  className?: string;
  icon?: React.ReactNode;
}

const ActionCard: React.FC<ActionCardProps> = ({
  title,
  description,
  actionLabel,
  onClick,
  className,
  icon,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center text-center",
        "bg-white rounded-2xl border border-gray-200",
        "px-8 py-8 shadow-sm",
        "hover:shadow-md hover:-translate-y-1 transition-all duration-300",
        className,
      )}
    >
      {/* Icon */}
      <div className="text-5xl mb-4">{icon}</div>

      {/* Content */}
      <h3 className="text-3xl font-semibold text-gray-900">{title}</h3>

      <p className="text-sm text-gray-500 mt-2 max-w-xs">{description}</p>

      {/* Button */}
      <Button onClick={onClick} className="mt-6 w-full">
        {actionLabel}
      </Button>
    </div>
  );
};

export default ActionCard;
