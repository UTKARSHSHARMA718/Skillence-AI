"use client";

import { Button } from "@/common/components/Button";
import { useRouter } from "next/navigation";

const MaxSessionsReached = () => {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="bg-white border border-gray-200 shadow-md rounded-xl p-8 max-w-md w-full text-center flex flex-col items-center gap-4">
        <div className="text-4xl">⏳</div>

        <h2 className="text-xl font-semibold text-gray-900">
          Maximum Sessions Reached
        </h2>

        <p className="text-gray-600 text-sm">
          You have reached the maximum number of review sessions allowed.
        </p>

        <Button
          onClick={() => router.push("/candidate/dashboard/reports")}
          className="mt-2 px-5 py-2"
        >
          Go to My Progress
        </Button>
      </div>
    </div>
  );
};

export default MaxSessionsReached;
