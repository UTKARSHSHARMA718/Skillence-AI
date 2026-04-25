"use client";

import usePreventNavigation from "@/common/hooks/usePreventNavigation";
import { useMicrophone } from "../hooks/useMicrophone";
import { Button } from "@/common/components/Button";
import { FaPlay, FaStop } from "react-icons/fa";
import { useVapi } from "@/common/hooks/useVapi";
import { useEffect, useState } from "react";
import ConfirmationModal from "@/common/components/ConfirmationModal";
import { useRouter } from "next/navigation";
import Transcript from "./Transcription";
import AiBallAnimation from "@/common/components/AiBallAnimation";
import clsx from "clsx";
import Image from "next/image";
import InterviewGuidelinesModal from "./GuidlinesPage";
import useFullScreen from "@/common/hooks/useFullScreen";
import { toast } from "react-toastify";

const SessionPage = ({ sessionId }: { sessionId: string }) => {
  const [showStopConfirm, setShowStopConfirm] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { MicrophoneStatus } = useMicrophone();
  // Remembers that the user wants to start, but mic wasn't ready yet
  const [pendingStart, setPendingStart] = useState(false);
  const [isSpeedTestModalOpen, setIsSpeedTestModalOpen] = useState(true);
  const { enterFullScreen, exitFullScreen } = useFullScreen();

  const {
    requestMicAndStart,
    stopInterview,
    callDuration,
    isConnected,
    transcript,
    micStatus,
    startInterview,
    isSpeaking,
  } = useVapi({
    sessionId,
    onErrorCallback: (errorMessage: string) => {
      setPendingStart(false);
      setIsLoading(false);
      toast.error(
        errorMessage ||
          "An error occurred during the interview. Please try again.",
      );
    },
    onStartCallback: () => setIsLoading(false),
    onEndCallback: () => {
      setIsLoading(false);
      router.push("/candidate/dashboard");
    },
  });

  usePreventNavigation(isConnected);
  const isCooldownTimeComplete = callDuration >= 10; // 10 seconds cooldown after stopping

  const handleStartClick = () => {
    if (micStatus !== "granted") {
      // Mic not granted yet — set pending flag, then request mic
      setPendingStart(true);
      onStartInterview();
    } else {
      // Mic already granted — start immediately
      startInterview();
    }
    setIsLoading(true);
  };

  const onStartInterview = async () => {
    requestMicAndStart({
      onFailGettingMicPermission: () => {
        setPendingStart(false);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    if (micStatus === "granted" && pendingStart) {
      onStartInterview();
    }
  }, [micStatus]);

  useEffect(() => {
    return () => {
      exitFullScreen();
    };
  }, []);

  const handleStopClick = () => {
    setShowStopConfirm(true);
  };

  const handleConfirmStop = () => {
    setShowStopConfirm(false);
    stopInterview();
    setIsLoading(true);
  };

  return (
    <>
      <InterviewGuidelinesModal
        isOpen={isSpeedTestModalOpen}
        onClose={() => setIsSpeedTestModalOpen(false)}
        minDownloadMbps={
          Number(process.env.NEXT_PUBLIC_DOWNLOAD_SPEED_LIMIT) || 0
        } // Example minimum
        minUploadMbps={Number(process.env.NEXT_PUBLIC_UPLOAD_SPEED_LIMIT) || 0} // Example minimum
        onCompleteFeasibilityTest={enterFullScreen}
      />
      <div
        className={clsx(
          "p-6 flex w-full flex-1 gap-6 min-h-0",
          isConnected ? "" : "max-w-xl mx-auto justify-center items-center",
        )}
      >
        {/* AI Interview Card */}
        <div
          className={clsx(
            "w-full bg-[radial-gradient(circle,rgba(238,174,202,1)_0%,rgba(148,187,233,1)_100%)] shadow-md rounded-2xl p-8 flex flex-col items-center gap-6 transition-all duration-500",
            isConnected ? "max-w-md" : "flex-1 min-h-0",
          )}
        >
          {/* Title */}
          <h1 className="text-2xl font-semibold text-gray-900">AI Reviewer</h1>

          {/* AI Avatar */}
          <div
            className={clsx(
              "flex flex-col items-center gap-4 flex-1 min-h-0",
              isConnected && "gap-0",
            )}
          >
            <AiBallAnimation />

            {isConnected && <AudioVisualizer isSpeaking={isSpeaking} />}
            <p className="text-sm text-gray-600">AI Voice Reviewer</p>

            {!isConnected && (
              <div className="bg-gray-100 px-5 py-3 rounded-lg text-sm text-gray-700 text-center max-w-sm">
                Click <b>Start Review</b> when you are ready. The AI will begin
                asking questions based on your selected topics.
              </div>
            )}

            {isConnected && (
              <div className="bg-gray-100 px-5 py-3 rounded-lg text-sm text-gray-700 text-center max-w-sm">
                Review in progress. Answer the AI questions clearly.
              </div>
            )}
          </div>

          {/* TIMER */}
          {isConnected && (
            <div className="text-3xl font-mono font-semibold text-gray-900">
              {formatDurationHHMMSS(callDuration)}
            </div>
          )}

          {/* MICROPHONE */}
          {!isConnected && <MicrophoneStatus />}

          {/* CONTROLS */}
          <div className="flex gap-4 pt-2">
            {!isConnected && (
              <Button
                onClick={handleStartClick}
                className="flex items-center gap-2 px-6"
                loading={isLoading}
              >
                <FaPlay />
                Start Review
              </Button>
            )}

            {isConnected && (
              <Button
                onClick={handleStopClick}
                loading={isLoading}
                disabled={!isCooldownTimeComplete}
                className="flex items-center gap-2 px-6 bg-red-600 hover:bg-red-700 text-white"
              >
                <FaStop />
                Stop Interview
              </Button>
            )}
          </div>
        </div>

        {/* TRANSCRIPT */}
        {isConnected && (
          <div className="w-full flex-1 min-h-0 bg-gray-100 shadow-md rounded-2xl p-6 flex flex-col animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Review Transcript
            </h2>

            <Transcript transcripts={transcript as any} />
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={showStopConfirm}
        heading="Stop Interview?"
        description="Are you sure you want to stop the interview? This action cannot be undone."
        onCancel={() => setShowStopConfirm(false)}
        onConfirm={handleConfirmStop}
        confirmText="Stop Interview"
        cancelText="Continue"
      />
    </>
  );
};

export default SessionPage;

function formatDurationHHMMSS(callDuration: number) {
  const hours = String(Math.floor(callDuration / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((callDuration % 3600) / 60)).padStart(
    2,
    "0",
  );
  const seconds = String(callDuration % 60).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function AudioVisualizer({ isSpeaking }: { isSpeaking: boolean }) {
  if (isSpeaking)
    return (
      <Image
        src="/gifs/audio_visualiser.gif"
        alt="Audio Visualizer"
        className="w-40"
        width={100}
        height={50}
      />
    );

  return (
    <Image
      src="/gifs/mute_audio_visualiser.gif"
      alt="Audio Visualizer"
      className="w-40"
      width={100}
      height={50}
    />
  );
}
