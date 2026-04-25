"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { useMicrophone } from "@/modules/candidate/session/hooks/useMicrophone";
import { useSession } from "next-auth/react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CallStatus =
  | "idle"
  | "mic-check"
  | "connecting"
  | "connected"
  | "ending"
  | "ended"
  | "error";

export interface TranscriptMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

export interface VapiMessage {
  type: string;
  role?: "assistant" | "user" | "system";
  transcript?: string;
  transcriptType?: "partial" | "final";
  functionCall?: {
    name: string;
    parameters: Record<string, unknown>;
  };
}

export interface StartInterviewParams {
  onFailGettingMicPermission?: () => void;
}

export interface UseVapiReturn {
  // State
  callStatus: CallStatus;
  isConnected: boolean;
  isSpeaking: boolean; // assistant is speaking
  isUserSpeaking: boolean; // user is speaking
  transcript: TranscriptMessage[];
  error: string | null;
  callDuration: number; // seconds

  // Microphone (from useMicrophone)
  micStatus: ReturnType<typeof useMicrophone>["status"];
  micDevice: ReturnType<typeof useMicrophone>["device"];
  MicrophoneButton: ReturnType<typeof useMicrophone>["MicrophoneButton"];
  MicrophoneStatus: ReturnType<typeof useMicrophone>["MicrophoneStatus"];

  // Actions
  requestMicAndStart: (params: StartInterviewParams) => Promise<void>;
  startInterview: () => Promise<void>;
  stopInterview: () => void;
  clearTranscript: () => void;
  clearError: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useVapi = ({
  sessionId,
  onStartCallback,
  onEndCallback,
  onErrorCallback,
}: {
  sessionId: string;
  onStartCallback?: () => void;
  onEndCallback?: () => void;
  onErrorCallback?: (errorMessage: string) => void;
}): UseVapiReturn => {
  const vapiRef = useRef<Vapi | null>(null);

  const [callStatus, setCallStatus] = useState<CallStatus>("idle");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const { data: session } = useSession();

  const durationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  const {
    status: micStatus,
    device: micDevice,
    requestPermission,
    MicrophoneButton,
    MicrophoneStatus,
  } = useMicrophone();

  // ── Initialise Vapi instance once ──────────────────────────────────────────
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
    if (!publicKey) {
      console.error("NEXT_PUBLIC_VAPI_PUBLIC_KEY is not set");
      return;
    }
    vapiRef.current = new Vapi(
      publicKey,
      process.env.NEXT_PUBLIC_API_BASE_URL + "/vapi",
    );

    return () => {
      vapiRef.current?.stop();
      vapiRef.current = null;
    };
  }, []);

  // ── Duration timer ──────────────────────────────────────────────────────────
  const startDurationTimer = useCallback(() => {
    durationIntervalRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  // ── Transcript helper ───────────────────────────────────────────────────────
  const addOrUpdateTranscript = useCallback(
    (role: "assistant" | "user", text: string, isFinal: boolean) => {
      setTranscript((prev) => {
        // Update the last partial message from the same role instead of appending
        if (!isFinal && prev.length > 0) {
          const last = prev[prev.length - 1];
          if (last.role === role && !last.isFinal) {
            return [
              ...prev.slice(0, -1),
              { ...last, text, timestamp: new Date() },
            ];
          }
        }

        return [
          ...prev,
          {
            id: `${role}-${Date.now()}-${Math.random()}`,
            role,
            text,
            timestamp: new Date(),
            isFinal,
          },
        ];
      });
    },
    [],
  );

  // ── Event listeners ─────────────────────────────────────────────────────────
  useEffect(() => {
    const vapi = vapiRef.current;
    if (!vapi) return;

    const handleCallStart = () => {
      setCallStatus("connected");
      setCallDuration(0);
      startDurationTimer();
      onStartCallback?.();
    };

    const handleCallEnd = () => {
      console.log("call ended from vapi");
      setCallStatus("ended");
      setIsSpeaking(false);
      setIsUserSpeaking(false);
      stopDurationTimer();
      onEndCallback?.();
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };
    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    // Note: VAPI fires volume-level for user — use as proxy for user speaking
    const handleVolumeLevel = (volume: number) => {
      setIsUserSpeaking(volume > 0.05);
    };

    const handleMessage = (message: VapiMessage) => {
      // Only capture transcript messages
      if (message.type !== "transcript") return;
      if (!message.transcript || !message.role) return;
      if (message.role === "system") return;

      const isFinal = message.transcriptType === "final";
      if (isFinal)
        addOrUpdateTranscript(message.role, message.transcript, isFinal);
    };

    const handleError = (err: Error) => {
      setError(err?.message ?? "Voice connection error");
      setCallStatus("error");
      stopDurationTimer();
      onErrorCallback?.((err as any)?.error?.message?.details || "");
    };

    vapi.on("call-start", handleCallStart);
    vapi.on("call-end", handleCallEnd);
    vapi.on("speech-start", handleSpeechStart);
    vapi.on("speech-end", handleSpeechEnd);
    vapi.on("volume-level", handleVolumeLevel);
    vapi.on("message", handleMessage);
    vapi.on("error", handleError);

    return () => {
      vapi.off("call-start", handleCallStart);
      vapi.off("call-end", handleCallEnd);
      vapi.off("speech-start", handleSpeechStart);
      vapi.off("speech-end", handleSpeechEnd);
      vapi.off("volume-level", handleVolumeLevel);
      vapi.off("message", handleMessage);
      vapi.off("error", handleError);
    };
  }, [startDurationTimer, stopDurationTimer, addOrUpdateTranscript]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  /** Start interview directly (assumes mic permission already granted) */
  const startInterview = useCallback(async () => {
    const vapi = vapiRef.current;
    if (!vapi) {
      setError("VAPI not initialised");
      return;
    }

    if (!sessionId) {
      setError("Missing required interview parameters");
      return;
    }

    if (micStatus !== "granted") {
      setError("Microphone permission is required before starting");
      return;
    }

    try {
      setError(null);
      setCallStatus("connecting");
      setTranscript([]);
      await vapi.start({
        sessionId,
        authToken: session?.accessToken,
      } as any);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to start interview";
      console.error("[useVapi] startInterview error:", err);
      setError(message);
      setCallStatus("error");
    }
  }, [micStatus]);

  /** Request mic permission first, then start interview */
  const requestMicAndStart = useCallback(
    async (params: StartInterviewParams) => {
      if (micStatus !== "granted") {
        setCallStatus("mic-check");
        await requestPermission(params?.onFailGettingMicPermission);

        // requestPermission updates state async — re-check after
        // The caller should watch micStatus and call startInterview when granted
        return;
      }

      await startInterview();
    },
    [micStatus, requestPermission, startInterview],
  );

  const stopInterview = useCallback(() => {
    setCallStatus("ending");
    vapiRef.current?.stop();
    stopDurationTimer();
  }, [stopDurationTimer]);

  const clearTranscript = useCallback(() => setTranscript([]), []);
  const clearError = useCallback(() => setError(null), []);

  return {
    // State
    callStatus,
    isConnected: callStatus === "connected",
    isSpeaking,
    isUserSpeaking,
    transcript,
    error,
    callDuration,

    // Microphone
    micStatus,
    micDevice,
    MicrophoneButton,
    MicrophoneStatus,

    // Actions
    requestMicAndStart,
    startInterview,
    stopInterview,
    clearTranscript,
    clearError,
  };
};
