"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>

      <h2 className="text-2xl font-semibold text-textPrimary mb-2">
        Page Not Found
      </h2>

      <p className="text-textSecondary mb-6 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>

      <Link
        href="/login"
        className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition"
      >
        Go to Login
      </Link>
    </div>
  );
}