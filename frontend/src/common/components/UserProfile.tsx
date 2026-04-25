"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { CgProfile } from "react-icons/cg";
import useAuth from "@/modules/auth/hooks/useAuth";
import { Button } from "./Button";

const UserProfile: React.FC<{
  className?: string;
  onViewProfile?: () => void;
  userName?: string;
  userEmail?: string;
}> = ({ className, userName, userEmail }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: logout, isPending: isLogoutLoading } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={clsx("relative", className)}>
      {/* Avatar */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex items-center justify-center
          h-10 w-10
          rounded-full
          bg-white
          ring-1 ring-gray-200
          hover:ring-gray-300
          hover:bg-gray-50
          transition-all duration-200
          shadow-sm
        "
      >
        <CgProfile className="h-6 w-6 text-gray-600" />
      </button>

      {/* Dropdown */}
      <div
        className={clsx(
          "absolute right-0 mt-2 w-56 origin-top-right z-30",
          "transition-all duration-200 ease-out",
          open
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none",
        )}
      >
        <div
          className="
            bg-white
            rounded-xl
            shadow-lg
            ring-1 ring-black/5
            overflow-hidden
            p-2
          "
        >
          {/* User Info */}
          {(userName || userEmail) && (
            <div className="px-4 py-3 border-b border-gray-100">
              {userName && (
                <p className="text-sm font-medium text-gray-900">{userName}</p>
              )}
              {userEmail && (
                <p className="text-xs text-gray-500 truncate">{userEmail}</p>
              )}
            </div>
          )}

          {/* Logout */}
          <div className="py-1">
            <Button
              variant="none"
              onClick={() => logout()}
              loading={isLogoutLoading}
              className="
                w-full text-left
                px-4 py-2.5
                text-sm
                bg-red-500
                text-white
                hover:bg-red-600
                transition-colors
              "
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
