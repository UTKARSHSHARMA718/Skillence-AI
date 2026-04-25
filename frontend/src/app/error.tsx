"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold text-red-500 mb-4">
        Something Went Wrong
      </h1>

      <p className="text-textSecondary max-w-md mb-6">
        An unexpected error occurred. Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg transition"
      >
        Try Again
      </button>
    </div>
  );
}