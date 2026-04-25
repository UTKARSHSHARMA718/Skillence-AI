"use client";

import { Accordion } from "@/common/components/Accordian";
import { LightSessionDetails } from "../users.type";
import SessionAudioPlayer from "./SessionAudioPlayer";
import Transcript from "@/modules/candidate/session/components/Transcription";
import SessionReportDetails from "./SessionReportDetails";
import useGetSessionDetails from "@/modules/candidate/sessionForm/hooks/useGetSessionDetails";
import Loader from "@/common/components/Loader";
import ErrorCard from "@/common/components/ErrorCard";
import { Button } from "@/common/components/Button";
import { TbTrash } from "react-icons/tb";
import { RiProgress6Line } from "react-icons/ri";

interface Props {
  sessionNumber: number;
  session: LightSessionDetails;
  onDelete: (sessionId: string) => void;
}

export const SessionReportAccordion: React.FC<Props> = ({
  sessionNumber,
  session,
  onDelete,
}) => {
  return (
    <Accordion
      header={
        <div className="flex justify-between w-full items-center pr-2">
          <span className="font-medium">Session {sessionNumber}</span>
          <Button
            onClick={(event) => {
              onDelete(session.id);
              event.stopPropagation();
            }}
            variant="none"
            className="bg-red-500 text-white hover:bg-red-600 max-w-10 p-0! h-10"
          >
            <TbTrash size={20} />
          </Button>
        </div>
      }
    >
      {session.status === "COMPLETED" && (
        <SessionReportContent sessionId={session.id} />
      )}
      {session.status === "IN_PROGRESS" && (
        <div className="flex justify-center items-center gap-2">
          <RiProgress6Line size={30}/> Session in progress
        </div>
      )}
    </Accordion>
  );
};

const SessionReportContent = ({ sessionId }: { sessionId: string }) => {
  const { data, isLoading, error } = useGetSessionDetails({ sessionId });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[20vh]">
        <Loader size={30} />
      </div>
    );
  }

  if (error) {
    return <ErrorCard message={error?.response?.data?.message} />;
  }

  return (
    <div className="space-y-6">
      {/* AUDIO */}
      <SessionAudioPlayer audioUrl={data?.data?.audioUrl || ""} />

      {/* TRANSCRIPT */}
      <Transcript
        transcripts={data?.data?.transcript || []}
        className="max-h-100 flex-none"
      />

      {/* REPORT */}
      <SessionReportDetails report={data?.data?.report || null} />
    </div>
  );
};
