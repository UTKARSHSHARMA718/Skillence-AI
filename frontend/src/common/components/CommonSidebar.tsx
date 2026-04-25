"use client";

import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Link from "next/link";
import { LogoSvg } from "@/libs/svgs/SvgImage";

export type CommonSidebarItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isVisible?: boolean;
};

type CommonSidebarProps = {
  items: CommonSidebarItem[];
  logoRedirect?: string;
  footer?: React.ReactNode;
  className?: string;
};

const CommonSidebar: React.FC<CommonSidebarProps> = ({
  items,
  logoRedirect,
  footer,
  className,
}) => {
  const pathname = usePathname();

  return (
    <aside
      className={clsx(
        "flex h-screen w-64 flex-col justify-between",
        "bg-gradient-to-b from-[#0B1E3A] to-[#0A1A33] text-white",
        className,
      )}
    >
      {/* Top Section */}
      <div>
        {/* Logo */}
        <Link
          href={logoRedirect || "/"}
          className="flex items-center gap-3 px-6 py-5 justify-center"
        >
          <LogoSvg />
        </Link>

        {/* Menu */}
        <nav className="mt-4 px-3 space-y-2">
          {items
            .filter((item) => item.isVisible !== false)
            .map((item, index) => {
              const isActive = item.href && pathname === item.href;

              const baseClasses =
                "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200";

              const activeClasses =
                "bg-white/10 text-white shadow-inner backdrop-blur";

              const inactiveClasses =
                "text-gray-300 hover:bg-white/5 hover:text-white";

              if (item.href) {
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={clsx(
                      baseClasses,
                      "text-[15px]",
                      isActive ? activeClasses : inactiveClasses,
                    )}
                  >
                    {item.icon && (
                      <span
                        className={clsx(
                          "text-lg",
                          isActive ? "text-white" : "text-gray-400",
                        )}
                      >
                        {item.icon}
                      </span>
                    )}
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className={clsx(
                    baseClasses,
                    inactiveClasses,
                    "cursor-pointer",
                  )}
                >
                  {item.icon && (
                    <span className="text-gray-400 text-lg">{item.icon}</span>
                  )}
                  {item.label}
                </button>
              );
            })}
        </nav>
      </div>

      {/* Footer */}
      {footer && (
        <div className="border-t border-white/10 px-4 py-4">{footer}</div>
      )}
    </aside>
  );
};

export default CommonSidebar;
