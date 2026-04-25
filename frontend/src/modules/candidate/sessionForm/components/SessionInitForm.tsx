"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CommonTable from "@/common/components/DataTable";
import useGetTopics from "../hooks/useGetTopics";
import useSessionForm from "../hooks/useSessionForm";
import { TableColumn } from "react-data-table-component";
import { Topic } from "../sessions.types";
import { Button } from "@/common/components/Button";
import useGetUserSessionsHistory from "../hooks/useGetUserSessionsHistory";
import useCreateSession from "../hooks/useCreateSession";
import { toast } from "react-toastify";
import ErrorCard from "@/common/components/ErrorCard";
import Loader from "@/common/components/Loader";
import MaxSessionsReached from "./MaxSessionsReached";
import { PiWarningOctagonThin } from "react-icons/pi";

const MIN_TOPICS = 5;
const MAX_TOPICS = 20;

export default function SessionInitForm() {
  const router = useRouter();

  const { isLoading: isHistoryLoading, data: historyData } =
    useGetUserSessionsHistory();

  const { mutate: createSession, isPending: isCreatingSession } =
    useCreateSession({
      onSuccess: (data) => {
        toast.success(data.message);
        router.push("/candidate/dashboard/session/" + data.data.newSession.id);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message);
      },
    });
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [previouslySelectedTopics, setPreviouslySelectedTopics] = useState<
    string[]
  >([]);

  const { pagination, setPagination } = useSessionForm();

  const { data, isLoading, error } = useGetTopics({
    page: pagination.page,
    perPage: pagination.perPage,
  });

  const handleTopicToggle = (topicId: string) => {
    let updatedSelectedTopics = selectedTopics;
    if (selectedTopics.includes(topicId)) {
      updatedSelectedTopics = selectedTopics.filter((id) => id !== topicId);
    } else if (selectedTopics.length >= MAX_TOPICS) {
      toast.warn(`You can select a maximum of ${MAX_TOPICS} topics.`);
      updatedSelectedTopics = selectedTopics;
    } else {
      updatedSelectedTopics = [...selectedTopics, topicId];
    }
    setSelectedTopics(updatedSelectedTopics);
  };

  const handleStartSession = () => {
    createSession({
      topicIds: selectedTopics,
    });
  };

  useEffect(() => {
    if (historyData?.data?.currentSession) {
      setPreviouslySelectedTopics(historyData.data.topicsCovered ?? []);
    }
  }, [historyData]);

  const columns: TableColumn<Topic>[] = [
    {
      name: "Topic",
      grow: 3,
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700">
            {row.title.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-900">{row.title}</span>
        </div>
      ),
    },
    {
      name: "Status",
      grow: 1,
      cell: (row) => (
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            row.covered
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.covered ? "Covered" : "Pending"}
        </span>
      ),
    },
    {
      name: "Result",
      grow: 1,
      cell: (row) => {
        if (typeof row.isPass !== "boolean") {
          return (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              Pending
            </span>
          );
        }
        return (
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              row.isPass
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {row.isPass ? "Pass" : "Fail"}
          </span>
        );
      },
    },
    {
      name: "Select",
      width: "110px",
      center: true,
      cell: (row) => {
        const isPreviouslySelected = previouslySelectedTopics.includes(row.id);
        const isDisabled = row.covered || isPreviouslySelected;

        return (
          <input
            type="checkbox"
            checked={selectedTopics.includes(row.id) || row.isPass === false}
            disabled={isDisabled}
            onChange={() => handleTopicToggle(row.id)}
            title={
              isPreviouslySelected
                ? "Already selected in a previous session"
                : row.covered
                  ? "This topic is already covered"
                  : undefined
            }
            className="h-5 w-5 rounded border-gray-300 text-gray-900 focus:ring-gray-900 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          />
        );
      },
    },
  ];

  const isSelectionValid =
    selectedTopics.length >= MIN_TOPICS && selectedTopics.length <= MAX_TOPICS;
  const isLastSession = historyData?.data?.currentSession === 5;

  const getStartSessionButtonDisabledState = () => {
    if (isLastSession) {
      return false;
    }
    return !isSelectionValid || isCreatingSession;
  };

  if (isHistoryLoading) {
    return (
      <div className="flex flex-1 min-h-0 justify-center items-center">
        <Loader size={40} />
      </div>
    );
  }

  if (historyData?.data?.maxLimitReached) {
    return <MaxSessionsReached />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-6">
        <ErrorCard message={error?.response?.data?.message} />
      </div>
    );
  }

  return (
    <div className="py-8 px-6 min-w-225 w-full">
      <div className="max-w-4xl mx-auto flex flex-col gap-4 pb-8">
        {/* Page Header */}
        {!isLastSession && (
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-gray-900">
              Start a review for session {historyData?.data?.currentSession}
            </h1>
            <p className="text-sm text-gray-500">
              Choose the topics you want the AI to evaluate in this session.
              Select between {MIN_TOPICS} and {MAX_TOPICS} new topics.
            </p>
          </div>
        )}

        {/* Table Card */}
        {!isLastSession && (
          <CommonTable
            columns={columns}
            data={data?.data?.topics ?? []}
            loading={isLoading}
            pagination
            paginationOptions={{
              onPageChange: (page) => setPagination((p) => ({ ...p, page })),
              onPerPageChange: (newPerPage, page) =>
                setPagination((p) => ({ ...p, page, perPage: newPerPage })),
              page: pagination.page,
              perPage: pagination.perPage,
              totalRows: data?.data?.total ?? 0,
            }}
          />
        )}

        {isLastSession && (
          <div className="p-5 h-80 flex items-center justify-center bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3 max-w-md text-blue-900">
              {/* Icon */}
              <PiWarningOctagonThin size={30} className="min-w-fit" />

              {/* Message */}
              <p className="text-medium leading-relaxed break-words">
                In the <span className="font-semibold">final session</span>, all{" "}
                <span className="font-medium">failed</span> and{" "}
                <span className="font-medium">remaining topics</span> from
                previous sessions will be automatically included.
              </p>
            </div>
          </div>
        )}

        {/* Footer Action */}
        <div className="flex flex-col gap-1">
          {!isLastSession && (
            <div className="flex items-center gap-2 text-sm">
              <p className="text-gray-500">
                {selectedTopics.length} / {MAX_TOPICS}{" "}
                {selectedTopics.length === 1 ? "topic" : "topics"} selected
              </p>

              {!!historyData?.data?.totalFailedTopics && (
                <p className="text-red-500">
                  + {historyData.data.totalFailedTopics} previously failed
                </p>
              )}
            </div>
          )}
          {selectedTopics.length > 0 && selectedTopics.length < MIN_TOPICS && (
            <p className="text-sm text-red-500">
              Please select at least {MIN_TOPICS} topics to start a session.
            </p>
          )}

          <p className="text-sm text-amber-600">
            Previously failed topic will be automatically included in this
            session.
          </p>

          <div className="flex justify-end pt-2">
            <Button
              disabled={getStartSessionButtonDisabledState()}
              loading={isCreatingSession}
              className="w-auto px-6"
              onClick={handleStartSession}
            >
              Start Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
