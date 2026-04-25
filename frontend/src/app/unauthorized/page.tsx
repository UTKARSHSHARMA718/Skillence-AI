"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function UnauthorizedPage() {
  const { data: session } = useSession();

  const role = session?.user?.role;

  const getDashboardRoute = () => {
    if (role === "admin") return "/admin/dashboard";
    if (role === "candidate") return "/candidate/dashboard";
    return "/login";
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        {/* Error Code */}
        <h1 className="text-5xl font-semibold text-gray-900">403</h1>

        {/* Title */}
        <h2 className="mt-3 text-xl font-semibold text-gray-900">
          Access denied
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-500">
          You don’t have permission to access this page. Please return to your
          dashboard.
        </p>

        {/* CTA */}
        <Link
          href={getDashboardRoute()}
          className="
          inline-block
          mt-6
          px-5
          py-2.5
          text-sm
          font-medium
          text-white
          bg-gray-900
          rounded-lg
          hover:bg-black
          transition
          "
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
