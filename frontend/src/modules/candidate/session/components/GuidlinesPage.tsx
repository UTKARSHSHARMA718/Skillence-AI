"use client";

import { Button } from "@/common/components/Button";
import CommonModal from "@/common/components/CommonModal";
import useFeasibilityCheck from "@/common/hooks/useFeasibilityCheck";
import { useMicrophone } from "../hooks/useMicrophone";
import { FC, useEffect, useState } from "react";

type Step = 1 | 2 | 3;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  minDownloadMbps: number;
  minUploadMbps: number;
  onCompleteFeasibilityTest?: () => void;
}

const STEPS = ["Microphone", "Internet", "Ready"];

const InterviewGuidelinesModal: FC<Props> = ({
  isOpen,
  onClose,
  minDownloadMbps,
  minUploadMbps,
  onCompleteFeasibilityTest,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [speedWarning, setSpeedWarning] = useState<string | null>(null);

  const { requestPermission, status: micStatus, device } = useMicrophone();
  const { downloadSpeed, uploadSpeed, loading, testSpeed } =
    useFeasibilityCheck({
      downloadUrl: "/sessions/download/test-file",
      uploadUrl: "/sessions/upload/test-file",
    });

  const speedTestDone = downloadSpeed !== null && uploadSpeed !== null;
  const micOk = micStatus === "granted";
  const speedOk = speedTestDone && !speedWarning;

  useEffect(() => {
    if (speedTestDone) {
      if (downloadSpeed! < minDownloadMbps || uploadSpeed! < minUploadMbps) {
        setSpeedWarning(
          `Speed below minimum. Need ≥${minDownloadMbps} Mbps download and ≥${minUploadMbps} Mbps upload.`,
        );
      } else {
        setSpeedWarning(null);
      }
    }
  }, [
    downloadSpeed,
    uploadSpeed,
    minDownloadMbps,
    minUploadMbps,
    speedTestDone,
  ]);

  const onProcessToInterview = () => {
    onCompleteFeasibilityTest?.();
    onClose();
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={() => {}}
      isHideCloseButton
      title="Feasibility Check"
    >
      {/* Stepper Header */}
      <StepperHeader currentStep={currentStep} />

      {/* Step 1 — Microphone */}
      {currentStep === 1 && (
        <div>
          <Section title="Microphone check">
            <p className="text-sm text-gray-500 mb-3">
              We need access to your microphone for the AI review.
            </p>

            <StatusRow label="Permission" status={micStatus} />

            {micStatus === "granted" && device && (
              <div className="mt-3 space-y-1">
                <div className="text-sm bg-gray-50 border rounded-lg px-3 py-2">
                  🎙️ {device.label || "Microphone"}
                </div>
              </div>
            )}

            {micStatus === "denied" && <FixInstructions />}
          </Section>

          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={() => requestPermission()}
              loading={micStatus === "requesting"}
              className={
                micStatus === "granted"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : ""
              }
              variant={micStatus === "granted" ? "none" : "primary"}
            >
              {micStatus === "granted"
                ? "Re-check Microphone"
                : "Check Microphone"}
            </Button>
            <Button
              disabled={!micOk}
              onClick={() => setCurrentStep(2)}
            >
              Continue to Internet Check →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 — Internet */}
      {currentStep === 2 && (
        <div>
          <Section title="Internet speed check">
            <div className="bg-gray-50 border rounded-lg p-3 space-y-2 mb-3">
              <InfoRow
                label="Required Download"
                value={`≥ ${minDownloadMbps} Mbps`}
              />
              <InfoRow
                label="Required Upload"
                value={`≥ ${minUploadMbps} Mbps`}
              />
            </div>

            {loading && (
              <StatusText variant="muted">
                Testing your connection...
              </StatusText>
            )}

            {speedTestDone && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-2">
                <InfoRow
                  label="Your Download"
                  value={`${downloadSpeed} Mbps`}
                  highlight={downloadSpeed! >= minDownloadMbps ? "ok" : "fail"}
                />
                <InfoRow
                  label="Your Upload"
                  value={`${uploadSpeed} Mbps`}
                  highlight={uploadSpeed! >= minUploadMbps ? "ok" : "fail"}
                />
              </div>
            )}

            {speedWarning && (
              <StatusText variant="error">{speedWarning}</StatusText>
            )}

            {speedOk && (
              <StatusText variant="default">
                Your connection meets the requirements.
              </StatusText>
            )}
          </Section>

          <div className="flex flex-col gap-2 mt-4">
            <Button
              loading={loading}
              onClick={testSpeed}
              className={
                speedTestDone
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : ""
              }
              variant={speedTestDone ? "none" : "primary"}
            >
              {speedTestDone ? "Re-test Speed" : "Test Speed"}
            </Button>
            <Button
              disabled={!speedOk || loading}
              onClick={() => setCurrentStep(3)}
            >
              Continue →
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — All done */}
      {currentStep === 3 && (
        <div>
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 text-green-700 text-2xl">
              ✓
            </div>
            <p className="font-semibold text-gray-900 text-base">
              All checks passed!
            </p>
            <p className="text-sm text-gray-500 mt-1">
              You are ready to start your review.
            </p>
          </div>

          <div className="bg-gray-50 border rounded-lg divide-y text-sm text-gray-700 mb-4">
            <InfoRow label="Microphone" value="Granted ✓" />
            <InfoRow label="Download" value={`${downloadSpeed} Mbps ✓`} />
            <InfoRow label="Upload" value={`${uploadSpeed} Mbps ✓`} />
          </div>

          <Button onClick={onProcessToInterview}>Proceed to Review</Button>
        </div>
      )}
    </CommonModal>
  );
};

export default InterviewGuidelinesModal;

/* ─── Sub-components ─── */

const StepperHeader = ({ currentStep }: { currentStep: Step }) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => {
          const step = (i + 1) as Step;

          const state =
            step < currentStep
              ? "done"
              : step === currentStep
                ? "active"
                : "pending";
          return (
            <div
              key={label}
              className={`${step >= 2 ? "justify-center" : ""} flex w-20 items-center`}
            >
              {/* Step */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`
                    w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-200
                    ${
                      state === "done"
                        ? "bg-green-500 text-white shadow-sm"
                        : ""
                    }
                    ${
                      state === "active"
                        ? "bg-blue-600 text-white shadow-md scale-105"
                        : ""
                    }
                    ${
                      state === "pending"
                        ? "bg-gray-100 text-gray-400 border border-gray-200"
                        : ""
                    }
                  `}
                >
                  {state === "done" ? "✓" : step}
                </div>

                <span
                  className={`
                    mt-2 text-xs text-center transition-colors
                    ${
                      state === "active"
                        ? "text-blue-600 font-medium"
                        : "text-gray-500"
                    }
                  `}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
    {children}
  </div>
);

const InfoRow = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  highlight?: "ok" | "fail";
}) => (
  <div className="flex justify-between text-sm px-3 py-2">
    <span className="text-gray-500">{label}</span>
    <span
      className={`font-medium ${highlight === "ok" ? "text-green-700" : highlight === "fail" ? "text-red-600" : "text-gray-800"}`}
    >
      {value}
    </span>
  </div>
);

const StatusRow = ({ label, status }: { label: string; status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    idle: { label: "Pending", className: "bg-gray-100 text-gray-500" },
    requesting: {
      label: "Checking…",
      className: "bg-yellow-100 text-yellow-700",
    },
    granted: { label: "Granted", className: "bg-green-100 text-green-700" },
    denied: { label: "Denied", className: "bg-red-100 text-red-600" },
    unavailable: {
      label: "Not found",
      className: "bg-orange-100 text-orange-600",
    },
  };
  const badge = map[status] ?? map.idle;
  return (
    <div className="flex justify-between items-center py-2 border-b text-sm">
      <span className="text-gray-700">{label}</span>
      <span
        className={`text-xs px-2 py-0.5 rounded-md font-medium ${badge.className}`}
      >
        {badge.label}
      </span>
    </div>
  );
};

const StatusText = ({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "error" | "muted";
}) => {
  const styles = {
    default: "text-gray-800",
    error: "text-red-600 font-medium",
    muted: "text-gray-400",
  };
  return <p className={`text-xs mt-2 ${styles[variant]}`}>{children}</p>;
};

const FixInstructions = () => (
  <div className="mt-3 bg-gray-50 border rounded-lg p-3 text-xs text-gray-500 space-y-1">
    <p className="font-medium text-gray-700">How to fix:</p>
    <ol className="list-decimal list-inside space-y-0.5">
      <li>Click the lock icon in your browser address bar</li>
      <li>Set Microphone to &quot;Allow&quot;</li>
      <li>Refresh and try again</li>
    </ol>
  </div>
);
