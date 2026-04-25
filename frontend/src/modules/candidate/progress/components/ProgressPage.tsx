"use client";

import useGetAllSessionsOfUser from "@/modules/admin/users/hooks/useGetAllSessionsOfUser";
import CandidateReport from "./CandidateReport";
import { useSession } from "next-auth/react";
import Loader from "@/common/components/Loader";
import ErrorCard from "@/common/components/ErrorCard";
import { LightSessionDetails } from "@/modules/admin/users/users.type";

const ProgressPage = () => {
  const { data } = useSession();
  const {
    data: sessionsData,
    isLoading,
    error,
  } = useGetAllSessionsOfUser({
    userId: data?.user?.id || "",
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader size={50} />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message={error?.message || "An error occurred"} />;
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="max-w-5xl w-full mx-auto py-10 px-6 space-y-6">
        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PROFILE CARD */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xl font-semibold">
                {data?.user?.name?.charAt(0)?.toUpperCase() || "G"}
              </div>

              {/* status dot */}
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <h2 className="mt-3 font-semibold text-gray-900">
              {data?.user?.name || "HR user"}
            </h2>

            <p className="text-sm text-gray-500">
              {data?.user?.email || "hr.analyst@intelligentreviewer.com"}
            </p>

            <span className="mt-3 text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">
              {data?.user?.profile || "PROFESSIONAL ANALYST"}
            </span>
          </div>

          {/* PROGRESS CARD */}
          <div className="md:col-span-2 bg-white rounded-xl shadow-sm p-6 border">
            <InterviewProgressBar
              totalSessions={sessionsData?.data?.totalSessions || 0}
              completedSessions={sessionsData?.data?.totalSessionCompleted || 0}
              passedSessions={sessionsData?.data?.totalPassedSession || 0}
              failedSessions={sessionsData?.data?.totalFailedSession || 0}
            />
          </div>
        </div>
        {/* SESSION LIST */}
        <SessionHistory
          title="Completed Sessions History:"
          sessions={sessionsData?.data?.completedSessions || []}
          renderItem={(session) => (
            <CandidateReport
              key={session.id}
              sessionNumber={session?.sessionNumber}
              session={session}
            />
          )}
        />

        {!!sessionsData?.data?.inProgressSessions?.length && (
          <SessionHistory
            title="In-progress Sessions:"
            sessions={sessionsData?.data?.inProgressSessions || []}
            renderItem={(session) => (
              <CandidateReport
                key={session.id}
                sessionNumber={session?.sessionNumber}
                session={session}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ProgressPage;

function SessionHistory({
  title,
  sessions = [],
  renderItem,
}: {
  title?: string;
  sessions: LightSessionDetails[];
  renderItem: (session: LightSessionDetails) => React.ReactNode;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>

      {sessions.length > 0 && (
        <div className="space-y-3">
          {sessions.map((session) => renderItem(session))}
        </div>
      )}

      {sessions.length === 0 && (
        <p className="text-center text-gray-500 py-4">No sessions found</p>
      )}
    </div>
  );
}

interface Props {
  totalSessions: number;
  completedSessions: number;
  passedSessions: number;
  failedSessions: number;
}

const InterviewProgressBar: React.FC<Props> = ({
  totalSessions,
  completedSessions,
  passedSessions,
  // failedSessions,
}) => {
  const percent = totalSessions
    ? Math.round((completedSessions / totalSessions) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 tracking-wide">
            OVERALL PERFORMANCE
          </p>
          <h2 className="text-lg font-semibold text-blue-700">
            Progress Score
          </h2>
        </div>

        <span className="text-3xl font-bold text-gray-900">{percent}%</span>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-700 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <p className="text-gray-500 text-xs">SESSIONS STATUS</p>
          <p className="font-semibold text-gray-900">
            Passed ({passedSessions}/{completedSessions} Sessions)
          </p>
        </div>
      </div>
    </div>
  );
};
