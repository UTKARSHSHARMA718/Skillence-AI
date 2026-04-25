"use client";

import { Accordion } from "@/common/components/Accordian";
import {
  LightSessionDetails,
  TopicEvaluation,
} from "@/modules/admin/users/users.type";
import Loader from "@/common/components/Loader";
import ErrorCard from "@/common/components/ErrorCard";
import dayjs from "dayjs";
import { RiProgress6Line } from "react-icons/ri";
import useGetSessionProgress from "../hooks/useGetSessionProgress";
import SessionReportDetails from "@/modules/admin/users/components/SessionReportDetails";
import clsx from "clsx";
import { BiFile } from "react-icons/bi";

interface Props {
  sessionNumber: number;
  session: LightSessionDetails;
}

const MAX_VISIBLE_CHIPS = 2;
const MAX_CHAR = 16;

const truncate = (text: string) => {
  if (!text) return "";
  return text.length > MAX_CHAR ? text.slice(0, MAX_CHAR) + "…" : text;
};

const renderChips = (chips: TopicEvaluation[]) => {
  const visible = chips.slice(0, MAX_VISIBLE_CHIPS);
  const remaining = chips.length - MAX_VISIBLE_CHIPS;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {visible.map((chip, index) => (
        <span
          key={index}
          className={clsx(
            "px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full",
            chip.passed
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700",
          )}
        >
          {truncate(chip.title)}
        </span>
      ))}

      {remaining > 0 && (
        <span className="text-xs text-gray-500 font-medium">+{remaining}</span>
      )}
    </div>
  );
};

function SessionCard({ session, sessionNumber }: any) {
  const chips = session.topicEvaluations || [];
  const isPass = session.overAllResult;
  const isResultAvailable = typeof session.overAllResult === "boolean";

  return (
    <div className="flex w-full items-start justify-between bg-white rounded-lg p-4 transition">
      {/* LEFT */}
      <div className="flex items-start gap-3">
        {/* icon */}
        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
          <BiFile size={30}/>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-gray-900">
            Session {sessionNumber}
          </span>

          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs text-gray-500">
              {dayjs(session.createdAt).format("DD MMM YYYY")}
            </span>
            {chips?.length > 0 && renderChips(chips)}
          </div>
        </div>
      </div>

      {/* RIGHT */}
     {isResultAvailable && <span
        className={`text-xs font-semibold px-3 py-1 rounded-full ${
          isPass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {isPass ? "PASSED" : "FAILED"}
      </span>}
    </div>
  );
}

const CandidateReport: React.FC<Props> = ({ sessionNumber, session }) => {
  return (
    <Accordion
      header={<SessionCard session={session} sessionNumber={sessionNumber} />}
    >
      {session?.status === "COMPLETED" ? (
        <CandidateReportContent sessionId={session.id} />
      ) : (
        <div className="flex gap-2 justify-center items-center">
          <RiProgress6Line size={30} />
          <p className="font-bold text-gray-500">Session in progress...</p>
        </div>
      )}
    </Accordion>
  );
};

export default CandidateReport;

const CandidateReportContent: React.FC<{ sessionId: string }> = ({
  sessionId,
}) => {
  const { isLoading, data, error } = useGetSessionProgress({ sessionId });

  if (isLoading) {
    return (
      <div className="py-6 flex justify-center">
        <Loader size={40} />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message={error?.response?.data?.message} />;
  }

  const report = data?.data;

  return <SessionReportDetails report={report || null} />;
};
