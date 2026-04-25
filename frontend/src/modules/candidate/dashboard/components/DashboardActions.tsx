"use client";

import ActionCard from "@/common/components/ActionCard";
import { useRouter } from "next/navigation";
import { FaBrain } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

const DashboardActions = () => {
  const router = useRouter();

  return (
    <div className="flex-1  flex flex-col items-center">
      {/* Heading */}
      <div className="pt-20 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
          What would you like to do today?
        </h1>
      </div>

      {/* Cards */}
      <div className="max-w-2xl w-full mt-12 grid grid-cols-1 md:grid-cols-2">
        <ActionCard
          title="Evaluation"
          description="Launch the AI evaluator to start a new session."
          actionLabel="Launch"
          icon={<FaBrain size={48} className="text-gray-700" />}
          className="gap-4 max-w-80"
          onClick={() => router.push("/candidate/dashboard/session")}
        />

        <ActionCard
          title="My Progress"
          className="gap-4 max-w-80"
          description="View your performance feedback and history."
          actionLabel="View"
          icon={<FiTrendingUp size={48} className="text-gray-700" />}
          onClick={() => router.push("/candidate/dashboard/reports")}
        />
      </div>

    </div>
  );
};

export default DashboardActions;
