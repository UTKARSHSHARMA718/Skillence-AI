"use client";

import Loader from "@/common/components/Loader";
import useGetUserDetails from "../hooks/useGetUserDetails";
import { SessionReportAccordion } from "./ReportsSection";
import useGetAllSessionsOfUser from "../hooks/useGetAllSessionsOfUser";
import { TbMoodEmpty } from "react-icons/tb";
import useDeleteUserSession from "../hooks/useDeleteUserSession";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import { useState } from "react";
import { LightSessionDetails } from "../users.type";

interface Props {
  userId: string;
}

const UserDetailsPage: React.FC<Props> = ({ userId }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState("");
  const { data, isLoading, error } = useGetUserDetails({ userId });
  const {
    data: sessionsData,
    isLoading: isSessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
  } = useGetAllSessionsOfUser({ userId });
  const { mutate: deleteSession, isPending: isDeletingSession } =
    useDeleteUserSession();

  if (isLoading || isSessionsLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <Loader size={40} />
      </div>
    );
  }

  if (error || sessionsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-sm text-red-600">
        Failed to load user details
      </div>
    );
  }

  const user = data?.data;

  return (
    <>
      <div className="py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {/* User Card */}
          <div className="bg-white border border-gray-200 rounded-xl">
            {/* Header */}
            <div className="flex flex-col items-center p-6 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-700">
                {user?.name?.charAt(0)}
              </div>

              <h2 className="mt-3 text-lg font-semibold text-gray-900">
                {user?.name}
              </h2>

              <p className="text-sm text-gray-500">{user?.profile}</p>
            </div>

            {/* Info */}
            <div className="p-6 space-y-5 text-sm">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-gray-800 mt-1">{user?.email}</p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Profile
                </p>
                <p className="text-gray-700 mt-1">{user?.profile}</p>
              </div>
            </div>
          </div>

          {/* Reports Section */}
          <SessionSection
            title="In-progress Sessions"
            sessions={sessionsData?.data.inProgressSessions || []}
            onDelete={setIsConfirmationModalOpen}
          />

          <SessionSection
            title="Session Reports"
            sessions={sessionsData?.data.completedSessions || []}
            onDelete={setIsConfirmationModalOpen}
          />
        </div>
      </div>
      <ConfirmationModal
        isOpen={!!isConfirmationModalOpen}
        onCancel={() => setIsConfirmationModalOpen("")}
        heading="Do you want to delete this session ?"
        loading={isDeletingSession}
        confirmText="Delete"
        description="This action cannot be undone."
        onConfirm={() => {
          deleteSession(
            { sessionId: isConfirmationModalOpen },
            {
              onSuccess: () => {
                setIsConfirmationModalOpen("");
                refetchSessions();
              },
            },
          );
        }}
      />
    </>
  );
};

export default UserDetailsPage;

const SessionSection = ({
  title,
  sessions = [],
  onDelete,
}: {
  title: string;
  sessions: LightSessionDetails[];
  onDelete: (sessionId: string) => void;
}) => {
  const isEmpty = !sessions.length;

  return (
    <div className="flex flex-col gap-3 bg-white p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">
        {title} ({sessions.length})
      </h3>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-2 bg-gray-50 h-24 rounded-md text-gray-500">
          <TbMoodEmpty size={28} />
          <p className="text-sm">
            {title === "In-progress Sessions"
              ? "No in-progress sessions yet"
              : "No session reports available"}
          </p>
        </div>
      ) : (
        sessions.map((session) => (
          <SessionReportAccordion
            key={session.id || session.sessionNumber}
            sessionNumber={session.sessionNumber}
            session={session}
            onDelete={(id) => onDelete(id)}
          />
        ))
      )}
    </div>
  );
};
