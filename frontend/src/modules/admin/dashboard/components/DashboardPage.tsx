"use client";

import { StatsCard } from "@/modules/admin/dashboard/components/StatsCard";
import { ChartCard } from "@/modules/admin/dashboard/components/ChartCard";
import { ProfileDistributionChart } from "@/modules/admin/dashboard/components/ProfileDistributionChart";
import { SessionActivityChart } from "@/modules/admin/dashboard/components/SessionActivityChart";
import { CallCostAnalytics } from "@/modules/admin/dashboard/components/CallCostAnalytics";
import useGetUserAnalytics from "../hooks/useGetUserAnalytics";
import useGetCostAnalytics from "../hooks/useGetCostAnalytics";
import useGetSessionAnalytics from "../hooks/useGetSessionAnalytics";
import Loader from "@/common/components/Loader";
import ErrorCard from "@/common/components/ErrorCard";

export default function DashboardPage() {
  const {
    data: userAnalytics,
    isLoading: isUserAnalyticsLoading,
    error: userAnalyticsError,
  } = useGetUserAnalytics();
  const {
    data: costAnalytics,
    isLoading: isCostAnalyticsLoading,
    error: costAnalyticsError,
  } = useGetCostAnalytics();
  const {
    data: sessionAnalytics,
    isLoading: isSessionAnalyticsLoading,
    error: sessionAnalyticsError,
  } = useGetSessionAnalytics();

  const loading =
    isUserAnalyticsLoading ||
    isCostAnalyticsLoading ||
    isSessionAnalyticsLoading;

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Loader size={50} />
      </div>
    );
  }

  if (userAnalyticsError || costAnalyticsError || sessionAnalyticsError) {
    return (
     <div className="flex-1 flex justify-center items-center h-full">
       <ErrorCard
        message={
          userAnalyticsError?.response?.data?.message ||
          costAnalyticsError?.response?.data?.message ||
          sessionAnalyticsError?.response?.data?.message ||
          "Seomthing went wrong while fetching analytics data."
        }
      />
     </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Total Users"
          value={userAnalytics?.data?.totalUsers + ""}
        />
        <StatsCard
          title="Users Completed Review"
          value={userAnalytics?.data?.userCompletedAllSessions + ""}
        />
        <StatsCard
          title="Users In Progress"
          value={userAnalytics?.data?.usersWithSomeSessions + ""}
        />
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Total Sessions"
          value={sessionAnalytics?.data?.totalSessions + ""}
        />
        <StatsCard
          title="Passed Sessions"
          value={sessionAnalytics?.data?.passedSessions + ""}
        />
        <StatsCard
          title="Failed Sessions"
          value={sessionAnalytics?.data?.failedSessions + ""}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-1">
        <ChartCard title="User Profile Distribution">
          <ProfileDistributionChart
            data={userAnalytics?.data?.profiles || []}
          />
        </ChartCard>

        <ChartCard title="Session Activity (Last 30 Days)">
          <SessionActivityChart
            data={sessionAnalytics?.data?.last30DaysSessionsWithDate || []}
          />
        </ChartCard>
      </div>

      {/* Call Cost */}
      <CallCostAnalytics
        heading="Vapi Call Cost Analytics"
        subHeading1="Total Call Cost"
        subHeading2="Average Call Cost"
        totalCost={costAnalytics?.data?.totalCallCost || 0}
        avgCost={costAnalytics?.data?.averageCallCost || 0}
      />

      <CallCostAnalytics
        heading="Evaluation Cost Analytics"
        subHeading1="Total Evaluation Cost"
        subHeading2="Average Evaluation Cost"
        totalCost={costAnalytics?.data?.totalEvaluationCost || 0}
        avgCost={costAnalytics?.data?.averageEvaluationCost || 0}
      />

      <CallCostAnalytics
        heading="Total Cost Analytics"
        subHeading1="Total Cost"
        subHeading2="Average Cost"
        totalCost={costAnalytics?.data?.totalCost || 0}
        avgCost={costAnalytics?.data?.averageTotalCost || 0}
      />
    </div>
  );
}
